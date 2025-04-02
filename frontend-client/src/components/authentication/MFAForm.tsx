import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

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
import Card from "@/components/Card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    token: z.string().max(6, {
        message: "Please enter a valid token.",
    }).min(6, {
        message: "Please enter a valid token.",
    }),
})

interface MfaFormProps {
    tempToken: string;
}

export function MfaForm({ tempToken }: MfaFormProps) {
    const [mfaCode, setMfaCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyMfa, fetchUserDetails } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: "",
        },
    })

    async function handleMfaSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMsg('');
        const result = await verifyMfa(tempToken, values.token);
        if (result.success) {
            const userDetails = await fetchUserDetails();
            if (userDetails.success) {
                toast(
                    <div>
                        <p>
                            You have successfully logged in, {userDetails.data.first_name} {userDetails.data.last_name}!
                        </p>
                    </div>
                );
            } else {
                toast(
                    <div>
                        <p>
                            You have successfully logged in!
                        </p>
                    </div>
                );
            }
            navigate('/');
        } else {
            setErrorMsg(result.error || 'An error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleMfaSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Enter MFA Token</FormLabel>
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
    );
}

export default MfaForm;
