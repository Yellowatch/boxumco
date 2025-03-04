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
        <div className='container'>
            <Button onClick={onClickButton}>Toast</Button>
        </div>
    );
};

export default HomePage;