import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { login } from '../services/login';

function LoginForm() {

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onValid = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await login(formData);
      console.log("Debug Login:", response); 

      const userData = response.userInfo || response.user || response.data?.userInfo || response.data?.user;
      const tokenData = response.token || response.data?.token;

      if (!userData || !tokenData) {
        console.error("Login incompleto: falta usuario o token", response);
        setErrorMessage("Error de conexión con el servidor (datos incompletos)");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", tokenData);
      localStorage.setItem("user", JSON.stringify(userData));

      setAuth({
        isAuthenticated: true,
        user: userData,
        token: tokenData,
      });

      if (userData?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage("Ocurrió un error inesperado al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className='
        flex flex-col
        w-full
        max-w-md
        bg-white
        p-8
        rounded-lg
        shadow-2xl
        border-t-4
        border-blue-600
      '
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Iniciar Sesión</h2>

      <div className="flex flex-col gap-2">
        <Input
          label='Usuario'
          {...register('username', {
            required: 'Usuario es obligatorio',
          })}
          error={errors.username?.message}
        />

        <Input
          label='Contraseña'
          {...register('password', {
            required: 'Contraseña es obligatorio',
          })}
          type='password'
          error={errors.password?.message}
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">O</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <Button
          variant='secondary'
          type="button" 
          onClick={() => navigate('/register')}
        >
          Crear cuenta nueva
        </Button>
      </div>

      {errorMessage && (
        <p className='text-red-500 text-center mt-4 text-sm font-medium bg-red-50 p-2 rounded'>
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default LoginForm;
