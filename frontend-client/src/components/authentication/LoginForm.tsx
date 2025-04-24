import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Card from "@/components/Card";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import MfaForm from './MFAForm';
import { useMutation } from '@tanstack/react-query';

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

// Define the type returned by your login function.
type LoginResponse = {
    success: boolean;
    data?: any;
    error?: any;
    mfaRequired?: boolean;
    temp_token?: string;
};

export function LoginForm() {
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const { login, checkIfClient, fetchUserDetails } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useMutation<LoginResponse, Error, { email: string; password: string }, unknown>({
        mutationFn: async (values: { email: string; password: string }): Promise<LoginResponse> => {
            // First, check if the user is a client.
            const isClient = await checkIfClient(values.email);
            console.log(isClient);
            if (isClient.success && isClient.data.is_client === true && isClient.data.user_exists === true) {
                const response = await login(values.email, values.password);
                if (!response.success) {
                    console.log(response.error);
                    if (response.error?.error) {
                        throw new Error(response.error.error);
                    } else if (response.error?.detail) {
                        throw new Error(response.error.detail);
                    } else if (response.error?.non_field_errors) {
                        throw new Error(response.error.non_field_errors.join(' '));
                    } else {
                        throw new Error("An unknown error occurred. Please try again later.");
                    }
                }
                return response;
            } else if (isClient.success && isClient.data.is_client === false && isClient.data.user_exists === true) {
                throw new Error("Please log in using the supplier login page.");
            } else if (isClient.success && isClient.data.is_client === false && isClient.data.user_exists === false) {
                throw new Error("User does not exist. Please register.");
            } else if (!isClient.success) {
                throw new Error(isClient.error);
            }
            throw new Error("An unknown error occurred. Please try again later.");
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrorMsg('');
        try {
            const response = await loginMutation.mutateAsync(values);
            if (response.mfaRequired) {
                setTempToken(response.temp_token ?? null);
            } else {
                const userDetails = await fetchUserDetails();
                if (userDetails.success) {
                    toast(
                        `You have successfully logged in, ${userDetails.data.first_name} ${userDetails.data.last_name}!`
                    );
                } else {
                    toast(
                        'You have successfully logged in!'
                    );
                }
                navigate('/');
            }
        } catch (error: any) {
            setErrorMsg(error.message);
        }
    }

    if (tempToken) {
        return <MfaForm tempToken={tempToken} />;
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the email address you used to sign up.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the password you used to sign up.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="link" className="p-0" onClick={() => navigate('/forgot-password')}>
                            I forgot my password
                        </Button>
                    </div>

                    {errorMsg && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {errorMsg}
                            </AlertDescription>
                        </Alert>
                    )}
                    {loginMutation.status === 'pending' ? (
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

export default LoginForm;
