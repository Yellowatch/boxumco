import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import ContactUsForm from '@/components/forms/ContactUsForm';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import ContactSvg from '/undraw_subscriber_whh0.svg';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Define the shape of the user details response
type UserDetails = {
    success: boolean;
    data: {
        first_name: string;
        last_name: string;
        email: string;
    };
};

const ContactUsPage = () => {
    const { refresh_token, fetchUserDetails } = useAuth();

    // Fetch only if user is logged in
    const { data: userData, error, isLoading } = useQuery<UserDetails>({
        queryKey: ['userDetails'],
        queryFn: fetchUserDetails,
        enabled: Boolean(localStorage.getItem('access_token')),
        refetchOnWindowFocus: false,
    });

    // Determine initial values for form
    const initialValues = userData?.success
        ? {
            fullName: `${userData.data.first_name} ${userData.data.last_name}`.trim(),
            email: userData.data.email,
        }
        : undefined;

    return (
        <section className="section">
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
                Have Some Questions?
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-10">
                <Mail className="inline mr-1 mb-1 text-accent dark:text-blue-400" />
                Moldova · UK · Strada 31 August 1989 78, Chisinau, MD-2012
            </p>

            <div className="container mx-auto grid gap-8 md:grid-cols-2 items-center">
                {/* Illustration */}
                <div className="flex justify-center">
                    <img src={ContactSvg} alt="Contact illustration" className="w-64 h-64" />
                </div>

                {/* Contact Form Card */}
                <Card className="bg-white dark:bg-gray-800">
                    <CardContent>
                        {refresh_token ? (
                            isLoading ? (
                                <div className="flex justify-center">
                                    <Loader2 className="animate-spin" />
                                </div>
                            ) : error ? (
                                <>
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            Failed to load your details, but you can still send us a message.
                                        </AlertDescription>
                                    </Alert>
                                    <ContactUsForm />
                                </>
                            ) : (
                                <ContactUsForm initialValues={initialValues} />
                            )
                        ) : (
                            // Not logged in: render form without prefill
                            <ContactUsForm />
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default ContactUsPage;
