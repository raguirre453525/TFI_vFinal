import { Link } from "react-router-dom";

function ProductsTable({ products = [], onToggleStatus }) { 
    return (
        <div className="overflow-x-auto rounded-lg shadow-xl border border-slate-700">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-800 uppercase bg-white font-black tracking-wider">
                    <tr>
                        <th className="px-6 py-4 border-r border-slate-200 text-center">SKU</th>
                        <th className="px-6 py-4 border-r border-slate-200">Nombre</th>
                        <th className="px-6 py-4 border-r border-slate-200">Precio</th>
                        <th className="px-6 py-4 border-r border-slate-200">Stock</th>
                        <th className="px-6 py-4 border-r border-slate-200">Estado</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody className="bg-slate-800 divide-y divide-slate-700 text-slate-300">
                    {products && products.length > 0 ? (
                        products.map((p) => {
                            const isActive = p.isActive ?? p.IsActive;
                            const sku = p.sku || p.Sku;
                            const name = p.name || p.Name;
                            const price = p.currentUnitPrice || p.CurrentUnitPrice;
                            const stock = p.stockQuantity || p.StockQuantity;
                            const id = p.id || p.Id;

                            return (
                                <tr key={id} className="hover:bg-slate-700 transition-colors duration-200 group">
                                    <td className="px-6 py-4 font-mono text-slate-400 border-r border-slate-700 text-center">
                                        {sku}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-white border-r border-slate-700">
                                        {name}
                                    </td>

                                    <td className="px-6 py-4 text-emerald-400 font-mono border-r border-slate-700">
                                        ${price}
                                    </td>

                                    <td className="px-6 py-4 border-r border-slate-700">
                                        {stock} u.
                                    </td>

                                    <td className="px-6 py-4 border-r border-slate-700">
                                        <span className={`${isActive ? 'text-slate-300' : 'text-slate-500 italic'}`}>
                                            {isActive ? "Habilitado" : "Deshabilitado"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-4 font-bold text-xs uppercase tracking-wide">
                                            <Link 
                                                to={`/admin/products/edit/${id}`} 
                                                className="text-blue-500 hover:text-blue-400 transition-colors"
                                            >
                                                Editar
                                            </Link>
                                            
                                            <button
                                                onClick={() => onToggleStatus && onToggleStatus(id)}
                                                className={`${
                                                    isActive 
                                                        ? "text-amber-600 hover:text-amber-500" 
                                                        : "text-amber-500 hover:text-amber-400"
                                                } transition-colors uppercase`}
                                            >
                                                {isActive ? "Deshabilitar" : "Habilitar"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                No hay productos para mostrar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ProductsTable;