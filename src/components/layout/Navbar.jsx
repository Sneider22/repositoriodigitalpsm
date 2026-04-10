import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, GraduationCap, User, LogOut, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Al cambiar de ruta, cerrar menú móvil
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-50 border-b border-transparent dark:border-gray-800 transition-colors duration-200">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:opacity-90 transition-opacity"
        >
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">Repositorio PSM</h1>
          <h1 className="text-xl font-bold tracking-tight sm:hidden">PSM</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-primary-600 dark:text-[#44bdff]' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-[#44bdff]'}`}>Inicio</Link>
          <Link to="/repositorios" className={`font-medium transition-colors ${location.pathname === '/repositorios' ? 'text-primary-600 dark:text-[#44bdff]' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-[#44bdff]'}`}>Repositorios</Link>
          <Link to="/info" className={`font-medium transition-colors ${location.pathname === '/info' ? 'text-primary-600 dark:text-[#44bdff]' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-[#44bdff]'}`}>Información</Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" className={`font-medium transition-colors flex items-center gap-1.5 ${location.pathname === '/admin' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
              <ShieldCheck className="w-4 h-4" /> Admin
            </Link>
          )}
        </div>

        {/* Right side - Desktop & Mobile */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Alternar tema oscuro"
          >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Login Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link 
                  to="/auth"
                  state={{ isLogin: true }}
                  className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </Link>
                <Link 
                  to="/auth"
                  state={{ isLogin: false }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{profile?.role || 'USUARIO'}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                    {profile?.full_name?.split(' ')[0] || 'Usuario'}
                  </span>
                </div>
                <button 
                  onClick={signOut}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 md:hidden flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-end items-center p-4">
            <button 
              className="p-2 text-primary-700 dark:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              onClick={toggleMenu}
              aria-label="Cerrar menú"
            >
              <X className="h-10 w-10 stroke-[2.5]" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pt-4 pb-10 px-8 flex flex-col">
            <h2 className="text-[11px] font-bold text-gray-800 dark:text-gray-400 uppercase tracking-[0.3em] mb-6">
              Navegación
            </h2>
            <div className="flex flex-col gap-8">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-primary-700 dark:text-[#44bdff] hover:text-primary-800 dark:hover:text-[#44bdff]/80 transition-colors uppercase tracking-tight">Inicio</Link>
              <Link to="/repositorios" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-primary-700 dark:text-[#44bdff] hover:text-primary-800 dark:hover:text-[#44bdff]/80 transition-colors uppercase tracking-tight">Repositorios</Link>
              <Link to="/info" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-primary-700 dark:text-[#44bdff] hover:text-primary-800 dark:hover:text-[#44bdff]/80 transition-colors uppercase tracking-tight">Información</Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors uppercase tracking-tight flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8" /> Admin
                </Link>
              )}
            </div>
            
            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
              {!user ? (
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/auth" 
                    state={{ isLogin: true }} 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center text-xl font-bold text-primary-700 dark:text-[#44bdff] border-2 border-primary-700 dark:border-[#44bdff] rounded-2xl hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/auth" 
                    state={{ isLogin: false }} 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center text-xl font-bold text-white bg-primary-700 hover:bg-primary-800 rounded-2xl transition-colors shadow-lg shadow-primary-500/30"
                  >
                    Registrarse
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl text-primary-700 dark:text-[#44bdff]">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{profile?.role || 'Estudiante'}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{profile?.full_name || 'Usuario'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }} 
                    className="w-full py-4 text-xl font-bold flex items-center justify-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-2xl transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
