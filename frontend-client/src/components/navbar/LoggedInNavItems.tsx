import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Context
import { useAuth } from "@/context/AuthContext"

export default function LoggedInNavItems() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const onClickLogout = () => {
        toast(
            <div>
                <p>You have successfully logged out!</p>
            </div>
        );
        logout();
    };

    return (
        <>
            <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer" asChild>
                        <Button variant="outline" size="icon">
                            <UserRound />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                            Profile
                        </DropdownMenuItem>
                        <DialogTrigger asChild>
                            {/* copying the styling of DropdownMenuItem */}
                            <div className="cursor-pointer flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-primary-dark dark:hover:text-primary">
                                Logout
                            </div>
                        </DialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This will log you out of the application.
                        </DialogDescription>
                        <div className="flex justify-between mt-4">
                            <DialogClose asChild>
                                <Button variant="secondary" size="sm">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant="destructive" size="sm" onClick={onClickLogout}>
                                    Logout
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}
