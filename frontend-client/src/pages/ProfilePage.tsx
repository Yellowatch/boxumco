import UpdateProfileForm from '@/components/profile/UpdateProfileForm';
import DeleteAccountButton from '@/components/profile/DeleteAccountButton';
import MfaSetup from '@/components/profile/MFASetup';
import ChangePassword from '@/components/profile/ChangePassword';
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ProfilePage = () => {
    const { fetchUserDetails } = useAuth();

    // useQuery handles data fetching, caching, and loading/error states
    const { data, error, isLoading } = useQuery({
        queryKey: ['userDetails'],
        queryFn: fetchUserDetails,
        refetchOnWindowFocus: false,
    });

    return (
        <div className='bg-primary dark:bg-dark dark:text-white'>
            {/* Heading */}
            <div className='container w-2/3'>
                <h1 className='text-4xl font-semibold'>Profile Page</h1>
                <p className='font-extralight opacity-50'>
                    You may view or change your personal information below.
                </p>
            </div>
            <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600" />

            {/* Edit details */}
            <div className='container w-2/3 space-y-6'>
                <h1 className='text-2xl font-semibold'>Edit Details</h1>
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
                    <UpdateProfileForm values={data.data} />
                )}
            </div>
            <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600" />

            {/* MFA */}
            <div className='container w-2/3 space-y-6'>
                <h1 className="text-3xl font-semibold">Multi-Factor Authentication</h1>
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
            <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600" />

            {/* Change Password */}
            <div className='container w-2/3 space-y-6'>
                <h1 className='text-2xl font-semibold'>Change Password</h1>
                <p className='font-extralight opacity-50'>
                    Update your password associated with your account.
                </p>
                <ChangePassword />
            </div>
            <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600" />

            {/* Delete Account */}
            <div className='container w-2/3 space-y-2'>
                <Dialog>
                    <h1 className='text-2xl font-semibold'>Delete Account</h1>
                    <p className='font-extralight opacity-50'>
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
