import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Card from '../Card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { MoveRight, MoveLeft } from 'lucide-react';
import StepsIndicator from '@/components/StepsIndicator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"

const formSchema = z.object({
    token: z
        .string()
        .min(6, { message: 'Please enter a valid token.' })
        .max(8, { message: 'Please enter a valid token.' }),
});

interface MFASetupProps {
    initialMfaEnabled: boolean;
}

const MFASetup = ({ initialMfaEnabled }: MFASetupProps) => {
    // State to track if MFA is enabled on the account.
    const [mfaEnabled, setMfaEnabled] = useState(initialMfaEnabled);
    // Existing states for the MFA setup flow.
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [provisioningUri, setProvisioningUri] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // Auth context – note: disableMfa should be implemented in your context.
    const { initiateMfaSetup, confirmMfaSetup, disableMfa } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { token: '' },
    });

    // Start the MFA enable process by fetching the QR code and provisioning URI.
    const handleEnableMfa = async () => {
        setLoading(true);
        setErrorMsg('');
        const result = await initiateMfaSetup();
        if (result.success) {
            setQrCode(result.qrCode || null);
            setProvisioningUri(result.provisioningUri || null);
        } else {
            setErrorMsg(result.error || 'An error occurred.');
        }
        setLoading(false);
    };

    // Confirm MFA setup using the token entered by the user.
    const handleConfirmMfa = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setErrorMsg('');
        const result = await confirmMfaSetup(values.token);
        if (result.success) {
            toast(
                <div>
                    <p>MFA has been successfully enabled!</p>
                </div>
            );
            // Once the flow is completed, mark MFA as enabled.
            setMfaEnabled(true);
        } else {
            setErrorMsg(result.error || 'An unknown error occurred.');
        }
        setLoading(false);
    };

    // Confirm the action to disable MFA (with any extra re-authentication logic you may need).
    const confirmDisableMfa = async () => {
        setLoading(true);
        setErrorMsg('');
        const result = await disableMfa(); // disableMfa should handle the server logic
        if (result.success) {
            toast(
                <div>
                    <p>MFA has been disabled.</p>
                </div>
            );
            setMfaEnabled(false);
            // Optionally, reset your MFA setup flow states.
            setQrCode(null);
            setProvisioningUri(null);
            setActiveStep(0);
        } else {
            setErrorMsg(result.error || 'An error occurred while disabling MFA.');
        }
        setLoading(false);
    };

    // Define the steps for the MFA setup carousel.
    const steps = [
        // Step 1: Show QR Code and provisioning URI.
        (
            <div key="step1" className="space-y-6">
                <div>
                    <h2 className="text-2xl">Scan the QR Code on your authenticator app.</h2>
                </div>
                {qrCode && (
                    <div className="flex justify-center">
                        <Card className='md:w-2/3'>
                            <img
                                src={`data:image/png;base64,${qrCode}`}
                                alt="MFA QR Code"
                                className="sm:w-full sm:h-full"
                            />
                        </Card>
                    </div>
                )}
                <div className="space-y-2">
                    <p className="font-semibold">
                        If you cannot scan the QR code, enter the following code manually in your authenticator app:
                    </p>
                    <p className="break-all">{provisioningUri}</p>
                </div>
            </div>
        ),
        // Step 2: Form to confirm MFA token.
        (
            <div key="step2" className="space-y-2">
                <h2 className="text-2xl">Enter MFA Token</h2>
                <Card>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleConfirmMfa)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="token"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Enter MFA Token to confirm it</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Check your authenticator app for the MFA token.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {errorMsg && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{errorMsg}</AlertDescription>
                                </Alert>
                            )}
                            {loading ? (
                                <Button disabled>
                                    <Loader2 className="animate-spin" />
                                    Loading...
                                </Button>
                            ) : (
                                <Button type="submit">Submit</Button>
                            )}
                        </form>
                    </Form>
                </Card>
            </div>
        ),
    ];

    return (
        <>
            <h1 className="text-3xl font-semibold">Multi-Factor Authentication</h1>
            {/* If MFA is not yet enabled, show the enable flow */}
            {!mfaEnabled ? (
                <>
                    {!qrCode ? (
                        loading ? (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Loading...
                            </Button>
                        ) : (
                            <Button onClick={handleEnableMfa}>Enable MFA</Button>
                        )
                    ) : (
                        <div className="space-y-6">
                            <StepsIndicator steps={['Scan QR Code', 'Enter MFA Token']} currentStep={activeStep} />
                            {steps[activeStep]}
                            <div className="flex justify-between">
                                {activeStep > 0 && (
                                    <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)}>
                                        <MoveLeft /> Previous
                                    </Button>
                                )}
                                {activeStep < steps.length - 1 && (
                                    <Button variant="outline" onClick={() => setActiveStep(activeStep + 1)}>
                                        Next <MoveRight />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // When MFA is already enabled, show a simple "Disable MFA" button.
                <Dialog>
                    <div className="space-y-6">
                        <p>MFA is currently enabled on your account.</p>
                        <Button variant="destructive" asChild>
                            <DialogTrigger>
                                Disable MFA
                            </DialogTrigger>
                        </Button>
                    </div>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This will delete your MFA setup and you will need to set it up again if you wish to re-enable it in the future.
                            </DialogDescription>
                            {errorMsg && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{errorMsg}</AlertDescription>
                                </Alert>
                            )}
                            <div className="flex justify-between mt-4">
                                <DialogClose asChild>
                                    <Button variant="secondary" size="sm">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                {loading ? (
                                    <Button disabled variant="destructive">
                                        <Loader2 className="animate-spin" />
                                        Loading...
                                    </Button>
                                ) : (
                                    <Button onClick={confirmDisableMfa} variant="destructive">
                                        Yes, remove MFA
                                    </Button>
                                )}
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default MFASetup;
