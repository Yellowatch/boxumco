import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Card from '../Card';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
    token: z
        .string()
        .min(6, { message: 'Please enter a valid token.' })
        .max(8, { message: 'Please enter a valid token.' }),
});

interface ConfirmMFAProps {
    onConfirmed: () => void;
}

const ConfirmMFA = ({ onConfirmed }: ConfirmMFAProps) => {
    const { confirmMfaSetup } = useAuth();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { token: '' },
    });

    const confirmMfaMutation = useMutation({
        mutationFn: (token: string) => confirmMfaSetup(token),
        onSuccess: (result) => {
            if (result.success) {
                toast(
                    <div>
                        <p>MFA has been successfully enabled!</p>
                    </div>
                );
                onConfirmed();
            }
        },
        onError: () => {
            // Error is handled via the UI below.
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        confirmMfaMutation.mutate(values.token);
    };

    return (
        <div className="space-y-2">
            <h2 className="text-2xl">Enter MFA Token</h2>
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
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
                        {confirmMfaMutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {(confirmMfaMutation.error as any)?.message || 'An error occurred while confirming MFA.'}
                                </AlertDescription>
                            </Alert>
                        )}
                        {confirmMfaMutation.status === 'pending' ? (
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
    );
};

export default ConfirmMFA;
