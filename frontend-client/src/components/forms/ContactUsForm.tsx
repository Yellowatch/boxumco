import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from '@/components/ui/form';

// Zod schema for contact form validation
const contactSchema = z.object({
    fullName: z.string().min(1, { message: 'Your name is required.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    message: z.string().min(1, { message: 'Please enter your message.' }),
});
type ContactFormType = z.infer<typeof contactSchema>;

interface ContactUsFormProps {
    /** optional initial values for logged-in user */
    initialValues?: {
        fullName: string;
        email: string;
    };
}

export default function ContactUsForm({ initialValues }: ContactUsFormProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // React Hook Form setup with optional defaults
    const form = useForm<ContactFormType>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            fullName: initialValues?.fullName ?? '',
            email: initialValues?.email ?? '',
            message: '',
        },
    });

    const { control, handleSubmit, reset, getValues } = form;

    // Mutation for submitting contact form
    const mutation = useMutation<unknown, any, ContactFormType>({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/api/contact/', data);
            return response.data;
        },
        onSuccess: () => {
            setErrorMsg(null);
            toast('Message sent!', { description: 'Thank you for contacting us.' });
            // preserve name/email, clear message
            const { fullName, email } = getValues();
            reset({ fullName, email, message: '' });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.detail || 'Failed to send message. Please try again later.';
            setErrorMsg(msg);
            toast.error(msg);
        },
    });

    const onSubmit = (values: ContactFormType) => {
        setErrorMsg(null);
        mutation.mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMsg}</AlertDescription>
                    </Alert>
                )}
                {initialValues && !errorMsg && (
                    <Alert>
                        <Info className="stroke-green-700" />
                        <AlertTitle>You're logged in!</AlertTitle>
                        <AlertDescription>We filled out your details for you.</AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>Please enter your full name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" />
                            </FormControl>
                            <FormDescription>We will reply to this address.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormDescription>What would you like to ask us?</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={mutation.status === 'pending'}>
                    {mutation.status === 'pending' ? 'Sending…' : 'Send Message'}
                </Button>
            </form>
        </Form>
    );
}
