import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    setErrorBackendMessage('');

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      await createProduct(payload);
      navigate('/admin/products');
    } catch (error) {
      console.error("Error al crear producto:", error);

      if (error.response) {
        const serverData = error.response.data;

        if (typeof serverData === 'string') {
          setErrorBackendMessage(serverData);
        }
        else if (serverData?.title) {
          setErrorBackendMessage(serverData.title);
        }
        else if (error.response.status === 400) {
          setErrorBackendMessage("Datos inválidos. Revisa la información ingresada.");
        }
        else {
          setErrorBackendMessage("Error del servidor. Intenta más tarde.");
        }
      } else {
        setErrorBackendMessage('No hay conexión con el servidor.');
      }
    }
  };

  const darkInputStyles = "bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all";
  const labelStyles = "text-slate-400 font-bold uppercase text-xs tracking-wider mb-1 block";

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700">
      <form
        className='flex flex-col gap-6'
        onSubmit={handleSubmit(onValid)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-700 pb-2 mb-2">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                🆔 Identificación
              </h3>
            </div>

            <div>
              <label className={labelStyles}>SKU</label>
              <Input
                className={darkInputStyles}
                error={errors.sku?.message}
                placeholder="Ej: GAM-001"
                {...register('sku', { required: 'SKU es requerido' })}
              />
            </div>

            <div>
              <label className={labelStyles}>Código Único (CUI)</label>
              <Input
                className={darkInputStyles}
                error={errors.cui?.message}
                placeholder="Código interno..."
                {...register('cui', { required: 'Código Único es requerido' })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border-b border-slate-700 pb-2 mb-2">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                📊 Inventario y Costos
              </h3>
            </div>

            <div>
              <label className={labelStyles}>Precio ($)</label>
              <Input
                className={darkInputStyles}
                type='number'
                step="0.01"
                error={errors.price?.message}
                {...register('price', {
                  min: { value: 0, message: 'El precio no puede ser negativo' },
                })}
              />
            </div>

            <div>
              <label className={labelStyles}>Stock Inicial</label>
              <Input
                className={darkInputStyles}
                type='number'
                error={errors.stock?.message}
                {...register('stock', {
                  min: { value: 0, message: 'El stock no puede ser negativo' },
                })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-white font-bold text-sm">📝 Detalles Generales</h3>
          </div>

          <div>
            <label className={labelStyles}>Nombre del Producto</label>
            <Input
              className={darkInputStyles}
              placeholder="Ej: Teclado Mecánico RGB..."
              error={errors.name?.message}
              {...register('name', { required: 'Nombre es requerido' })}
            />
          </div>

          <div>
            <label className={labelStyles}>Descripción</label>
            <textarea
              className={`w-full p-3 rounded h-24 outline-none ${darkInputStyles}`}
              placeholder="Describe las características principales del producto..."
              {...register('description')}
            />
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 mt-6 pt-6 border-t border-slate-700'>
          <Button
            type='submit'
            className='w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20'
          >
            Crear Producto
          </Button>

          {errorBackendMessage && (
            <div className='flex items-center gap-2 text-red-200 bg-red-900/30 px-4 py-2 rounded border border-red-500/50 text-sm font-medium w-full text-center sm:text-left animate-pulse'>
              <span>⚠️</span> {errorBackendMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProductForm;