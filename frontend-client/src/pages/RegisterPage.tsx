import { ClientRegisterForm, BusinessRegisterForm } from "@/components";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RegisterPage = () => {
    const [isCustomer, setIsCustomer] = useState(true);

  return (
    <div className='container flex flex-col items-center space-y-6'>
        <h1 className='text-2xl font-bold'>Register</h1>
        <div className="flex">
            <Button variant={`${isCustomer ? 'default' : 'outline'}`} className="rounded-l-full" onClick={() => setIsCustomer(true)}>Customer</Button>
            <Button variant={`${isCustomer ? 'outline' : 'default'}`} className="rounded-r-full" onClick={() => setIsCustomer(false)}>Business</Button>
        </div>
        { isCustomer ? <ClientRegisterForm /> : <BusinessRegisterForm /> }
    </div>
  );
};

export default RegisterPage;
