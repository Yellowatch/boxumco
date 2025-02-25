import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/mode-toggle"

import { UserRound } from 'lucide-react';
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";

function Navbar() {
    const { user, logout } = useAuth();
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const storedUserEmail = localStorage.getItem('user_email');
        if (storedUserEmail) {
            setUserEmail(storedUserEmail);
        }
    }, [user]);

    const onClickLogout = () => {
        setUserEmail('');
        logout();
    };

    return (
        <header className="flex items-center justify-between p-4">
            {/* Left Section: Logo */}
            <div className="flex items-center">
                <img src="/vite.svg" alt="Logo" className="h-8 w-auto" />
            </div>
            {/* Middle Section: Navigation Menu */}
            <div className="flex-1 flex justify-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/">Home</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            {/* Right Section: Mode Toggle */}
            {/* <div className="flex items-center space-x-4">
                <ModeToggle />
            </div> */}
            {/* Right Section: Auth Links */}
            <div className="flex items-center space-x-4">
                <NavigationMenu>
                    <NavigationMenuList>
                        {userEmail || user ? (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        <UserRound />
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="">
                                            <li>
                                                <NavigationMenuLink href="/profile">{userEmail}</NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <button onClick={onClickLogout} className="cursor-pointer">
                                                        Logout
                                                    </button>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </>
                        ) : (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/register">Register</NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/login">Login</NavigationMenuLink>
                                </NavigationMenuItem>
                            </>
                        )}
                        <NavigationMenuItem>
                            <ModeToggle />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
}

export default Navbar
