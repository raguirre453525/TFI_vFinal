import { addToCart } from "../helpers/cart";

function ProductsGrid({ products }) {
    const handleAdd = (product) => {
        addToCart(product);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
                const stock = p.stockQuantity || 0;
                const hasStock = stock > 0;

                return (
                    <div 
                        key={p.id} 
                        className="
                            bg-white 
                            rounded-lg 
                            p-4 
                            shadow-lg 
                            flex 
                            flex-col 
                            justify-between 
                            h-full 
                            border-2 
                            border-transparent 
                            hover:border-blue-500 
                            hover:shadow-blue-500/20 
                            transition-all 
                            duration-300
                            group
                        "
                    >
                        <div>
                            <div className="h-40 bg-gray-100 mb-4 rounded flex items-center justify-center text-gray-300 group-hover:bg-gray-50 transition-colors">
                                <span className="text-4xl">🎮</span>
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 uppercase tracking-tight">
                                {p.name}
                            </h3>
                            
                            <p className="text-xs text-gray-500 line-clamp-3 mb-4 font-medium" title={p.description}>
                                {p.description}
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4 border-t pt-3 border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Precio</p>
                                    <p className="font-black text-2xl text-blue-700">
                                        ${p.currentUnitPrice}
                                    </p>
                                </div>
                                
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                    hasStock 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-red-100 text-red-700"
                                }`}>
                                    {hasStock ? `${stock} Unidades` : "Sin Stock"}
                                </span>
                            </div>

                            <button
                                disabled={!hasStock}
                                className={`
                                    w-full 
                                    py-3 
                                    rounded 
                                    font-bold 
                                    uppercase 
                                    text-sm 
                                    tracking-wide 
                                    transition-all
                                    shadow-md
                                    ${
                                    hasStock
                                        ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/50 active:scale-95"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => handleAdd(p)}
                            >
                                {hasStock ? "Comprar Ahora" : "Sin Stock"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ProductsGrid;