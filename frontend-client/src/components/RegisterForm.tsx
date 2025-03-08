"use client"
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
} from "./ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

const formSchema = z.object({
    first_name: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    number: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    address: z.string().min(5, {
        message: "Please enter a valid address.",
    }),
    postcode: z.string().min(3, {
        message: "Please enter a valid postcode.",
    }),
    company_name: z.string().optional(),
    dob: z.string().min(10, {
        message: "Please enter a valid date of birth.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirm_password: z.string().min(8, {
        message: "Confirm password must be at least 8 characters.",
    }),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // path of error
});

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            number: "",
            address: "",
            postcode: "",
            company_name: "",
            dob: "",
            password: "",
            confirm_password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMsg('');

        const response = await register(
            values.first_name,
            values.last_name,
            values.email,
            values.number,
            values.address,
            values.postcode,
            values.company_name ?? '',
            values.dob,
            values.password
        );

        if (response.success) {
            toast(
                <div>
                    <p>You have successfully registered, {values.first_name}!</p>
                </div>
            );
            navigate('/login');
            window.scrollTo(0, 0); // Scroll to the top of the page
        } else {
            if (response.error?.email) {
                setErrorMsg(response.error.email);
            } else if (response.error?.message) {
                setErrorMsg(response.error.message);
            } else {
                setErrorMsg("An unknown error occurred. Please try again later.");
            }
        }

        setLoading(false);
    }

    return (
        <div className="flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Only your first name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter only your last name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" />
                                </FormControl>
                                <FormDescription>
                                    This will be used to sign in.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel className="text-left">Phone Number</FormLabel>
                                <FormControl className="w-full">
                                    <PhoneInput defaultCountry="AU" placeholder="Enter a phone number" {...field} />
                                </FormControl>
                                <FormDescription className="text-left">
                                    Enter a phone number
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your home address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="postcode"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Postcode</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter a valid postcode.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>
                                    Company Name <span className='font-extralight'>(optional)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your company name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input {...field} type='date' />
                                </FormControl>
                                <FormDescription>
                                    Enter your date of birth.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                    This will be used to sign in.
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
                                    Re-enter your password.
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
        </div>
    )
}

export default RegisterForm
