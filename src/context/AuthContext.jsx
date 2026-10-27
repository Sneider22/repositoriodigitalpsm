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
          fetchProfile(session.user.id, session.user); // No esperar al perfil para desbloquear el resto
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
        fetchProfile(session.user.id, session.user); // Carga asíncrona no bloqueante
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const fetchProfile = async (userId, userAuth = null) => {
    try {
      // 1. Prioridad: Metadatos del usuario (esto es instantáneo y viene en la sesión)
      const meta = userAuth?.user_metadata;
      console.log(meta);
      if (meta && !profile) {
        setProfile({
          full_name: meta.full_name || 'Usuario',
          career: meta.career || '',
          location: meta.location || ''
          // role NO se setea desde metadata — siempre viene de la tabla profiles (BD)
        });
      }

      // 2. Carga desde la tabla 'profiles' (datos oficiales y roles)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId) // Cambiado de 'id' a 'user_id' para coincidir con tu SQL
        .single();

      if (error) {
        console.warn("Perfil BD no encontrado, manteniendo metadatos:", error.message);
      } else if (data) {
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
