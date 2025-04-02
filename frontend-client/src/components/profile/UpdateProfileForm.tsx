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
import { PhoneInput } from "@/components/ui/phone-input";
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
})

interface ProfileValues {
    first_name: string;
    last_name: string;
    email: string;
    number: string;
    address: string;
    postcode: string;
    company_name?: string;
    dob: string;
}

const UpdateProfileForm = ({ values }: { values: ProfileValues }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            number: values.number,
            address: values.address,
            postcode: values.postcode,
            company_name: values.company_name ?? '',
            dob: values.dob,
        },
    })

    // UPDATE user
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { updateUser } = useAuth();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMsg('');

        const response = await updateUser(values);

        if (response.success) {
            toast(
                <div>
                    <p>You have successfully updated your account details.</p>
                </div>
            );
        } else {
            console.log(response);
            if (response.error?.detail) {
                setErrorMsg(response.error.detail);
            } else if (response.error?.message) {
                setErrorMsg(response.error.message);
            }
        }

        setLoading(false);
    }

    return (
        <>
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className='md:flex gap-10 space-y-6 md:space-y-0'>
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }: { field: any }) => (
                                    <FormItem className='flex-auto'>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }: { field: any }) => (
                                    <FormItem className='flex-auto'>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" disabled />
                                    </FormControl>
                                    <FormDescription>
                                        This is used for signing in, you cannot change this.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='md:flex gap-10 space-y-6 md:space-y-0'>
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start md:flex-1">
                                        <FormLabel className="text-left">Phone Number</FormLabel>
                                        <FormControl className="w-full">
                                            <PhoneInput defaultCountry="AU" placeholder="Enter a phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }: { field: any }) => (
                                    <FormItem className='md:flex-none'>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input {...field} type='date' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='md:flex gap-10 space-y-6 md:space-y-0'>
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }: { field: any }) => (
                                    <FormItem className='md:flex-1'>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="postcode"
                                render={({ field }: { field: any }) => (
                                    <FormItem className='md:flex-none'>
                                        <FormLabel>Postcode</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                            <Button type="submit">Update Account</Button>
                        )}
                    </form>
                </Form>
            </Card>
        </>
    )

}

export default UpdateProfileForm;