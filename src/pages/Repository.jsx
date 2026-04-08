import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, MapPin, BookOpen, Clock, FileText, ChevronDown, RotateCcw, Plus } from 'lucide-react';
import ProjectCard from '../components/repository/ProjectCard';
import UploadModal from '../components/repository/UploadModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { mockProjects } from '../data/mockProjects';

// Las constantes CARRERAS y SEDES ahora se cargan dinámicamente desde la DB dentro del componente.

const SEMESTRES = [
  { id: "1", label: "Primer Semestre" },
  { id: "2", label: "Segundo Semestre" },
  { id: "3", label: "Tercer Semestre" },
  { id: "4", label: "Cuarto Semestre" },
  { id: "5", label: "Quinto Semestre" },
  { id: "6", label: "Sexto Semestre" },
  { id: "7", label: "Séptimo Semestre" },
  { id: "8", label: "Octavo Semestre" },
  { id: "9", label: "Noveno Semestre" },
  { id: "10", label: "Décimo Semestre" }
];

const TIPOS = [
  { id: "grado", label: "Trabajo de Grado" },
  { id: "investigacion", label: "Proyecto de Investigación" },
  { id: "pasantia", label: "Pasantías" },
  { id: "comunitario", label: "Servicio Comunitario" },
  { id: "materia", label: "Proyecto de Materia" }
];

// Sedes temporales eliminadas. Se cargan en el componente.

const CustomDropdown = ({ icon: Icon, defaultLabel, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Asegurar que siempre haya un texto visible, incluso si el valor no coincide con ninguna opción todavía
  const selectedOption = options.find(opt => opt.id === value || opt.id?.toString() === value?.toString());
  const selectedLabel = selectedOption ? selectedOption.label : defaultLabel;

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 md:py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 shrink-0 transition-colors" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="py-1">
            <button
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${!value ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {defaultLabel}
            </button>
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === opt.id ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Eliminamos los mockProjects estáticos para usar datos reales

const Repository = () => {
  const location = useLocation();

  const [carreras, setCarreras] = useState([]);
  const [sedes, setSedes] = useState([]);

  // Cargar metadatos desde la DB y sincronizar filtros
  useEffect(() => {
    const loadMetadata = async () => {
      console.log("🔍 Cargando filtros dinámicos en Repositorio...");
      try {
        const [cRes, lRes] = await Promise.all([
          supabase.from('career').select('career_id, name_career').order('name_career'),
          supabase.from('location').select('location_id, name_location').order('name_location')
        ]);
        
        let loadedCarreras = [];
        if (cRes.data) {
          loadedCarreras = cRes.data.map(c => ({ id: c.career_id, label: c.name_career }));
          setCarreras(loadedCarreras);
          
          // SINCRONIZACIÓN DE INICIO (Home) -> REPOSITORIO
          // Si venimos de Inicio con un slug (ej: "sistemas") pero la BD usa IDs (ej: 7)
          if (location.state?.carreraId && typeof location.state.carreraId === 'string') {
            const slug = location.state.carreraId.toLowerCase();
            const matchingCareer = loadedCarreras.find(c => 
              c.label.toLowerCase().includes(slug) || slug.includes(c.label.toLowerCase())
            );
            if (matchingCareer) {
              console.log(`🎯 Sincronizado slug "${slug}" -> ID de Base de Datos: ${matchingCareer.id}`);
              setCarrera(matchingCareer.id);
            }
          }
        }
        
        if (lRes.data) setSedes(lRes.data.map(l => ({ id: l.location_id, label: l.name_location })));
        console.log("✅ Filtros listos.");
      } catch (e) {
        console.error("Error cargando filtros:", e);
      }
    };
    loadMetadata();
  }, [location.state]); // Escuchar cambios en la navegación interna

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter States with initialization from URL State (Home redirects)
  const [carrera, setCarrera] = useState(location.state?.carreraId || '');
  const [semestre, setSemestre] = useState('');
  const [tipo, setTipo] = useState('');
  const [sede, setSede] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const isFetchingRef = useRef(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleOpenUpload = () => {
    if (!user) {
      alert("Debes iniciar sesión para subir un proyecto");
      navigate('/auth');
      return;
    }
    setIsUploadModalOpen(true);
  };

  // Si el usuario hace clic nuevamente en un link de Home, forzamos actualización
  useEffect(() => {
    if (location.state?.carreraId) {
      setCarrera(location.state.carreraId);
    }
    if (location.state?.openUploadModal && user) {
      setIsUploadModalOpen(true);
      // Limpiar el estado para evitar reabrir el modal al navegar hacia atrás
      window.history.replaceState({}, document.title);
    }
  }, [location.state, user]);

  const [projectsData, setProjectsData] = useState(mockProjects);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const fetchProjects = async () => {
    // Evitar múltiples llamadas simultáneas
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    setLoadingProjects(true); 
    console.log("🚀 Cargando proyectos...");

    // Promesa de carga con timeout de 20s incorporado localmente
    const fetchWithTimeout = async () => {
      const projectsPromise = supabase
        .from('projects')
        .select(`
          *,
          career:career_id(name_career),
          location:location_id(name_location),
          profiles:user_id(full_name)
        `)
        .order('created_at', { ascending: false });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout de red")), 20000)
      );

      return Promise.race([projectsPromise, timeoutPromise]);
    };

    try {
      const { data, error } = await fetchWithTimeout();

      if (error) throw error;

      console.log(`✅ ÉXITO: Recibidos ${data.length} proyectos.`);

      const mappedProjects = data.map((p) => ({
        id: p.id,
        slug: p.id,
        titulo: p.title,
        descripcion: p.description,
        autor: p.profiles?.full_name || 'Enviado por residente',
        carrera: p.career?.name_career || 'Carrera no especificada',
        carrera_id: Number(p.career_id),
        semestre: `${p.semester}° Semestre`,
        semestre_id: p.semester?.toString(),
        sede: p.location?.name_location || 'Sede no especificada',
        sede_id: Number(p.location_id),
        tipo: TIPOS.find(t => t.id === p.project_type)?.label || p.project_type,
        tipo_id: p.project_type,
        vistas: Math.floor(Math.random() * 500),
        descargas: Math.floor(Math.random() * 200)
      }));
      
      setProjectsData([...mappedProjects, ...mockProjects]);
    } catch (err) {
      console.warn('🟡 Usando fallback por lentitud o error:', err.message);
      setProjectsData(mockProjects);
    } finally {
      setLoadingProjects(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]); // Se dispara al montar y cuando el usuario cambie

  // Sistema de Filtrado Experto (Lógica Inteligente: vincula IDs numéricos con Slugs de texto)
  const filteredProjects = projectsData.filter((project) => {
    // Filtro Carrera: coincide por ID exacto O por nombre parcial (para Mocks)
    const matchCarrera = carrera ? (
      project.carrera_id === carrera || 
      (typeof project.carrera_id === 'string' && carreras.find(c => c.id === carrera)?.label.toLowerCase().includes(project.carrera_id))
    ) : true;

    // Filtro Semestre: coincidencia de valor o string
    const matchSemestre = semestre ? (
      project.semestre_id == semestre || 
      project.semestre_id === semestre?.toString()
    ) : true;

    // Filtro Tipo: los slugs suelen coincidir ('grado', 'investigacion', etc.)
    const matchTipo = tipo ? (
      project.tipo_id === tipo ||
      project.tipo_id === tipo?.toString()
    ) : true;

    // Filtro Sede: coincide por ID exacto O por nombre parcial (para Mocks)
    const matchSede = sede ? (
      project.sede_id === sede ||
      (typeof project.sede_id === 'string' && sedes.find(s => s.id === sede)?.label.toLowerCase().includes(project.sede_id))
    ) : true;
    
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = searchQuery 
      ? project.titulo.toLowerCase().includes(searchLower) || project.descripcion.toLowerCase().includes(searchLower) 
      : true;

    return matchCarrera && matchSemestre && matchTipo && matchSede && matchSearch;
  });

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [carrera, semestre, tipo, sede, searchQuery]);

  const suggestions = [
    "Sistema de Gestión de Inventario",
    "Diseño Estructural de Puente Colgante",
    "Evaluación de Impacto Ambiental en Zona Costera"
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen pb-20 animate-in fade-in duration-300">
      
      {/* Search Header Area */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-16 pb-12 px-4 shadow-sm relative z-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Buscar Proyectos
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Explora el catálogo utilizando nuestro motor de inferencia avanzado.
            </p>
            
            {/* Botón de Subida Destacado (Solo para usuarios logueados) */}
            {user && (
              <button 
                onClick={handleOpenUpload}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-1 active:scale-95 animate-in zoom-in duration-500 delay-200"
              >
                <Plus className="w-6 h-6" />
                Subir Proyecto
              </button>
            )}
          </div>

          {/* Main Search Bar & Autocomplete */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 md:py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:border-primary-500 dark:focus:border-primary-500 text-lg md:text-xl shadow-sm transition-colors"
                placeholder="Escribe palabras clave, título o descripción..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                 <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 md:py-3 rounded-xl font-bold transition-colors shadow-md">
                   Buscar
                 </button>
              </div>
            </div>

            {/* Simulated Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                <ul className="py-2">
                  <li className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                    Sugerencias destacadas
                  </li>
                  {suggestions.map((sug, i) => (
                    <li 
                      key={i} 
                      className="px-5 py-3 md:py-4 hover:bg-primary-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors"
                      onClick={() => {
                        setSearchQuery(sug);
                        setShowSuggestions(false);
                      }}
                    >
                      <Search className="h-4 w-4 text-primary-500" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium md:text-lg">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 4 Custom Dropdowns Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <CustomDropdown 
              icon={BookOpen} 
              defaultLabel="Todas las Carreras" 
              options={carreras} 
              value={carrera} 
              onChange={setCarrera} 
            />
            <CustomDropdown 
              icon={Clock} 
              defaultLabel="Todos los Semestres" 
              options={SEMESTRES} 
              value={semestre} 
              onChange={setSemestre} 
            />
            <CustomDropdown 
              icon={FileText} 
              defaultLabel="Tipos de Proyecto" 
              options={TIPOS} 
              value={tipo} 
              onChange={setTipo} 
            />
            <CustomDropdown 
              icon={MapPin} 
              defaultLabel="Todas las Sedes" 
              options={sedes} 
              value={sede} 
              onChange={setSede} 
            />
          </div>

          {/* Limpiador de Filtros (Compacto) */}
          {(carrera || semestre || tipo || sede) && (
            <div className="flex justify-center mt-6 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => {
                  setCarrera('');
                  setSemestre('');
                  setTipo('');
                  setSede('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 shadow-sm group"
              >
                <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                Limpiar Filtros
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Main Results Area */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="h-6 w-6 text-primary-500" />
            Resultados del Motor de Inferencia
          </h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-inner border border-gray-200 dark:border-gray-700">
            {filteredProjects.length} proyectos evaluados
          </span>
        </div>
        
        {/* ProjectCards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingProjects ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cargando repositorios...</h3>
              <p className="text-gray-500 dark:text-gray-400">Conectando con la base de datos.</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay proyectos encontrados</h3>
              <p className="text-gray-500 dark:text-gray-400">Prueba cambiando los filtros o usando otras palabras clave.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loadingProjects && filteredProjects.length > itemsPerPage && (
          <div className="mt-12 mb-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm"
              >
                <ChevronDown className="w-6 h-6 rotate-90" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.ceil(filteredProjects.length / itemsPerPage))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-primary-500/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(Math.ceil(filteredProjects.length / itemsPerPage), prev + 1));
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                disabled={currentPage === Math.ceil(filteredProjects.length / itemsPerPage)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm"
              >
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </button>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Página {currentPage} de {Math.ceil(filteredProjects.length / itemsPerPage)}
            </p>
          </div>
        )}
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          console.log("Proyecto subido con éxito - refrescando lista");
          fetchProjects(); // Recarga en vivo la nueva fila!
        }}
      />
    </div>
  );
};

export default Repository;
