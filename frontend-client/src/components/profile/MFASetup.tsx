import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner"
import Card from '../Card';

// Form imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const formSchema = z.object({
    token: z.string().max(6, {
        message: "Please enter a valid token.",
    }).min(6, {
        message: "Please enter a valid token.",
    }),
})

const MfaSetup = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [provisioningUri, setProvisioningUri] = useState<string | null>(null);
    const [mfaCode, setMfaCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { initiateMfaSetup, confirmMfaSetup } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: "",
        },
    })

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

    async function handleConfirmMfa(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMsg('');
        const result = await confirmMfaSetup(values.token);
        if (result.success) {
            toast(
                <div>
                    <p>MFA has been successfully enabled!</p>
                </div>
            );
        } else {
            setErrorMsg(result.error || 'An unknown error occurred.');
        }
        setLoading(false);
    };

    return (
        <>
            <h1 className='text-3xl font-semibold'>Enable Multi-Factor Authentication</h1>

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
                <div className='space-y-6'>
                    <div>
                        <h2 className='text-2xl'>Step 1:</h2>
                        <p>Scan the QR Code on your authenticator app.</p>
                    </div>
                    {qrCode && (
                        <Card>
                            <img
                                src={`data:image/png;base64,${qrCode}`}
                                alt="MFA QR Code"
                                className='sm:w-full sm:h-full'
                            />
                        </Card>
                    )}
                    <div className='space-y-2'>
                        <p className='font-semibold'>
                            If you cannot scan the QR code, enter the following code manually in your authenticator app:
                        </p>
                        <p className='break-all'>{provisioningUri}</p>
                    </div>
                    <div className='h-3'></div>
                    <div className='space-y-2'>
                        <h2 className='text-2xl'>Step 2:</h2>
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
                                            <AlertDescription>
                                                {errorMsg}
                                            </AlertDescription>
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
                </div>
            )}
        </>
    );
};

export default MfaSetup;