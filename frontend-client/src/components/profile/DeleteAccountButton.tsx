import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { Loader2 } from 'lucide-react';
import { AlertCircle } from "lucide-react"


const DeleteAccountButton = () => {
    const { deleteUser, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setErrorMsg('');
        const response = await deleteUser();
        if (response.success == true) {
            console.log("Account deleted successfully");
            await logout();
            toast(
                <div>
                    <p>You have successfully deleted your account.</p>
                </div>
            );
            navigate('/');
            window.scrollTo(0, 0); // Scroll to the top of the page
        } else {
            // Display error message
            console.log(response.error);
            if (response.error?.message) {
                setErrorMsg(response.error.message);
            } else {
                setErrorMsg("An unknown error occurred. Please try again later.");
            }
        }
        setLoading(false);
    };

    return (
        <>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    Delete Account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This will Permanently delete your account. We cannot retrieve your account once this action is complete.
                    </DialogDescription>
                    <div className="flex justify-between mt-4">
                        <DialogClose asChild>
                            <Button variant="secondary" size="sm">
                                Cancel
                            </Button>
                        </DialogClose>
                        {loading ? (
                            <Button disabled variant="destructive">
                                <Loader2 className="animate-spin" />
                                Loading...
                            </Button>
                        ) : (
                            <Button onClick={handleDelete} variant="destructive">
                                Yes, delete my account
                            </Button>
                        )}
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

                </DialogHeader>
            </DialogContent>
        </>
    );
};

export default DeleteAccountButton;