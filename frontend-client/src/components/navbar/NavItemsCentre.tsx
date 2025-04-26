import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

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
    - News
    - About
    - Contact
*/

function NavItemsCentre() {

    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/tenders/" className={navigationMenuTriggerStyle()}>Tenders</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4">
                                <li>
                                    <NavigationMenuLink href="/services/accounting">
                                        Accounting
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink href="/services/legal-documents">
                                        Legal Documents
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink href="/services/consulting">
                                        Consulting
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Suppliers</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4">
                                <li>
                                    <NavigationMenuLink href="/suppliers/manufacture">
                                        Manufacture
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink href="/suppliers/wholesale">
                                        Wholesale
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink href="/suppliers/catering">
                                        Catering
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Distribution</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4">
                                <li>
                                    <NavigationMenuLink href="/distribution/3pl">
                                        3PL
                                    </NavigationMenuLink>
                                </li>
                                <li>
                                    <NavigationMenuLink href="/distribution/delivery">
                                        Delivery
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/news/" className={navigationMenuTriggerStyle()}>News</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/about/" className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/contact-us/" className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}

export default NavItemsCentre
