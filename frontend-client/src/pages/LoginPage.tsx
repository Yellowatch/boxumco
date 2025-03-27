import { LoginForm } from "@/components";

function Login() {
    return (
        <div className='container flex flex-col items-center space-y-6'>
            <h1 className='text-2xl font-bold'>Login</h1>
            <LoginForm />
        </div>
    );
}

export default Login