import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, MapPin, BookOpen, Clock, FileText, ChevronDown, RotateCcw, Plus } from 'lucide-react';
import ProjectCard from '../components/repository/ProjectCard';
import UploadModal from '../components/repository/UploadModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CARRERAS = [
  { id: "arquitectura", label: "Arquitectura" },
  { id: "civil", label: "Ingeniería Civil" },
  { id: "electrica", label: "Ingeniería Eléctrica" },
  { id: "electronica", label: "Ingeniería Electrónica" },
  { id: "industrial", label: "Ingeniería Industrial" },
  { id: "mantenimiento", label: "Ingeniería de Mantenimiento Mecánico" },
  { id: "sistemas", label: "Ingeniería de Sistemas" },
  { id: "diseno", label: "Ingeniería en Diseño Industrial" },
  { id: "telecomunicaciones", label: "Ingeniería en Telecomunicaciones" },
  { id: "quimica", label: "Ingeniería Química" },
  { id: "petroleo", label: "Ingeniería de Petróleo" },
  { id: "agronomica", label: "Ingeniería Agronómica" }
];

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

const SEDES = [
  { id: "barcelona", label: "Sede Principal Barcelona" },
  { id: "valencia", label: "Extensión Valencia" },
  { id: "cabimas", label: "Extensión Cabimas" },
  { id: "maracaibo", label: "Extensión Maracaibo" },
  { id: "caracas", label: "Extensión Caracas" },
  { id: "merida", label: "Extensión Mérida" },
  { id: "sancristobal", label: "Extensión San Cristóbal" },
  { id: "barinas", label: "Extensión Barinas" },
  { id: "maracay", label: "Extensión Maracay" },
  { id: "porlamar", label: "Extensión Porlamar" },
  { id: "puertoordaz", label: "Extensión Puerto Ordaz" },
  { id: "maturin", label: "Extensión Maturín" },
  { id: "ciudadojeda", label: "Extensión Ciudad Ojeda" }
];

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

  const selectedLabel = value ? options.find(opt => opt.id === value)?.label : defaultLabel;

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

const mockProjects = [
  {
    id: 1,
    slug: "diseno-sistema-estructural-sismorresistente",
    titulo: "Diseño de un Sistema Estructural Sismorresistente para Edificios Multifamiliares",
    descripcion: "Análisis exhaustivo y diseño tridimensional de un sistema estructural en concreto armado capaz de resistir cargas sísmicas medias y altas en la zona oriental de Venezuela.",
    autor: "Carlos Mendoza & Ana Ruiz",
    carrera: "Ingeniería Civil", carrera_id: "civil",
    semestre: "10mo", semestre_id: "10",
    sede: "Extensión Porlamar", sede_id: "porlamar",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    score: 98,
    vistas: 342,
    descargas: 125
  },
  {
    id: 2,
    slug: "prototipo-app-movil-inventarios-clinicos",
    titulo: "Prototipo de Aplicación Móvil para la Gestión de Inventarios Clínicos",
    descripcion: "Desarrollo de una app móvil progresiva usando React Native y Supabase para el control del almacén del Instituto de Salud local, logrando eficientizar tiempos en un 40%.",
    autor: "Luis Fermín",
    carrera: "Ingeniería de Sistemas", carrera_id: "sistemas",
    semestre: "8vo", semestre_id: "8",
    sede: "Sede Principal Barcelona", sede_id: "barcelona",
    tipo: "Proyecto de Materia", tipo_id: "materia",
    score: 92,
    vistas: 210,
    descargas: 45
  },
  {
    id: 3,
    slug: "plan-mantenimiento-preventivo-bombas-industriales",
    titulo: "Plan Estandarizado de Mantenimiento Preventivo para Bombas Industriales",
    descripcion: "Propuesta de un manual operativo de mantenimiento mecánico predictivo y preventivo diseñado para turbinas y bombas centrífugas en la industria del gas y el petróleo.",
    autor: "Miguel Rivas",
    carrera: "Ing. de Mantenimiento Mecánico", carrera_id: "mantenimiento",
    semestre: "9no", semestre_id: "9",
    sede: "Extensión Maracaibo", sede_id: "maracaibo",
    tipo: "Pasantías", tipo_id: "pasantia",
    score: 87,
    vistas: 156,
    descargas: 89
  },
  {
    id: 4,
    slug: "restauracion-modernizacion-arquitectonica-casco-historico",
    titulo: "Restauración y Modernización Arquitectónica del Casco Histórico",
    descripcion: "Proyecto urbanístico, paisajista y sociológico para restaurar los espacios públicos de la Plaza Central, incorporando jardines autosustentables e iluminación solar.",
    autor: "Elena Suárez",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "10mo", semestre_id: "10",
    sede: "Extensión Caracas", sede_id: "caracas",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    score: 85,
    vistas: 412,
    descargas: 210
  },
  {
    id: 5,
    slug: "diseno-complejo-turistico-ecologico-costero",
    titulo: "Diseño de un Complejo Turístico Ecológico Integrado al Entorno Costero",
    descripcion: "Propuesta arquitectónica de cabañas turísticas sustentables utilizando materiales endémicos y sistemas pasivos de climatización para minimizar la huella de carbono.",
    autor: "Marcos Torres",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "10mo", semestre_id: "10",
    sede: "Extensión Porlamar", sede_id: "porlamar",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    score: 95,
    vistas: 580,
    descargas: 231
  },
  {
    id: 6,
    slug: "centro-cultural-biblioteca-publica-diseno-parametrico",
    titulo: "Centro Cultural y Biblioteca Pública con Diseño Paramétrico",
    descripcion: "Diseño de un recinto público enfocado en la difusión cultural, utilizando herramientas de diseño arquitectónico generativo para optimizar iluminación natural y acústica.",
    autor: "Valeria Guzmán",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "9no", semestre_id: "9",
    sede: "Extensión Mérida", sede_id: "merida",
    tipo: "Proyecto de Materia", tipo_id: "materia",
    score: 89,
    vistas: 320,
    descargas: 110
  },
  {
    id: 7,
    slug: "viviendas-interes-social-modulares-expandibles",
    titulo: "Viviendas de Interés Social Modulares y Expandibles",
    descripcion: "Alternativa habitacional de bajo costo diseñada bajo un esquema arquitectónico modular que permite crecimiento ordenado según las necesidades del grupo familiar.",
    autor: "Simón Andrade",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "10mo", semestre_id: "10",
    sede: "Extensión Valencia", sede_id: "valencia",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    score: 96,
    vistas: 890,
    descargas: 412
  },
  {
    id: 8,
    slug: "intervencion-paisajismo-zonas-universitarias",
    titulo: "Intervención de Paisajismo en Zonas Universitarias Deterioradas",
    descripcion: "Recuperación de espacios verdes dentro del campus universitario promoviendo senderos bioclimáticos, áreas de estudio al aire libre y reforestación.",
    autor: "Ricardo Silva",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "8vo", semestre_id: "8",
    sede: "Sede Principal Barcelona", sede_id: "barcelona",
    tipo: "Servicio Comunitario", tipo_id: "comunitario",
    score: 82,
    vistas: 120,
    descargas: 35
  }
];

const Repository = () => {
  const location = useLocation();

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

  // Expert System (Mock Filtering Logic)
  const filteredProjects = mockProjects.filter((project) => {
    const matchCarrera = carrera ? project.carrera_id === carrera : true;
    const matchSemestre = semestre ? project.semestre_id === semestre : true;
    const matchTipo = tipo ? project.tipo_id === tipo : true;
    const matchSede = sede ? project.sede_id === sede : true;
    
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = searchQuery 
      ? project.titulo.toLowerCase().includes(searchLower) || project.descripcion.toLowerCase().includes(searchLower) 
      : true;

    return matchCarrera && matchSemestre && matchTipo && matchSede && matchSearch;
  });

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
              options={CARRERAS} 
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
              options={SEDES} 
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
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
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
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          // Aquí podríamos recargar los proyectos cuando sean reales
          console.log("Proyecto subido con éxito");
        }}
      />
    </div>
  );
};

export default Repository;
