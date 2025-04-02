import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner"

const HomePage = () => {
    const { fetchUserDetails } = useAuth();

    const onClickButton = async () => {
        const data = await fetchUserDetails();
        console.log("data", data);
    };

    return (
        <>
            <div className='container bg-primary dark:bg-primary-dark h-screen'>
                <Button onClick={onClickButton}>Get user details</Button>
            </div>
        </>
    );
};

export default HomePage;