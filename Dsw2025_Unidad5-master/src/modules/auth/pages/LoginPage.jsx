import LoginForm from '../components/LoginForm';

function LoginPage() {
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
        BIENVENIDO
      </h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
