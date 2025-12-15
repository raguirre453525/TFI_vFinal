function CartItem({ item, updateQty, removeItem }) {
    return (
        <div className="
            bg-white 
            p-4 
            rounded-lg 
            shadow-md 
            flex 
            flex-col sm:flex-row 
            justify-between 
            items-center 
            gap-4
            border-l-4 border-transparent hover:border-blue-500 transition-colors
        ">
            <div className="text-center sm:text-left w-full sm:w-auto">
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                    {item.name}
                </h2>
                <p className="text-blue-600 font-bold">
                    ${item.price} <span className="text-slate-400 text-xs font-normal">/ unidad</span>
                </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-lg">
                <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="
                        w-8 h-8 
                        flex items-center justify-center 
                        bg-slate-200 hover:bg-slate-300 
                        text-slate-700 font-bold 
                        rounded transition
                    "
                > 
                    - 
                </button>

                <span className="w-10 text-center font-bold text-slate-800">
                    {item.quantity}
                </span>

                <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="
                        w-8 h-8 
                        flex items-center justify-center 
                        bg-slate-200 hover:bg-slate-300 
                        text-slate-700 font-bold 
                        rounded transition
                    "
                > 
                    + 
                </button>

                <div className="w-px h-6 bg-slate-300 mx-1"></div>

                <button
                    onClick={() => removeItem(item.id)}
                    className="
                        w-8 h-8 
                        flex items-center justify-center 
                        bg-red-100 hover:bg-red-600 
                        text-red-600 hover:text-white 
                        rounded transition-colors
                        font-bold
                    "
                    title="Eliminar producto"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default CartItem;
