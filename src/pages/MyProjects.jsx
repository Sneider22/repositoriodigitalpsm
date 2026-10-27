import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  FolderOpen, Clock, CheckCircle2, XCircle,
  BookOpen, Calendar, Tag, ExternalLink, Loader2,
  FileText, ChevronDown, ChevronUp, UploadCloud
} from 'lucide-react';

const PROJECT_TYPE_LABELS = {
  grado: "Trabajo de Grado",
  investigacion: "Proyecto de Investigación",
  pasantia: "Pasantías",
  comunitario: "Servicio Comunitario",
  materia: "Asignación Académica"
};

const statusConfig = {
  pending: {
    label: 'Pendiente de revisión',
    icon: Clock,
    badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-400',
  },
  approved: {
    label: 'Aprobado',
    icon: CheckCircle2,
    badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rechazado',
    icon: XCircle,
    badge: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    dot: 'bg-red-400',
  },
};

const MyProjects = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Route protection
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchMyProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            career:career_id(name_career),
            location:location_id(name_location)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error cargando mis proyectos:', err);
        toast.error('Error al cargar tus proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  if (!user) return null;

  // Summary counts
  const counts = {
    pending: projects.filter(p => p.status === 'pending').length,
    approved: projects.filter(p => p.status === 'approved').length,
    rejected: projects.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <FolderOpen className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Mis Proyectos</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hola, <span className="font-semibold text-gray-700 dark:text-gray-200">{profile?.full_name?.split(' ')[0] || 'estudiante'}</span> — aquí puedes ver el estado de tus envíos.
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-amber-500">{counts.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">En revisión</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-emerald-500">{counts.approved}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Aprobados</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-red-500">{counts.rejected}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Rechazados</p>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="font-medium">Cargando tus proyectos…</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-16 text-center shadow-sm">
            <UploadCloud className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aún no has subido proyectos</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Cuando subas un proyecto podrás ver su estado aquí en tiempo real.
            </p>
            <Link
              to="/repositorios"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md shadow-primary-500/20 transition-colors"
            >
              <UploadCloud className="w-4 h-4" /> Subir un proyecto
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((proj) => {
              const cfg = statusConfig[proj.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const isExpanded = expandedId === proj.id;

              return (
                <div key={proj.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-5">
                    {/* Top row: status badge + date + toggle */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">Enviado: {formatDate(proj.created_at)}</span>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-3">{proj.title}</h3>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary-500 shrink-0" />{proj.career?.name_career || 'Sin carrera'}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500 shrink-0" />{proj.semester}° Semestre</span>
                      <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary-500 shrink-0" />{PROJECT_TYPE_LABELS[proj.project_type] || proj.project_type}</span>
                    </div>

                    {/* If approved: link to public page */}
                    {proj.status === 'approved' && proj.slug && (
                      <div className="mt-4">
                        <Link
                          to={`/repositorios/proyecto/${proj.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ver en repositorio público
                        </Link>
                      </div>
                    )}

                    {/* If rejected: info message */}
                    {proj.status === 'rejected' && (
                      <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700 dark:text-red-400">
                          Tu proyecto fue revisado y no cumplió con los criterios de aprobación. Los Sentimos
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expanded: description + keywords + files */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-900/50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {proj.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{proj.description}</p>
                      )}
                      {proj.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {proj.keywords.map((k, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">{k}</span>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
