import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { registerUser } from '../services/register';

function RegisterForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch, // Necesario para comparar contraseñas
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onValid = async (formData) => {
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await registerUser(formData);

            if (!response.success) {
                // Manejo de errores del backend
                const msg = response.error?.message || "Error al registrar el usuario";
                setErrorMessage(msg);
                return;
            }

            // ÉXITO
            alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
            navigate("/login"); 

        } catch (error) {
            console.error("Error crítico en registro:", error);
            setErrorMessage("Ocurrió un error inesperado.");
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
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Datos de Usuario</h2>

            <div className="flex flex-col gap-2">
                <Input
                    label='Usuario'
                    {...register('username', {
                        required: 'El usuario es obligatorio',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    })}
                    error={errors.username?.message}
                />

                <Input
                    label='Email'
                    type="email"
                    {...register('email', {
                        required: 'El email es obligatorio',
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Formato de email inválido'
                        }
                    })}
                    error={errors.email?.message}
                />

                <Input
                    label='Contraseña'
                    type='password'
                    {...register('password', {
                        required: 'La contraseña es obligatoria',
                        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                    })}
                    error={errors.password?.message}
                />

                <Input
                    label='Confirmar Contraseña'
                    type='password'
                    {...register('confirmPassword', {
                        required: 'Confirma tu contraseña',
                        validate: (value) => {
                            if (watch('password') != value) {
                                return "Las contraseñas no coinciden";
                            }
                        }
                    })}
                    error={errors.confirmPassword?.message}
                />
            </div>

            {errorMessage && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm text-center font-medium">
                    {errorMessage}
                </div>
            )}

            <div className="mt-6 flex flex-col gap-4">
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? "Creando cuenta..." : "Registrarse"}
                </Button>

                {/* Separador Visual */}
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">O</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <Button
                    variant='secondary'
                    type="button"
                    onClick={() => navigate('/login')}
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Button>
            </div>
        </form>
    );
}

export default RegisterForm;