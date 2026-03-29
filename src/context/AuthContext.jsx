import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener sesión actual al cargar
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error obteniendo sesión:", error);
        }
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Error crítico en getSession:", err);
      } finally {
        // SIEMPRE desbloquear la app, pase lo que pase
        setLoading(false);
      }
    };

    getSession();

    // Timeout de seguridad: si después de 5 segundos sigue cargando, desbloquear
    const safetyTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn("AuthContext: Timeout de seguridad activado - desbloqueando app");
        }
        return false;
      });
    }, 5000);

    // 2. Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("No se pudo cargar el perfil (puede que la tabla no exista aún):", error.message);
        // Usar metadatos del usuario como fallback
        const meta = (await supabase.auth.getUser())?.data?.user?.user_metadata;
        if (meta) {
          setProfile({
            full_name: meta.full_name || 'Usuario',
            career: meta.career || '',
            location: meta.location || '',
            role: 'student'
          });
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error en fetchProfile:", err);
    }
  };

  const signOut = async () => {
    try {
      // 1. Limpiar estados de React inmediatamente
      setUser(null);
      setProfile(null);
      
      // 2. Intentar cierre de sesión oficial en el servidor
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error en signOut:", err);
    } finally {
      // 3. LIMPIEZA FORZOSA: Borrar tokens de Supabase del localStorage 
      // Esto evita el bucle si el token expiró en el servidor pero sigue en el navegador
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.error("Error limpiando localStorage", e);
      }
      
      // 4. Redirigir limpiamente sin afectar el historial
      window.location.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
