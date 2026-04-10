import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, BookOpen,
  User, MapPin, Calendar, Tag, ExternalLink, Loader2,
  FileText, Eye, ChevronDown, ChevronUp
} from 'lucide-react';

const AdminPanel = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [approvedCount, setApprovedCount] = useState(0);

  // Protección de ruta: solo admin
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Si profile.role aún no está definido, la BD todavía no ha respondido — esperar
    if (profile && profile.role && profile.role !== 'admin') {
      toast.error('Acceso denegado', { description: 'No tienes permisos para acceder al panel de administración.' });
      navigate('/');
    }
  }, [user, profile, navigate]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          career:career_id(name_career),
          location:location_id(name_location),
          profiles:user_id(full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);

      // Contar aprobados esta semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count, error: countError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gte('created_at', weekAgo.toISOString());
      if (!countError) setApprovedCount(count || 0);
    } catch (err) {
      console.error('Error cargando pendientes:', err);
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchPending();
    }
  }, [user, profile]);

  const handleAction = async (projectId, action) => {
    setActionLoading(projectId + action);
    try {
      const { error } = await supabase.rpc('update_project_status', {
        project_id_param: projectId,
        new_status: action
      });

      if (error) throw error;

      if (action === 'approved') {
        toast.success('¡Proyecto aprobado!', { description: 'Ya es visible en el repositorio público.' });
        setApprovedCount(prev => prev + 1);
      } else {
        toast.info('Proyecto rechazado', { description: 'El proyecto permanecerá en espera con estado rechazado.' });
      }

      // Remover de la lista sin recargar
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error('Error al procesar la acción');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  if (!user || !profile) return null;
  if (profile.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <ShieldCheck className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Panel de Administración</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Repositorio Digital PSM — Moderación de Contenido</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{loading ? '...' : projects.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pendientes de revisión</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{approvedCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Aprobados esta semana</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{profile?.full_name || 'Administrador'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> Proyectos en Espera de Aprobación
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="font-medium">Cargando proyectos pendientes...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-16 text-center shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Todo al día!</h3>
            <p className="text-gray-500 dark:text-gray-400">No hay proyectos pendientes de revisión en este momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                
                {/* Card Header */}
                <div className="p-5">
                  {/* Top row: badge + date + expand toggle */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-3 h-3" /> Pendiente
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Enviado: {formatDate(proj.created_at)}</span>
                    <button
                      onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
                      className="ml-auto p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors"
                      title="Ver descripción"
                    >
                      {expandedId === proj.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-3">{proj.title}</h3>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary-500 shrink-0" />{proj.profiles?.full_name || 'Autor desconocido'}</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary-500 shrink-0" />{proj.career?.name_career || 'Sin carrera'}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500 shrink-0" />{proj.location?.name_location || 'Sin sede'}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500 shrink-0" />{proj.semester}° Semestre</span>
                    <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary-500 shrink-0" />{proj.project_type}</span>
                  </div>
                </div>

                {/* Action Buttons — always full width on bottom */}
                <div className="flex gap-2 px-5 pb-5">
                  <button
                    onClick={() => handleAction(proj.id, 'rejected')}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === proj.id + 'rejected' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleAction(proj.id, 'approved')}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === proj.id + 'approved' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Aprobar
                  </button>
                </div>


                {/* Expanded: Description + Files + Link */}
                {expandedId === proj.id && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-900/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{proj.description}</p>
                    
                    {proj.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {proj.keywords.map((k, i) => (
                          <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">
                            {k}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {proj.file_urls?.map((f, i) => (
                        <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <FileText className="w-3.5 h-3.5" /> {f.name}
                        </a>
                      ))}
                      {proj.external_link && (
                        <a href={proj.external_link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> Ver enlace online
                        </a>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
