import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, GraduationCap, MapPin, ChevronDown } from 'lucide-react';

const CustomSelect = ({ label, icon: Icon, value, onChange, options, placeholder, isOpen, onToggle }) => {
  return (
    <div className="space-y-2 relative">
      <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-gray-400" /> {label}
      </label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full pl-5 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none flex items-center justify-between text-left"
      >
        <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle}></div>
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    onToggle();
                  }}
                  className="px-5 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSelect, setActiveSelect] = useState(null); // 'career' or 'location' or null

  const careers = [
    "Arquitectura", "Ing. Civil", "Ing. Eléctrica", "Ing. Electrónica", 
    "Ing. Industrial", "Ing. Mecánica", "Ing. de Sistemas", "Ing. Diseño Industrial", 
    "Ing. Telecom", "Ing. Química", "Ing. de Petróleo", "Ing. Agronómica"
  ];

  const sedes = [
    "Sede Barcelona", "Sede Valencia", "Extensión Maturín", "Extensión Puerto Ordaz", 
    "Extensión San Cristóbal", "Extensión Porlamar", "Extensión Maracaibo", 
    "Extensión Cabimas", "Extensión Mérida", "Extensión Tovar", 
    "Extensión Ciudad Ojeda", "Extensión Caracas"
  ];

  // Sincronizar con el estado de navegación (Navbar)
  React.useEffect(() => {
    setActiveSelect(null);
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]); // Solo reaccionar a cambios externos de navegación

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    career: '',
    location: ''
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setActiveSelect(null); // Cerrar cualquier selector al enviar

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { data: { user }, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              career: formData.career,
              location: formData.location
            }
          }
        });
        if (error) throw error;

        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              full_name: formData.fullName,
              career: formData.career,
              location: formData.location,
              role: 'student'
            });
          if (profileError) throw profileError;
        }

        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        
        {/* Card Principal */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          
          {/* Header del Card */}
          <div className="bg-primary-600 p-8 text-center text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {isLogin ? <LogIn size={80} /> : <UserPlus size={80} />}
            </div>
            <h2 className="text-3xl font-extrabold mb-2">
              {isLogin ? '¡Bienvenido!' : 'Crea tu cuenta'}
            </h2>
            <p className="text-primary-100 text-sm font-medium">
              {isLogin 
                ? 'Ingresa para acceder al repositorio' 
                : 'Únete a la comunidad académica'}
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in slide-in-from-top-2">
                <AlertCircle className="shrink-0 w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      onFocus={() => setActiveSelect(null)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1">
                  Correo Institucional
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email"
                    required
                    placeholder="usuario@ejemplo.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    onFocus={() => setActiveSelect(null)}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    label="Carrera"
                    icon={GraduationCap}
                    value={formData.career}
                    onChange={(val) => setFormData({...formData, career: val})}
                    options={careers}
                    placeholder="Tu carrera"
                    isOpen={activeSelect === 'career'}
                    onToggle={() => setActiveSelect(activeSelect === 'career' ? null : 'career')}
                  />
                  <CustomSelect
                    label="Sede"
                    icon={MapPin}
                    value={formData.location}
                    onChange={(val) => setFormData({...formData, location: val})}
                    options={sedes}
                    placeholder="Tu sede"
                    isOpen={activeSelect === 'location'}
                    onToggle={() => setActiveSelect(activeSelect === 'location' ? null : 'location')}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 dark:text-white transition-all outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    onFocus={() => setActiveSelect(null)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group mt-8"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    {isLogin ? 'Entrar ahora' : 'Crear mi cuenta'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setActiveSelect(null);
                }}
                className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {isLogin 
                  ? '¿No tienes cuenta? Regístrate aquí' 
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-gray-400 text-xs font-medium">
          Sistema de Repositorio Digital PSM - © 2026
        </p>
      </div>
    </div>
  );
};

export default Auth;
