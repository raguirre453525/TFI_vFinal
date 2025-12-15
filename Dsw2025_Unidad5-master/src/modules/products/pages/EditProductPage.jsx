import { instance } from '../../shared/api/axiosInstance';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct } from '../services/update';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

function EditProductForm() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [errorBackendMessage, setErrorBackendMessage] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await instance.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
                navigate('/admin/products');
            }
        };

        if (id) fetchProduct();
    }, [id, navigate]);

    useEffect(() => {
        if (product) {
            setValue('sku', product.sku);
            setValue('cui', product.internalCode || ''); 
            setValue('name', product.name);
            setValue('description', product.description);
            setValue('price', product.currentUnitPrice);
            setValue('stock', product.stockQuantity);
        }
    }, [product, setValue]);

    const onValid = async (formData) => {
        setErrorBackendMessage('');

        const updatedData = {
            ...formData,
            id: id,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10)
        };

        try {
            await updateProduct(updatedData);
            navigate('/admin/products');
        } catch (error) {
            console.error("Error al actualizar:", error);

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
                } else {
                    setErrorBackendMessage("Error del servidor al guardar los cambios.");
                }
            } else {
                setErrorBackendMessage('No hay conexión con el servidor.');
            }
        }
    };

    if (!product) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-white animate-pulse">Cargando datos del producto...</p>
            </div>
        );
    }

    const darkInputStyles = "bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all";
    const labelStyles = "text-slate-400 font-bold uppercase text-xs tracking-wider mb-1 block";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                        Editar Producto
                    </h1>
                    <p className="text-slate-400 text-sm">ID de referencia: <span className="font-mono text-blue-400">#{id}</span></p>
                </div>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="text-slate-400 hover:text-white font-bold text-sm uppercase transition-colors"
                >
                    Cancelar
                </button>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700">
                <form
                    className="flex flex-col gap-6"
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
                                    {...register('sku', { required: 'SKU es requerido' })}
                                />
                            </div>

                            <div>
                                <label className={labelStyles}>Código Único (CUI)</label>
                                <Input
                                    className={darkInputStyles}
                                    error={errors.cui?.message}
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
                                    error={errors.price?.message}
                                    type="number"
                                    step="0.01"
                                    {...register('price', {
                                        min: { value: 0, message: 'El precio no puede ser negativo' },
                                    })}
                                />
                            </div>

                            <div>
                                <label className={labelStyles}>Stock (Unidades)</label>
                                <Input
                                    className={darkInputStyles}
                                    error={errors.stock?.message}
                                    type="number"
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
                                error={errors.name?.message}
                                {...register('name', { required: 'Nombre es requerido' })}
                            />
                        </div>

                        <div>
                            <label className={labelStyles}>Descripción</label>
                            <textarea
                                className={`w-full p-3 rounded h-32 outline-none transition-all ${darkInputStyles}`}
                                placeholder="Detalla las características del producto..."
                                {...register('description')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-700 items-center">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-emerald-900/20"
                        >
                            Guardar Cambios
                        </Button>

                        {errorBackendMessage && (
                            <div className="flex items-center gap-2 text-red-200 bg-red-900/30 px-4 py-2 rounded border border-red-500/50 text-sm font-medium w-full sm:w-auto animate-pulse">
                                <span>⚠️</span> {errorBackendMessage}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductForm;