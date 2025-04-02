import UpdateProfileForm from '@/components/profile/UpdateProfileForm';
import DeleteAccountButton from '@/components/profile/DeleteAccountButton';
import MfaSetup from '@/components/profile/MFASetup';
import ChangePassword from '@/components/profile/ChangePassword';

import { Dialog } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"


const ProfilePage = () => {

    // GET user
    const { fetchUserDetails } = useAuth();
    const [values, setValues] = useState({
        first_name: "",
        last_name: "",
        email: "",
        number: "",
        address: "",
        postcode: "",
        company_name: "",
        dob: "",
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => {
        const getUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetchUserDetails();
                const data = response.data;
                setValues({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    number: data.number,
                    address: data.address,
                    postcode: data.postcode,
                    dob: data.dob,
                    company_name: data.client.company_name,
                });
            } catch (error) {
                console.error(error);
                setErrorMsg("Failed to fetch your details");
            }
            setLoading(false);
        };

        getUserDetails();
    }, []);

    return (
        <>
            <div className='bg-primary dark:bg-dark dark:text-white'>

                {/* Heading */}
                <div className='container w-2/3'>
                    <h1 className='text-4xl font-semibold'>Profile Page</h1>
                    <p className='font-extralight opacity-50'>You may view or change your personal information below.</p>
                </div>
                <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600"></hr>

                {/* Edit details */}
                <div className='container w-2/3 space-y-6'>
                    <h1 className='text-2xl font-semibold'>Edit Details</h1>
                    {errorMsg && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {errorMsg}
                            </AlertDescription>
                        </Alert>
                    )}
                    {loading && !values.email ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <UpdateProfileForm values={values} />
                    )}
                </div>
                <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600"></hr>

                {/* MFA */}
                <div className='container w-2/3 space-y-6'>
                    <MfaSetup />
                </div>
                <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600"></hr>

                {/* Change Password */}
                <div className='container w-2/3 space-y-6'>
                    <h1 className='text-2xl font-semibold'>Change Password</h1>
                    <p className='font-extralight opacity-50'>Update your password associated with your account.</p>
                    <ChangePassword />
                </div>
                <hr className="h-px bg-neutral-200 border-0 dark:bg-neutral-600"></hr>

                {/* Delete Account */}
                <div className='container w-2/3 space-y-2'>
                    <Dialog>
                        <h1 className='text-2xl font-semibold'>Delete Account</h1>
                        <p className='font-extralight opacity-50'>This will delete your account permanently. We cannot retrieve your account once this action is complete.</p>
                        <div className='mt-6'>
                            <DeleteAccountButton />
                        </div>
                    </Dialog>
                </div>

            </div>
        </>
    )
}

export default ProfilePage;
