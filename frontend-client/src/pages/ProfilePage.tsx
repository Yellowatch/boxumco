import UpdateProfileForm from '@/components/profile/UpdateProfileForm';
import DeleteAccountButton from '@/components/profile/DeleteAccountButton';
import MfaSetup from '@/components/profile/MFASetup';
import ChangePassword from '@/components/profile/ChangePassword';
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';

const ProfilePage = () => {
    const { fetchUserDetails } = useAuth();

    // useQuery handles data fetching, caching, and loading/error states
    const { data, error, isLoading } = useQuery({
        queryKey: ['userDetails'],
        queryFn: fetchUserDetails,
        refetchOnWindowFocus: false,
    });

    return (
        <div className='section'>
            {/* Heading */}
            <div className='container w-2/3'>
                <h1>Profile Page</h1>
                <p className='dimmed-text'>
                    You may view or change your personal information below.
                </p>
            </div>
            <hr />

            {/* Edit details */}
            <div className='container w-2/3 space-y-6'>
                <h2>Edit Details</h2>
                {isLoading ? (
                    // Loader is displayed only in the edit details section
                    <div className="flex justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Failed to fetch your details</AlertDescription>
                    </Alert>
                ) : (
                    // Once data is loaded, display the form
                    <Card>
                        <CardContent>
                            <UpdateProfileForm values={data.data} />
                        </CardContent>
                    </Card>
                )}
            </div>
            <hr />

            {/* MFA */}
            <div className='container w-2/3 space-y-6'>
                <h2>Multi-Factor Authentication</h2>
                {isLoading ? (
                    // Loader is displayed only in the edit details section
                    <div className="flex justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Failed to fetch your details</AlertDescription>
                    </Alert>
                ) : (
                    // Once data is loaded, display the form
                    <MfaSetup initialMfaEnabled={data.data.mfa_enabled} />
                )}
            </div>
            <hr />

            {/* Change Password */}
            <div className='container w-2/3 space-y-6'>
                <h2>Change Password</h2>
                <p className='dimmed-text'>
                    Update your password associated with your account.
                </p>
                <Card>
                    <CardContent>
                        <ChangePassword />
                    </CardContent>
                </Card>
            </div>
            <hr />

            {/* Delete Account */}
            <div className='container w-2/3 space-y-2'>
                <Dialog>
                    <h2>Delete Account</h2>
                    <p className='dimmed-text'>
                        This will delete your account permanently. We cannot retrieve your account once this action is complete.
                    </p>
                    <div className='mt-6'>
                        <DeleteAccountButton />
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfilePage;
