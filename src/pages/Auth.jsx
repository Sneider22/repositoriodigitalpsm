import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, GraduationCap, MapPin, ChevronDown, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
          {options.find(opt => opt.id === value)?.label || placeholder}
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
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    onToggle();
                  }}
                  className="px-5 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {opt.label}
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
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSelect, setActiveSelect] = useState(null); // 'career' or 'location' or null

  const [careers, setCareers] = useState([]);
  const [sedes, setSedes] = useState([]);

  // Cargar datos dinámicos desde la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [careerRes, locationRes] = await Promise.all([
          supabase.from('career').select('career_id, name_career').order('name_career'),
          supabase.from('location').select('location_id, name_location').order('name_location')
        ]);

        if (careerRes.data) {
          setCareers(careerRes.data.map(c => ({ id: c.career_id, label: c.name_career })));
        }
        if (locationRes.data) {
          setSedes(locationRes.data.map(l => ({ id: l.location_id, label: l.name_location })));
        }
      } catch (err) {
        console.error("Error cargando metadatos para registro:", err);
      }
    };
    fetchData();
  }, []);

  // 0. Detectar éxito de registro desde URL para mostrar notificación premium
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      // 1. Mostrar el aviso nativo que el usuario solicitó
      alert("¡Registro Exitoso! Tu cuenta ha sido creada. Por seguridad, ahora debes iniciar sesión manualmente con tus credenciales.");
      
      // 2. Preparar el formulario
      setIsLogin(true);
      setSuccessMessage("Por favor, ingresa tu correo y contraseña.");
      
      // 3. Limpiar URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('registered');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // 1. Redirección de seguridad: Si ya está logueado, fuera de aquí
  // Pero NO redirigir si acabamos de registrarnos y estamos viendo el éxito
  React.useEffect(() => {
    if (user && !showSuccess) {
      navigate('/', { replace: true });
    }
  }, [user, navigate, showSuccess]);

  // 2. Sincronizar con el estado de navegación (Navbar)
  React.useEffect(() => {
    setActiveSelect(null);
    setError(null); // Limpiar errores al navegar
    setSuccessMessage(null); // Limpiar mensajes al navegar
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]); // Solo reaccionar a cambios externos de navegación

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    career_id: '',
    location_id: ''
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de contraseña (Estándar profesional sugerido)
    if (!isLogin && formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres para tu seguridad.');
      setLoading(false);
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setActiveSelect(null); // Cerrar cualquier selector al enviar

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('La conexión ha tardado demasiado. Verifica tu internet o la configuración del servidor.')), 45000)
      );

      if (isLogin) {
        const authPromise = supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        const { data, error } = await Promise.race([authPromise, timeoutPromise]);

        if (error) throw error;

        navigate('/');
      } else {
        const signUpPromise = supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              career_id: formData.career_id,
              location_id: formData.location_id,
              role: 'estudiante'
            }
          }
        });

        const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);

        if (error) throw error;

        // CERRAR SESIÓN AUTOMÁTICA OBLIGATORIAMENTE
        // Esto garantiza que el sistema no lo deje pasar sin loguearse manualmente
        await supabase.auth.signOut();

        // REDIRECCIÓN CON PARÁMETRO PARA ACTIVAR AVISO
        navigate('/auth?registered=true', { replace: true });
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      let errorMsg = err.message || 'Error de conexión desconocido.';

      if (errorMsg.includes('Invalid login credentials')) {
        errorMsg = 'Credenciales inválidas. Verifica tu correo y contraseña.';
      } else if (errorMsg.includes('Email rate limit exceeded')) {
        errorMsg = 'Demasiados intentos. Por favor, espera unos minutos.';
      } else if (errorMsg.includes('User already registered')) {
        errorMsg = 'Este correo ya está registrado. Intenta iniciar sesión.';
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Vista de éxito para el Registro (Check Email)
  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden p-10 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Registro Exitoso!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Tu cuenta ha sido creada correctamente. Por tu seguridad, hemos activado el sistema de verificación manual. <br /><br />
              Ahora ya puedes <strong>iniciar sesión</strong> con tu correo <span className="font-bold text-primary-600 dark:text-primary-400">{formData.email}</span> para comenzar a usar el repositorio.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                setIsLogin(true);
                setError(null);
                setSuccessMessage("¡Tu cuenta ha sido creada! Por favor, inicia sesión para continuar.");
              }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-500/30"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* NOTIFICACIÓN PREMIUM (TOAST) */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-green-200 dark:border-green-900 shadow-2xl rounded-3xl p-4 flex items-center gap-4 ring-1 ring-green-500/20">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-500/40">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">¡Registro Exitoso!</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">Cuenta creada. Ya puedes iniciar sesión.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

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

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl flex items-center gap-3 text-green-600 dark:text-green-400 text-sm animate-in slide-in-from-top-2">
                <CheckCircle2 className="shrink-0 w-5 h-5" />
                <p>{successMessage}</p>
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
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setActiveSelect(null)}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    label="Carrera"
                    icon={GraduationCap}
                    value={formData.career_id}
                    onChange={(val) => setFormData({ ...formData, career_id: val })}
                    options={careers}
                    placeholder="Tu carrera"
                    isOpen={activeSelect === 'career'}
                    onToggle={() => setActiveSelect(activeSelect === 'career' ? null : 'career')}
                  />
                  <CustomSelect
                    label="Sede"
                    icon={MapPin}
                    value={formData.location_id}
                    onChange={(val) => setFormData({ ...formData, location_id: val })}
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
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  setError(null); // Limpiar errores al cambiar de pestaña
                  setSuccessMessage(null); // Limpiar mensajes al cambiar manualmente
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
