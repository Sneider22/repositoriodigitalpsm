import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, BookOpen, FileText, User, 
  Tag, Download, Globe, Database, FileCode, Archive, ImagePlus,
  Layers, ChevronRight, File, Package, Clock, X, ChevronLeft
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Data mock completa para buscar por slug
const mockProjects = [
  {
    id: 1,
    slug: "diseno-sistema-estructural-sismorresistente",
    titulo: "Diseño de un Sistema Estructural Sismorresistente para Edificios Multifamiliares",
    descripcion: "Análisis exhaustivo y diseño tridimensional de un sistema estructural en concreto armado capaz de resistir cargas sísmicas medias y altas en la zona oriental de Venezuela. Incorpora normativas COVENIN vigentes y modelado en software especializado.",
    carrera: "Ingeniería Civil",
    semestre: "10mo Semestre",
    ano_publicacion: "2023",
    sede: "Extensión Porlamar",
    tipo: "Trabajo de Grado",
    autores: ["Carlos Mendoza", "Ana Ruiz"],
    profesor: "Ing. Roberto Méndez",
    fecha_publicacion: "12 de Octubre, 2023",
    linea_investigacion: "Estructuras y Sismología",
    palabras_clave: ["Sismorresistente", "Concreto Armado", "Edificios", "COVENIN"],
    galeria: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Memoria_Calculo.pdf", tipo: "pdf", peso: "8.5 MB" },
      { nombre: "Planos_Estructurales.dwg", tipo: "cad", peso: "22.1 MB" }
    ]
  },
  {
    id: 2,
    slug: "prototipo-app-movil-inventarios-clinicos",
    titulo: "Prototipo de Aplicación Móvil para la Gestión de Inventarios Clínicos",
    descripcion: "Desarrollo de una app móvil progresiva usando React Native y Supabase para el control del almacén del Instituto de Salud local, logrando eficientizar tiempos en un 40%. La solución incluye escaneo de códigos de barras y alertas en tiempo real.",
    carrera: "Ingeniería de Sistemas",
    semestre: "8vo Semestre",
    ano_publicacion: "2024",
    sede: "Sede Principal Barcelona",
    tipo: "Por Asignatura",
    autores: ["Luis Fermín"],
    profesor: "MSc. Juan Pérez",
    fecha_publicacion: "05 de Marzo, 2024",
    linea_investigacion: "Desarrollo de Software e IA",
    palabras_clave: ["Mobile", "React Native", "Inventario", "Salud"],
    galeria: [
      "https://images.unsplash.com/photo-1551288049-bbbda536339a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Codigo_Fuente.zip", tipo: "zip", peso: "12.4 MB" },
      { nombre: "Manual_Usuario.pdf", tipo: "pdf", peso: "1.2 MB" }
    ]
  },
  {
    id: 3,
    slug: "plan-mantenimiento-preventivo-bombas-industriales",
    titulo: "Plan Estandarizado de Mantenimiento Preventivo para Bombas Industriales",
    descripcion: "Propuesta de un manual operativo de mantenimiento mecánico predictivo y preventivo diseñado para turbinas y bombas centrífugas en la industria del gas y el petróleo. Incluye análisis de vibraciones y termografía.",
    carrera: "Ing. de Mantenimiento Mecánico",
    semestre: "9no Semestre",
    ano_publicacion: "2023",
    sede: "Extensión Maracaibo",
    tipo: "Pasantía",
    autores: ["Miguel Rivas"],
    profesor: "Ing. Carlos Govea",
    fecha_publicacion: "20 de Agosto, 2023",
    linea_investigacion: "Mantenimiento Industrial",
    palabras_clave: ["Mantenimiento", "Bombas", "Industria", "Petróleo"],
    galeria: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Plan_Mantenimiento.pdf", tipo: "pdf", peso: "3.8 MB" }
    ]
  },
  {
    id: 4,
    slug: "restauracion-modernizacion-arquitectonica-casco-historico",
    titulo: "Restauración y Modernización Arquitectónica del Casco Histórico",
    descripcion: "Proyecto urbanístico, paisajista y sociológico para restaurar los espacios públicos de la Plaza Central, incorporando jardines autosustentables e iluminación solar. Se enfoca en la preservación del patrimonio colonial.",
    carrera: "Arquitectura",
    semestre: "10mo Semestre",
    ano_publicacion: "2024",
    sede: "Extensión Caracas",
    tipo: "Trabajo de Grado",
    autores: ["Elena Suárez"],
    profesor: "Arq. Mario Rossi",
    fecha_publicacion: "10 de Enero, 2024",
    linea_investigacion: "Urbanismo y Patrimonio",
    palabras_clave: ["Arquitectura", "Patrimonio", "Sustentable", "Urbanismo"],
    galeria: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Propuesta_Urbana.pdf", tipo: "pdf", peso: "15.0 MB" },
      { nombre: "Modelado_3D.obj", tipo: "3d", peso: "85.0 MB" }
    ]
  },
  {
    id: 5,
    slug: "diseno-complejo-turistico-ecologico-costero",
    titulo: "Diseño de un Complejo Turístico Ecológico Integrado al Entorno Costero",
    descripcion: "Este proyecto propone una solución arquitectónica sustentable orientada al desarrollo turístico en la zona costera oriental. Mediante la utilización de materiales endémicos como el bambú y la madera certificada, el complejo busca reducir la huella de carbono al mínimo. Incorpora sistemas pasivos de climatización, reutilización de aguas pluviales y generación de energía solar, creando una armonía perfecta entre el confort moderno y el ecosistema natural protector de los manglares.",
    carrera: "Arquitectura",
    semestre: "10mo Semestre",
    ano_publicacion: "2023",
    sede: "Extensión Porlamar",
    tipo: "Trabajo de Grado",
    autores: ["Marcos Torres", "Lucía Peña"],
    profesor: "Arq. Hernán Cortés",
    fecha_publicacion: "15 de Noviembre, 2023",
    linea_investigacion: "Diseño Arquitectónico Sustentable",
    palabras_clave: ["Ecoturismo", "Climatización Pasiva", "Bambú", "Desarrollo Costero", "Bioclimática"],
    galeria: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Memoria_Descriptiva.pdf", tipo: "pdf", peso: "4.2 MB" },
      { nombre: "Planos_Estructurales.dwg", tipo: "cad", peso: "15.8 MB" },
      { nombre: "Renders_Alta_Resolucion.rar", tipo: "rar", peso: "145.0 MB" },
      { nombre: "Base_De_Datos_Ambiental.sql", tipo: "sql", peso: "350 KB" },
      { nombre: "Estilos_Presentacion.css", tipo: "css", peso: "12 KB" },
      { nombre: "Fachada_Principal.png", tipo: "img", peso: "2.1 MB" },
      { nombre: "Modelo_3D_Maqueta.obj", tipo: "3d", peso: "54.1 MB" }
    ]
  },
  {
    id: 6,
    slug: "centro-cultural-biblioteca-publica-diseno-parametrico",
    titulo: "Centro Cultural y Biblioteca Pública con Diseño Paramétrico",
    descripcion: "Diseño de un recinto público enfocado en la difusión cultural, utilizando herramientas de diseño arquitectónico generativo para optimizar iluminación natural y acústica.",
    carrera: "Arquitectura",
    semestre: "9no Semestre",
    ano_publicacion: "2024",
    sede: "Extensión Mérida",
    tipo: "Por Asignatura",
    autores: ["Valeria Guzmán"],
    profesor: "Arq. Luis Salas",
    fecha_publicacion: "22 de Febrero, 2024",
    linea_investigacion: "Arquitectura Biomimética",
    palabras_clave: ["Paramétrico", "Biblioteca", "Cultura", "Acústica"],
    galeria: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Proyecto_Parametrico.pdf", tipo: "pdf", peso: "9.7 MB" }
    ]
  },
  {
    id: 7,
    slug: "viviendas-interes-social-modulares-expandibles",
    titulo: "Viviendas de Interés Social Modulares y Expandibles",
    descripcion: "Alternativa habitacional de bajo costo diseñada bajo un esquema arquitectónico modular que permite crecimiento ordenado según las necesidades del grupo familiar.",
    carrera: "Arquitectura",
    semestre: "10mo Semestre",
    ano_publicacion: "2023",
    sede: "Extensión Valencia",
    tipo: "Trabajo de Grado",
    autores: ["Simón Andrade"],
    profesor: "Arq. Claudia Martínez",
    fecha_publicacion: "30 de Junio, 2023",
    linea_investigacion: "Vivienda Social",
    palabras_clave: ["Vivienda", "Modular", "Interés Social", "Costos"],
    galeria: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Diseño_Modular.pdf", tipo: "pdf", peso: "5.5 MB" }
    ]
  },
  {
    id: 8,
    slug: "intervencion-paisajismo-zonas-universitarias",
    titulo: "Intervención de Paisajismo en Zonas Universitarias Deterioradas",
    descripcion: "Recuperación de espacios verdes dentro del campus universitario promoviendo senderos bioclimáticos, áreas de estudio al aire libre y reforestación.",
    carrera: "Arquitectura",
    semestre: "8vo Semestre",
    ano_publicacion: "2024",
    sede: "Sede Principal Barcelona",
    tipo: "Servicio Comunitario",
    autores: ["Ricardo Silva"],
    profesor: "Ing. Beatriz Díaz",
    fecha_publicacion: "14 de Abril, 2024",
    linea_investigacion: "Paisajismo Urbano",
    palabras_clave: ["Paisajismo", "Universidad", "Ecológico", "Campus"],
    galeria: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Informe_Servicio.pdf", tipo: "pdf", peso: "2.8 MB" }
    ]
  }
];

// Utilidad para extraer ícono visual basado en el tipo de archivo
const getFileIcon = (tipo) => {
  switch(tipo) {
    case 'pdf': return <FileText className="w-7 h-7 text-red-500" />;
    case 'sql': return <Database className="w-7 h-7 text-purple-500" />;
    case 'css': return <FileCode className="w-7 h-7 text-blue-500" />;
    case 'rar': 
    case 'zip': return <Archive className="w-7 h-7 text-amber-500" />;
    case 'img': 
    case 'png':
    case 'jpg': return <ImagePlus className="w-7 h-7 text-green-500" />;
    case 'cad':
    case 'dwg': return <Layers className="w-7 h-7 text-indigo-500" />;
    case '3d':
    case 'obj': return <Package className="w-7 h-7 text-orange-500" />;
    default: return <File className="w-7 h-7 text-gray-500" />;
  }
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  
  // Buscar el proyecto por slug
  const project = mockProjects.find(p => p.slug === slug);

  // Manejador para abrir el lightbox y meter un estado en el historial
  const openLightbox = (index) => {
    setActiveImageIndex(index);
    window.history.pushState({ lightbox: true }, "");
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  useEffect(() => {
    const handlePopState = (e) => {
      // Si el lightbox estaba abierto, lo cerramos al dar "atrás"
      setActiveImageIndex(null);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Bloquear scroll cuando el lightbox esté abierto
    if (activeImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = 'unset';
    };
  }, [activeImageIndex]);

  const nextImage = (e) => {
    e.stopPropagation();
    if (!project.galeria) return;
    setActiveImageIndex((prev) => (prev + 1) % project.galeria.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!project.galeria) return;
    setActiveImageIndex((prev) => (prev - 1 + project.galeria.length) % project.galeria.length);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Proyecto no encontrado</h1>
        <Link to="/repositorios" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
          Volver a repositorios
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 animate-in fade-in duration-500">
      
      {/* Botón Volver & Header Visual */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-6 md:pt-10 pb-12 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/repositorios" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:underline mb-8 transition-all hover:-translate-x-1">
            <ArrowLeft className="w-5 h-5" /> Volver a repositorios
          </Link>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            {project.titulo}
          </h1>

          {/* Meta Tags (Píldoras) */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-4 h-4" /> {project.carrera}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Calendar className="w-4 h-4" /> {project.semestre}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Clock className="w-4 h-4" /> Año {project.ano_publicacion}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <MapPin className="w-4 h-4" /> {project.sede}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <FileText className="w-4 h-4" /> {project.tipo}
            </span>
          </div>
          
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto md:px-6 lg:px-8 mt-8">
        
        {/* En móvil: ocupa todo el ancho, en PC: contenedor con bordes */}
        <div className="bg-white dark:bg-gray-900 md:rounded-3xl shadow-sm border-y md:border border-gray-200 dark:border-gray-800 px-4 py-8 md:p-10">
          
          {/* Metadata Grid (The 4 blocks + Optional Link) */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              
              {/* Box 1: Autores */}
              <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">Autor(es)</h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {project.autores.join(" • ")}
                  </p>
                </div>
              </div>

              {/* Box 2: Profesor */}
              <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">Profesor / Tutor</h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {project.profesor}
                  </p>
                </div>
              </div>

              {/* Box 3: Fecha exacta */}
              <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">Fecha de Publicación</h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {project.fecha_publicacion}
                  </p>
                </div>
              </div>

              {/* Box 4: Línea de Investigación */}
              <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">Línea de Investigación</h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {project.linea_investigacion}
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Link Button */}
            {project.enlace_online && (
              <div className="mt-8 flex justify-center md:justify-start">
                <a href={project.enlace_online} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md group w-full md:w-auto justify-center">
                  <Globe className="w-5 h-5 group-hover:animate-pulse" /> Ver Proyecto en Línea
                </a>
              </div>
            )}
          </div>

          <hr className="border-gray-100 dark:border-gray-800 my-10" />

          {/* Description Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
               Descripción del Proyecto
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-[17px] leading-relaxed text-justify md:text-left">
              {project.descripcion}
            </p>
          </div>

          {/* Gallery Section */}
          {project.galeria && project.galeria.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Galería de Imágenes
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                Visualización de recursos multimedia, diagramas, planos y capturas subidas por el autor. Aplicamos límites prudenciales de peso para optimizar la plataforma.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.galeria.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => openLightbox(i)}
                    className="aspect-video rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-zoom-in group bg-gray-50 dark:bg-gray-800 transition-all hover:shadow-xl hover:border-primary-500/30"
                  >
                    <img src={img} alt={`Galería ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Section */}
          <div className="mb-12">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary-500" /> Palabras Clave
             </h3>
             <div className="flex flex-wrap gap-2">
                {project.palabras_clave.map((kw, i) => (
                  <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-default">
                    {kw}
                  </span>
                ))}
             </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-800 my-10" />

          {/* Project Files Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Download className="w-6 h-6 text-primary-500" /> Archivos del Proyecto
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {project.archivos.map((file, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 hover:bg-white dark:hover:bg-gray-800 transition-colors gap-3">
                    
                    {/* Archivo Izquierda */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="shrink-0 p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        {getFileIcon(file.tipo)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate tracking-tight">
                          {file.nombre}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            .{file.tipo}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            {file.peso}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón Descarga */}
                    <button className="bg-white dark:bg-gray-950 hover:bg-primary-50 text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-700 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap self-end sm:self-center">
                      Descargar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Global Zip Button */}
            <div className="flex justify-center md:justify-start">
               <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-full md:w-auto justify-center group">
                 <Archive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 Descargar Proyecto Completo (.ZIP)
               </button>
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox Modal (Tipo Instagram) */}
      {activeImageIndex !== null && project.galeria && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Botón Cerrar */}
          <button 
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-[110]"
            onClick={closeLightbox}
          >
            <X className="w-10 h-10" />
          </button>

          {/* Navegación Anterior */}
          {project.galeria.length > 1 && (
            <button 
              className="absolute left-4 md:left-10 p-4 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full z-[110]"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Imagen Principal */}
          <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center select-none" onClick={(e) => e.stopPropagation()}>
            <img 
              src={project.galeria[activeImageIndex]} 
              alt="Visualización a detalle" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            />
            
            {/* Contador */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm font-bold tracking-widest border border-white/10">
              {activeImageIndex + 1} / {project.galeria.length}
            </div>
          </div>

          {/* Navegación Siguiente */}
          {project.galeria.length > 1 && (
            <button 
              className="absolute right-4 md:right-10 p-4 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full z-[110]"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
