import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { calculateIRA } from '../utils/expertSystem';
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, BookOpen,
  User, MapPin, Calendar, Tag, ExternalLink, Loader2,
  FileText, Eye, ChevronDown, ChevronUp, AlertTriangle, Award
} from 'lucide-react';

const PROJECT_TYPE_LABELS = {
  grado: "Trabajo de Grado",
  investigacion: "Proyecto de Investigación",
  pasantia: "Pasantías",
  comunitario: "Servicio Comunitario",
  materia: "Asignación Académica"
};

const STATUS_TABS = [
  { key: 'pending', label: 'Pendientes', icon: Clock, color: 'amber' },
  { key: 'approved', label: 'Aprobados', icon: CheckCircle2, color: 'emerald' },
  { key: 'rejected', label: 'Rechazados', icon: XCircle, color: 'red' },
];

const tabClasses = {
  amber: { active: 'border-amber-500 text-amber-600 dark:text-amber-400', icon: 'text-amber-500' },
  emerald: { active: 'border-emerald-500 text-emerald-600 dark:text-emerald-400', icon: 'text-emerald-500' },
  red: { active: 'border-red-500 text-red-600 dark:text-red-400', icon: 'text-red-500' },
};

const AdminPanel = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending');
  const [projects, setProjects] = useState({ pending: [], approved: [], rejected: [] });
  const [loadingTab, setLoadingTab] = useState({ pending: true, approved: false, rejected: false });
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Stats
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // ─── Route protection ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (profile && profile.role && profile.role !== 'admin') {
      toast.error('Acceso denegado', { description: 'No tienes permisos para acceder al panel de administración.' });
      navigate('/');
    }
  }, [user, profile, navigate]);

  // ─── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchByStatus = async (status) => {
    setLoadingTab(prev => ({ ...prev, [status]: true }));
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, career:career_id(name_career), location:location_id(name_location), profiles:user_id(full_name)`)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(prev => ({ ...prev, [status]: data || [] }));
    } catch (err) {
      console.error(`Error cargando ${status}:`, err);
      toast.error(`Error al cargar proyectos ${status}`);
    } finally {
      setLoadingTab(prev => ({ ...prev, [status]: false }));
    }
  };

  const fetchStats = async () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [{ count: aCount }, { count: rCount }] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('created_at', weekAgo.toISOString()),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    ]);

    setApprovedCount(aCount || 0);
    setRejectedCount(rCount || 0);
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchByStatus('pending');
      fetchStats();
    }
  }, [user, profile]);

  // Lazy-load other tabs on first visit
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedId(null);
    if (projects[tab].length === 0 && !loadingTab[tab]) {
      fetchByStatus(tab);
    }
  };

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const handleAction = async (projectId, newStatus, fromStatus) => {
    setActionLoading(projectId + newStatus);
    try {
      const { error } = await supabase.rpc('update_project_status', {
        project_id_param: projectId,
        new_status: newStatus
      });
      if (error) throw error;

      if (newStatus === 'approved') {
        toast.success('¡Proyecto aprobado!', { description: 'Ya es visible en el repositorio público.' });
        setApprovedCount(prev => prev + 1);
      } else if (newStatus === 'rejected') {
        toast.info('Proyecto rechazado.');
        setRejectedCount(prev => prev + 1);
      } else if (newStatus === 'pending') {
        toast.info('Proyecto marcado como pendiente nuevamente.');
      }

      // Remove from current tab list and invalidate destination tab
      setProjects(prev => ({
        ...prev,
        [fromStatus]: prev[fromStatus].filter(p => p.id !== projectId),
        [newStatus]: [], // force re-fetch when that tab is visited
      }));
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error('Error al procesar la acción');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (!user || !profile) return null;
  if (profile.role !== 'admin') return null;

  const currentProjects = projects[activeTab];
  const isLoading = loadingTab[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
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

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {/* Pendientes */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-7 h-7 text-amber-500 shrink-0" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{isLoading && activeTab === 'pending' ? '…' : projects.pending.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">Pendientes</p>
              </div>
            </div>
          </div>
          {/* Aprobados semana */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{approvedCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">Aprobados esta semana</p>
              </div>
            </div>
          </div>
          {/* Rechazados */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <XCircle className="w-7 h-7 text-red-500 shrink-0" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{rejectedCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">Rechazados total</p>
              </div>
            </div>
          </div>
          {/* Admin */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-primary-500 shrink-0" />
              <div>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{profile?.full_name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">Administrador</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-800 overflow-x-auto hide-scrollbar whitespace-nowrap">
          {STATUS_TABS.map(({ key, label, icon: Icon, color }) => {
            const isActive = activeTab === key;
            const cls = tabClasses[color];
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-bold border-b-2 transition-colors -mb-px shrink-0 ${isActive
                  ? cls.active + ' bg-transparent'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? cls.icon : ''}`} />
                {label}
                {key === 'pending' && projects.pending.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                    {projects.pending.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Project list ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="font-medium">Cargando proyectos…</p>
          </div>
        ) : currentProjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-16 text-center shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sin proyectos aquí</h3>
            <p className="text-gray-500 dark:text-gray-400">No hay proyectos en esta categoría por ahora.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                tab={activeTab}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                actionLoading={actionLoading}
                handleAction={handleAction}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// ── ProjectCard ──────────────────────────────────────────────────────────────
const statusBadge = {
  pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  approved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  rejected: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
};
const statusLabel = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' };
const StatusIcon = { pending: Clock, approved: CheckCircle2, rejected: XCircle };

const ProjectCard = ({ proj, tab, expandedId, setExpandedId, actionLoading, handleAction, formatDate }) => {
  const Icon = StatusIcon[tab];

  const calculatedScore = calculateIRA({
    type: PROJECT_TYPE_LABELS[proj.project_type] || proj.project_type,
    downloads: proj.downloads_count,
    views: proj.views_count,
    year: proj.created_at ? new Date(proj.created_at).getFullYear() : new Date().getFullYear(),
    semester: proj.semester,
    career: proj.career?.name_career,
    title: proj.title,
    summary: proj.description
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge[tab]}`}>
            <Icon className="w-3 h-3" /> {statusLabel[tab]}
          </span>
          
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg text-[10px] font-extrabold border border-amber-100 dark:border-amber-800/50" title="Relevancia calculada">
            <Award className="w-3 h-3 fill-amber-500/20" />
            {calculatedScore}% IRA
          </div>

          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">Enviado: {formatDate(proj.created_at)}</span>
          <button
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            className="ml-auto p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors"
          >
            {expandedId === proj.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-3">{proj.title}</h3>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary-500 shrink-0" />{proj.profiles?.full_name || 'Autor desconocido'}</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary-500 shrink-0" />{proj.career?.name_career || 'Sin carrera'}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary-500 shrink-0" />{proj.location?.name_location || 'Sin sede'}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500 shrink-0" />{proj.semester}° Semestre</span>
          <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary-500 shrink-0" />{PROJECT_TYPE_LABELS[proj.project_type] || proj.project_type}</span>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-wrap gap-2 px-5 pb-5">
        {tab === 'pending' && (
          <>
            <button
              onClick={() => handleAction(proj.id, 'rejected', 'pending')}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
            >
              {actionLoading === proj.id + 'rejected' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Rechazar
            </button>
            <button
              onClick={() => handleAction(proj.id, 'approved', 'pending')}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-colors disabled:opacity-50"
            >
              {actionLoading === proj.id + 'approved' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Aprobar
            </button>
          </>
        )}

        {tab === 'approved' && (
          <div className="flex gap-2 w-full">
            <Link
              to={`/repositorios/proyecto/${proj.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 border border-primary-200 dark:border-primary-800 transition-colors"
            >
              <Eye className="w-4 h-4" /> Ver en repositorio
            </Link>
            <button
              onClick={() => {
                toast('¿Confirmar rechazo?', {
                  description: 'Se retirará este proyecto del repositorio público.',
                  action: {
                    label: 'Rechazar',
                    onClick: () => handleAction(proj.id, 'rejected', 'approved')
                  },
                  cancel: {
                    label: 'Cancelar',
                    onClick: () => { }
                  }
                });
              }}
              disabled={!!actionLoading}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
              title="Mover a rechazados"
            >
              {actionLoading === proj.id + 'rejected' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            </button>
          </div>
        )}

        {tab === 'rejected' && (
          <button
            onClick={() => {
              toast('¿Reaprobar proyecto?', {
                description: 'El proyecto volverá a ser visible en el repositorio público.',
                action: {
                  label: 'Aprobar',
                  onClick: () => handleAction(proj.id, 'approved', 'rejected')
                },
                cancel: {
                  label: 'Cancelar',
                  onClick: () => { }
                }
              });
            }}
            disabled={!!actionLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-colors disabled:opacity-50"
          >
            {actionLoading === proj.id + 'approved' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Reaprobar proyecto
          </button>
        )}
      </div>

      {/* ── Expanded Detail ── */}
      {expandedId === proj.id && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-900/50 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{proj.description}</p>
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
};

export default AdminPanel;
