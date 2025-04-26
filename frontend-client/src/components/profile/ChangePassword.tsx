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
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import Card from '@/components/Card';
import { useMutation } from '@tanstack/react-query';

const formSchema = z.object({
    current_password: z.string().min(8, {
        message: "Must be at least 8 characters.",
    }),
    new_password: z.string().min(8, {
        message: "Must be at least 8 characters.",
    }),
    confirm_password: z.string().min(8, {
        message: "Must be at least 8 characters.",
    }),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

const ChangePassword = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    // We'll remove manual loading state and instead rely on the mutation's status.
    const [errorMsg, setErrorMsg] = useState('');
    const { changePassword } = useAuth();
    const navigate = useNavigate();

    // Define a mutation with explicit generics:
    // TData: { success: boolean; error?: any }
    // TError: Error
    // TVariables: { current_password: string; new_password: string }
    // TContext: unknown
    const changePasswordMutation = useMutation<
        { success: boolean; error?: any },
        Error,
        { current_password: string; new_password: string },
        unknown
    >({
        mutationFn: async ({ current_password, new_password }) => {
            return await changePassword(current_password, new_password);
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setErrorMsg('');
        try {
            const response = await changePasswordMutation.mutateAsync({
                current_password: values.current_password,
                new_password: values.new_password,
            });
            if (response.success) {
                toast(
                    'You have successfully updated your password.'
                );
            } else {
                if (response.error?.current_password) {
                    setErrorMsg(response.error.current_password);
                } else {
                    setErrorMsg("An unknown error occurred. Please try again later.");
                }
            }
        } catch (error: any) {
            setErrorMsg(error.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="current_password"
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormDescription>Must be at least 8 characters.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormDescription>Must match the new password.</FormDescription>
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
                {changePasswordMutation.status === 'pending' ? (
                    <Button disabled>
                        <Loader2 className="animate-spin" />
                        Loading...
                    </Button>
                ) : (
                    <Button type="submit">Change Password</Button>
                )}
            </form>
        </Form>
    );
};

export default ChangePassword;
