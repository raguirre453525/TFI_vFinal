import useProductsList from "../../products/helpers/useProductsList";
import { getUserProducts } from "../../products/services/listUser";
import ProductsGrid from "../../products/components/ProductsGrid";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Home() {
    const [search, setSearch] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        products,
        pagination,
        loading,
        fetchProducts
    } = useProductsList(getUserProducts);

    useEffect(() => {
        fetchProducts(1, "", "all", itemsPerPage);
    }, []);

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        fetchProducts(1, search, "all", itemsPerPage);
    };

    const handleClear = () => {
        setSearch("");
        fetchProducts(1, "", "all", itemsPerPage);
    };

    const handleItemsPerPageChange = (e) => {
        const newSize = Number(e.target.value);
        setItemsPerPage(newSize);
        fetchProducts(1, search, "all", newSize);
    };

    const changePage = (newPage) => {
        fetchProducts(newPage, search, "all", itemsPerPage);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex justify-center">
            <p className="animate-pulse">Cargando catálogo...</p>
        </div>
    );

    const hasProducts = products && products.length > 0;
    const safePagination = pagination ?? { pageNumber: 1, totalPages: 1 };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <Navbar />

            <div className="flex-grow p-6 max-w-7xl mx-auto w-full">
                
                <div className="mb-8 border-l-4 border-blue-500 pl-4">
                    <h1 className="text-3xl font-bold text-white uppercase tracking-widest">
                        Catálogo de Productos
                    </h1>
                    <p className="text-slate-400 text-sm">Encuentra el mejor hardware al mejor precio.</p>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 mb-8 bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
                    <input
                        type="text"
                        placeholder="Buscar producto (ej: RTX 4090)..."
                        value={search}
                        onChange={handleInputChange}
                        className="flex-grow border border-slate-600 bg-slate-900 text-white p-3 rounded shadow-inner focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-500"
                    />
                    
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50"
                        >
                            Buscar
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-slate-700 text-slate-300 px-4 py-2 rounded font-bold hover:bg-slate-600 transition-colors border border-slate-600"
                        >
                            X
                        </button>
                    </div>
                </form>

                {!hasProducts ? (
                    <div className="text-center py-20 text-slate-500 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                        <p className="text-xl font-medium">No se encontraron productos.</p>
                        {search && (
                            <p className="text-sm mt-2 text-slate-400">Intenta con otra búsqueda.</p>
                        )}
                    </div>
                ) : (
                    <>
                        <ProductsGrid products={products} />

                        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-between items-center bg-slate-800 p-4 rounded-lg border-t-4 border-blue-600 shadow-2xl">
                            
                            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                <span>Mostrar:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="border border-slate-600 p-1 rounded bg-slate-900 text-white outline-none focus:border-blue-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="flex gap-1 items-center">
                                <button
                                    disabled={safePagination.pageNumber === 1}
                                    onClick={() => changePage(safePagination.pageNumber - 1)}
                                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors text-sm font-bold"
                                >
                                    &lt; Ant
                                </button>

                                <span className="text-sm text-white font-bold px-4 bg-slate-900 py-2 rounded border border-slate-700">
                                    {safePagination.pageNumber} / {safePagination.totalPages}
                                </span>

                                <button
                                    disabled={safePagination.pageNumber === safePagination.totalPages}
                                    onClick={() => changePage(safePagination.pageNumber + 1)}
                                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors text-sm font-bold"
                                >
                                    Sig &gt;
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
