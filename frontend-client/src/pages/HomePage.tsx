import { Gift, Cloud, Database, Monitor, Package, Truck, Server, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HomePage = () => {

    const handleButtonClick = () => {
        console.log("Button clicked!");
        toast("Button clicked!");
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Purple background shape (absolutely positioned) */}
            <div
                className="absolute top-0 left-0 w-full h-screen bg-accent z-0"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 90%)" }}
            />

            {/* Main Section with reduced top padding */}
            <section className="relative z-10 py-0 my-0 flex flex-col md:flex-row items-center h-screen">
                {/* Left Side: Heading & Button */}
                <div className="max-w-lg space-y-4 px-4 md:px-0 md:w-1/2 pt-20 md:pt-0">
                    <h1 className="text-4xl font-bold text-white sm:text-5xl">
                        A Business that
                    </h1>
                    <h1 className="text-4xl font-bold text-white sm:text-5xl">
                        creates business
                    </h1>
                    <div className="h-1 w-4/5 bg-white" />
                    <p className="text-white text-lg">
                        Empowering your brand with cutting-edge solutions.
                    </p>
                    <Button className="bg-white text-accent hover:text-accent-dark" onClick={handleButtonClick}>
                        Start your journey today
                    </Button>
                </div>

                {/* Right Side: White card */}
                <div className="bg-white w-full md:w-1/2 h-72 md:h-3/4 rounded-lg ml-auto shadow-lg mt-8 md:mt-0">
                    {/* Insert an image or illustration here */}
                </div>
            </section>

            {/* Bottom Icons: relative container */}
            <div className="relative z-10 px-8 flex items-center justify-between gap-4">
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Gift className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Cloud className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Database className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Monitor className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Package className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Truck className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <Server className="text-accent" />
                </div>
                <div className="bg-white w-30 h-20 flex items-center justify-center rounded-full border-1 border-accent">
                    <ShoppingCart className="text-accent" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
