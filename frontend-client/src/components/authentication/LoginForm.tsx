import { useState } from 'react';
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
import Card from "@/components/Card"
import { Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { login, checkIfClient } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMsg('');

        // check if it is a client, if yes continue
        const isClient = await checkIfClient(values.email);

        // if it is a client, login
        if (isClient.success == true && isClient.data.is_client === true) {
            const response = await login(values.email, values.password);
            if (response.success) {
                toast(
                    <div>
                        <p>You have successfully logged in, {response.data.first_name} {response.data.last_name}!</p>
                    </div>
                );
                navigate('/');
            } else {
                if (response.error?.error) {
                    setErrorMsg(response.error.error);
                } else if (response.error?.non_field_errors) {
                    setErrorMsg(response.error.non_field_errors.join(' '));
                } else {
                    setErrorMsg("An unknown error occurred. Please try again later.");
                }
            }
        } else if (isClient.success == true && isClient.data.is_client === false) { // if it is a supplier, show error
            setErrorMsg("Please log in using the supplier login page.");
        } else if (isClient.success == false) {
            console.log("there was an error", isClient.error);
            setErrorMsg(isClient.error);
        } else {
            setErrorMsg("An unknown error occurred. Please try again later.");
        }

        setLoading(false);
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
                        <Button variant="link" className='p-0' onClick={() => navigate('/forgot-password')}>I forgot my password</Button>
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
    )
}

export default LoginForm;