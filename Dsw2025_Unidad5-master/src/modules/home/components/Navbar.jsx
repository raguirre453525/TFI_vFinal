import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../auth/hook/useAuth";
import CartWidget from "./CartWidget";

function Navbar() {
    const { isAuthenticated, setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        setAuth({
            isAuthenticated: false,
            user: null,
            token: null,
        });
        localStorage.removeItem("token");
        navigate("/");
    };

    const goToCart = () => {
        navigate("/cart");
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-blue-900 mb-0 sticky top-0 z-50">
            <NavLink 
                to="/" 
                className="text-2xl font-black text-white italic tracking-wider hover:text-blue-500 transition-colors"
            >
                DSW<span className="text-blue-500">2025</span>
            </NavLink>

            <div className="flex gap-4 items-center">
                
                <button
                    onClick={goToCart}
                    className="relative px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded transition-colors font-bold text-sm uppercase tracking-wide"
                >
                    <span className="flex items-center gap-2">
                        🛒 Carrito
                    </span>
                    <CartWidget />
                </button>

                {isAuthenticated ? (
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-sm uppercase transition-colors shadow-lg shadow-red-500/20"
                    >
                        Salir
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-sm uppercase transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Ingresar
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;