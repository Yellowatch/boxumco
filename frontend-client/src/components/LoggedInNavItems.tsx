import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoggedInNavItemsProps {
    userEmail: string;
    onClickLogout: () => void;
}

export function LoggedInNavItems({ userEmail, onClickLogout }: LoggedInNavItemsProps) {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
                <Button variant="outline" size="icon">
                    <UserRound />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    {userEmail}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onClickLogout} className="cursor-pointer">
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
