import { Button } from '@/components/ui/button';
import { toast } from "sonner"

const HomePage = () => {

    const onClickButton = () => {
        console.log('Button clicked');
        toast(
            <div>
                <p>You have successfully registered!</p>
            </div>
        );
    };

    return (
        <>
        <div className='container'>
            <Button onClick={onClickButton}>Toast</Button>
        </div>
        <div className='md:hidden'>
            <h1>sm</h1>
        </div>
        <div className='hidden md:block lg:hidden'>
            <h1>md</h1>
        </div>
        <div className='hidden lg:block'>
            <h1>lg</h1>
        </div>
        </>
    );
};

export default HomePage;