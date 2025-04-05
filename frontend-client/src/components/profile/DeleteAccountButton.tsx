import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { AlertCircle } from "lucide-react";
import { useMutation } from '@tanstack/react-query';

const DeleteAccountButton = () => {
  const { deleteUser, logout } = useAuth();
  const navigate = useNavigate();

  // Wrap the deleteUser function in a mutation.
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await deleteUser();
    },
    onSuccess: async (data) => {
      if (data.success) {
        await logout();
        toast(
          <div>
            <p>You have successfully deleted your account.</p>
          </div>
        );
        navigate('/');
        window.scrollTo(0, 0);
      }
    },
    onError: () => {
      // Error will be displayed below.
    }
  });

  const handleDelete = () => {
    deleteAccountMutation.mutate();
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
            This will permanently delete your account. We cannot retrieve your account once this action is complete.
          </DialogDescription>
          <div className="flex justify-between mt-4">
            <DialogClose asChild>
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            {deleteAccountMutation.status === 'pending' ? (
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
          {deleteAccountMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {(deleteAccountMutation.error as any)?.message || "An unknown error occurred. Please try again later."}
              </AlertDescription>
            </Alert>
          )}
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default DeleteAccountButton;
