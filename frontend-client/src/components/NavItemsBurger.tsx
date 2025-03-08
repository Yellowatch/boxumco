// React
import { useNavigate } from "react-router-dom";

// UI Library Components
import { Menu } from 'lucide-react';
import {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function NavItemsBurger() {
    const navigate = useNavigate();

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Navbar</SheetTitle>
                    <SheetDescription>
                        Find what you need today!
                    </SheetDescription>
                </SheetHeader>
                <div className="overflow-auto space-y-6 p-4">
                    {/* Auth Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => navigate('/register/')}>Register</Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => navigate('/login/')}>Login</Button>
                        </SheetClose>
                    </div>

                    {/* Tenders Section */}
                    <div>
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => navigate('/tenders/')}>Tenders</Button>
                        </SheetClose>
                    </div>

                    {/* Services Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Services</h3>
                        <div className="space-y-2">
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/services/accounting')}>
                                    Accounting
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/services/legal-documents')}>
                                    Legal Documents
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/services/consulting')}>
                                    Consulting
                                </Button>
                            </SheetClose>
                        </div>
                    </div>

                    {/* Suppliers Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Suppliers</h3>
                        <div className="space-y-2">
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/suppliers/manufacture')}>
                                    Manufacture
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/suppliers/wholesale')}>
                                    Wholesale
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/suppliers/catering')}>
                                    Catering
                                </Button>
                            </SheetClose>
                        </div>
                    </div>

                    {/* Distribution Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Distribution</h3>
                        <div className="space-y-2">
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/distribution/3pl')}>
                                    3PL
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button variant="outline" onClick={() => navigate('/distribution/delivery')}>
                                    Delivery
                                </Button>
                            </SheetClose>
                        </div>
                    </div>

                    {/* News Section */}
                    <div>
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => navigate('/news/')}>News</Button>
                        </SheetClose>

                        {/* About Section */}
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => navigate('/about/')}>About</Button>
                        </SheetClose>

                        {/* Contact Section */}
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => navigate('/contact/')}>Contact</Button>
                        </SheetClose>
                    </div>
                </div>

                {/* TODO */}
                {/* close button */}
                {/* <SheetClose asChild>
                    <Button variant="secondary" className="mt-6">Close</Button>
                </SheetClose> */}
            </SheetContent>
        </Sheet>
    );
}

export default NavItemsBurger;
