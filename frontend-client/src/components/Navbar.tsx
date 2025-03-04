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
import { Button } from "@/components/ui/button"

import { LoggedInNavItems } from "./LoggedInNavItems";

import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import NavItemsCentre from "./NavItemsCentre";

/*
- Navbar
    - Services
        - Accounting
        - Legal documents
        - Consulting
    - Suppliers
        - Manufacture
        - Wholesale
        - Catering
    - Tenders
    - Distribution
        - 3PL
        - Delivery
*/

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

    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between p-4">
            {/* Left Section: Logo */}
            <div className="flex items-center">
                <Button variant="ghost" size="default" onClick={() => navigate('/')} className="cursor-pointer">
                    <img src="/boxumCo.png" alt="Logo" className="h-8 w-auto" />
                </Button>
            </div>
            {/* Middle Section: Navigation Menu */}
            <div className="flex-1 flex justify-center">
                <NavItemsCentre/>
            </div>
            {/* Right Section: Auth Links */}
            <div className="flex items-center space-x-4">
                <NavigationMenu>
                    <NavigationMenuList>
                        {userEmail || user ? (
                            <>
                                <NavigationMenuItem>
                                    <LoggedInNavItems userEmail={userEmail} onClickLogout={onClickLogout} />
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
