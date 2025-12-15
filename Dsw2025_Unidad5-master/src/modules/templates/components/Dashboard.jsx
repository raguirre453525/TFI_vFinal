import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { logout: doLogout } = useAuth();

  const logout = () => {
    doLogout();
    navigate('/login');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block py-3 rounded-md transition-all duration-200 font-bold tracking-wide
      ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 border-l-4 border-white' 
        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
      }
    `
  );

  const renderLogoutButton = (mobile = false) => (
    <div className={`${mobile ? 'block w-full sm:hidden mt-4' : 'hidden sm:block'}`}>
      <button 
        onClick={logout}
        className="
            px-4 py-2 
            bg-red-600 hover:bg-red-700 
            text-white 
            rounded 
            font-bold 
            text-sm 
            uppercase 
            transition-colors 
            shadow-lg shadow-red-500/20
            w-full sm:w-auto
        "
      >
        Salir
      </button>
    </div>
  );

  return (
    <div
      className="
        h-screen
        w-screen
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
        bg-slate-900 
        overflow-hidden
        sm:grid-cols-[260px_1fr]
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          px-6 py-4        /* Padding ajustado como en Navbar */
          bg-black         /* Fondo Negro */
          border-b
          border-blue-900  /* Borde Azul */
          z-20
          sm:col-span-2
        "
      >
        <div className="flex items-center gap-3">
            <NavLink 
                to="/" 
                className="text-2xl font-black text-white italic tracking-wider hover:text-blue-500 transition-colors"
            >
                DSW<span className="text-blue-500">2025</span>
            </NavLink>
            
            <span className="text-[10px] font-bold text-slate-400 border border-slate-700 px-2 py-0.5 rounded uppercase tracking-widest">
                Admin
            </span>
        </div>

        <div className="flex items-center gap-4">
            {renderLogoutButton()}

            <button
            className="
                bg-transparent
                border border-slate-600
                text-white
                p-2
                rounded
                sm:hidden
                hover:bg-slate-800
            "
            onClick={() => setOpenMenu(!openMenu)}
            >
                {openMenu ? "✕" : "☰"}
            </button>
        </div>
      </header>

      <aside
        className={`
          absolute
          top-[74px]       /* Ajustado ligeramente por el cambio de altura del header */
          bottom-0
          bg-slate-800
          border-r border-slate-700
          w-64
          p-6
          z-30
          transition-all duration-300 ease-in-out
          ${openMenu ? 'left-0 shadow-2xl shadow-black' : 'left-[-260px]'}
          flex
          flex-col
          justify-between

          sm:relative
          sm:top-0
          sm:left-0
          sm:shadow-none
        `}
      >
        <nav>
            <p className="text-xs text-slate-500 font-bold uppercase mb-4 tracking-widest">
                Navegación
            </p>
          <ul className='flex flex-col gap-2'>
            <li>
              <NavLink to='/admin/home' className={getLinkStyles} end>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to='/admin/products' className={getLinkStyles}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to='/admin/orders' className={getLinkStyles}>
                Órdenes
              </NavLink>
            </li>
          </ul>
        </nav>

        <div>
            <hr className='border-slate-700 my-4' />
            <div className="flex items-center gap-3 text-slate-400 text-sm px-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Sistema en línea
            </div>
            {renderLogoutButton(true)}
        </div>
      </aside>

      <main
        className="
          p-6
          overflow-y-auto
          bg-slate-900
          scroll-smooth
        "
      >
        <div className="max-w-7xl mx-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;