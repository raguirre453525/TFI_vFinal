import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
    return (
        <div className='
            flex
            flex-col
            justify-center
            items-center
            min-h-screen
            bg-slate-900
            px-4
        '>
            <h1 className="text-3xl font-bold text-white mb-8 tracking-widest">
                CREAR CUENTA
            </h1>
            <RegisterForm />
        </div>
    );
}

export default RegisterPage;