// React
import { useNavigate } from "react-router-dom"

// UI Library Components
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

// My components
import NavItemsBurger from "./NavItemsBurger";
import NavItemsCentre from "./NavItemsCentre";
import LoggedInNavItems from "./LoggedInNavItems";
import ModeButton from "@/components/theme/ModeButton";

// Context
import { useAuth } from "@/context/AuthContext"


function Navbar() {
    const { user, refresh_token } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <header className="flex items-center justify-between p-4 bg-white dark:bg-neutral-950 sticky top-0 z-50">
                {/* Left Section: Logo */}
                <div className="flex items-center">
                    <Button variant="ghost" size="default" onClick={() => navigate('/')}>
                        <img src="/boxumCo.png" alt="Logo" className="h-8 w-auto" />
                    </Button>
                </div>
                {/* Middle Section: Navigation Menu */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <NavItemsCentre />
                </div>
                {/* Right Section: Auth Links */}
                <div className="flex items-center space-x-4">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {(user && user.refresh_token) || refresh_token ? (
                                <>
                                    <NavigationMenuItem>
                                        <LoggedInNavItems />
                                    </NavigationMenuItem>
                                </>
                            ) : (
                                <>
                                    <div className="hidden md:flex">
                                        <NavigationMenuItem>
                                            <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>Register</NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>Login</NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </div>
                                </>
                            )}

                            {/* Mode toggle */}
                            <NavigationMenuItem>
                                <ModeButton />
                            </NavigationMenuItem>

                            {/* Navigation Menu mobile view */}
                            <div className="lg:hidden">
                                <NavigationMenuItem>
                                    <NavItemsBurger />
                                </NavigationMenuItem>
                            </div>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </header>

        </>
    );
}

export default Navbar

