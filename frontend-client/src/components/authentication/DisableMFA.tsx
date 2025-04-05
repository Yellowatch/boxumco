import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DisableMFAProps {
    onDisabled: () => void;
}

const DisableMFA = ({ onDisabled }: DisableMFAProps) => {
    const { disableMfa } = useAuth();
    const disableMfaMutation = useMutation({
        mutationFn: () => disableMfa(),
        onSuccess: (result) => {
            if (result.success) {
                toast(
                    <div>
                        <p>MFA has been disabled.</p>
                    </div>
                );
                onDisabled();
            }
        },
        onError: () => {
            // Error is handled in the UI below.
        },
    });

    const confirmDisable = () => {
        disableMfaMutation.mutate();
    };

    return (
        <Dialog>
            <div className="space-y-6">
                <p className='dimmed-text'>MFA is currently enabled on your account.</p>
                <Button variant="destructive" asChild>
                    <DialogTrigger>Disable MFA</DialogTrigger>
                </Button>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This will delete your MFA setup and you will need to set it up again if you wish to re-enable it in the future.
                    </DialogDescription>
                    {disableMfaMutation.isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {(disableMfaMutation.error as any)?.message || 'An error occurred while disabling MFA.'}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex justify-between mt-4">
                        <DialogClose asChild>
                            <Button variant="secondary" size="sm">
                                Cancel
                            </Button>
                        </DialogClose>
                        {disableMfaMutation.status === 'pending' ? (
                            <Button disabled variant="destructive">
                                <Loader2 className="animate-spin" />
                                Loading...
                            </Button>
                        ) : (
                            <Button onClick={confirmDisable} variant="destructive">
                                Yes, remove MFA
                            </Button>
                        )}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DisableMFA;
