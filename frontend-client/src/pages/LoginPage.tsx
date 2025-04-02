import { LoginForm } from "@/components";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoveDown } from "lucide-react"

function Login() {
    const navigate = useNavigate();

    const SupplierPageNavigation = () => {
        window.open('http://github.com', '_blank');
    };

    const scrollToBusinessSection = () => {
        const businessSection = document.getElementById('business-section');
        if (businessSection) {
            businessSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className='container flex flex-col items-center space-y-6'>
                <h1 className='text-2xl font-bold'>Login</h1>
                <LoginForm />
                <Button variant="link" onClick={() => navigate('/register')}>Don't have an account? Register here.</Button>
                <div className="flex items-center">
                    <p>Have a business?</p>
                    <Button variant="ghost" onClick={scrollToBusinessSection}>
                        <MoveDown />Scroll down
                    </Button>
                </div>
            </div>
            <div id="business-section" className='container flex flex-col items-center space-y-6 max-w-2xl'>
                <h1>Unlock Your Business Potential with Boxum</h1>
                <p>
                    Are you ready to take your business to new heights? With Boxum, reaching your ideal audience has never been easier. Our innovative advertising platform is designed to boost your visibility, generate more leads, and convert clicks into loyal customers.
                </p>
                <p>
                    Imagine connecting with potential clients exactly when they’re looking for services like yours. Boxum's intuitive tools and targeted strategies empower you to showcase your business, build lasting relationships, and stand out in a competitive market.
                </p>
                <p>
                    Don’t let your competitors steal the spotlight—seize the opportunity to grow your business today. Start advertising with Boxum and watch your leads, conversions, and profits soar!
                </p>
                <h3>Join Boxum now and turn your business vision into reality. Your next customer is just a click away!</h3>
                <Button onClick={SupplierPageNavigation}>Take me to the supplier site!</Button>
            </div>
        </>
    );
}

export default Login