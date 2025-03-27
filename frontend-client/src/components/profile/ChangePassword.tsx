import { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import Card from '@/components/Card';

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
    path: ["confirm_password"], // path of error
});

const UpdateProfileForm = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    })

    // UPDATE user
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { changePassword } = useAuth();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMsg('');
        const response = await changePassword(values.current_password, values.new_password);

        if (response.success) {
            toast(
                <div>
                    <p>You have successfully updated your password.</p>
                </div>
            );
        } else {
            console.log(response);
            if (response.error?.current_password) {
                setErrorMsg(response.error.current_password);
            } else {
                setErrorMsg("An unknown error occurred. Please try again later.");
            }
        }

        setLoading(false);
    }

    return (
        <>
            <Card>
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
                                    <FormDescription>
                                        Must be at least 8 characters.
                                    </FormDescription>
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
                                    <FormDescription>
                                        Must match the new password.
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
                            <Button type="submit">Change Password</Button>
                        )}
                    </form>
                </Form>
            </Card>
        </>
    )

}

export default UpdateProfileForm;