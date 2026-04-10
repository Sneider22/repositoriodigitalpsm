import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, BookOpen, FileText, User, 
  Tag, Download, Globe, Database, FileCode, Archive, ImagePlus,
  Layers, ChevronRight, File, Package, Clock, X, ChevronLeft, Loader2, Eye
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { mockProjects } from '../data/mockProjects';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

// Utilidad para extraer ícono visual basado en el tipo de archivo
const getFileIcon = (tipo) => {
  switch(tipo?.toLowerCase()) {
    case 'pdf': return <FileText className="w-7 h-7 text-red-500" />;
    case 'sql': return <Database className="w-7 h-7 text-purple-500" />;
    case 'css': return <FileCode className="w-7 h-7 text-blue-500" />;
    case 'rar': 
    case 'zip': return <Archive className="w-7 h-7 text-amber-500" />;
    case 'img': 
    case 'png':
    case 'jpg':
    case 'jpeg': return <ImagePlus className="w-7 h-7 text-green-500" />;
    case 'cad':
    case 'dwg': return <Layers className="w-7 h-7 text-indigo-500" />;
    case '3d':
    case 'obj': return <Package className="w-7 h-7 text-orange-500" />;
    default: return <File className="w-7 h-7 text-gray-500" />;
  }
};

const diccionarios = {
  carreras: { civil: "Ingeniería Civil", sistemas: "Ingeniería de Sistemas", mantenimiento: "Ing. de Mantenimiento Mecánico", arquitectura: "Arquitectura", electrica: "Ing. Eléctrica", electronica: "Ing. Electrónica", industrial: "Ing. Industrial", telecomunicaciones: "Ing. en Telecomunicaciones", quimica: "Ing. Química", petroleo: "Ing. de Petroleo", agronomica: "Ing. Agronómica", diseno: "Ing. en Diseño Industrial" },
  sedes: { barcelona: "Sede Barcelona", valencia: "Ext. Valencia", cabimas: "Ext. Cabimas", maracaibo: "Ext. Maracaibo", caracas: "Ext. Caracas", merida: "Ext. Mérida", sancristobal: "Ext. San Cristóbal", barinas: "Ext. Barinas", maracay: "Ext. Maracay", porlamar: "Ext. Porlamar", puertoordaz: "Ext. Puerto Ordaz", maturin: "Ext. Maturín", ciudadojeda: "Ext. Ciudad Ojeda" },
  tipos: { grado: "Trabajo de Grado", investigacion: "Proyecto de Investigación", pasantia: "Pasantías", comunitario: "Servicio Comunitario", materia: "Asignación Académica" }
};

// Genera slug legible igual que en Repository.jsx
const toSlug = (title) => {
  if (!title) return '';
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const ProjectDetail = () => {
  const { slug } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const viewTrackedRef = useRef(false);

  const handleDownloadAll = async () => {
    if (!project || !project.archivos || project.archivos.length === 0) {
      toast.info('No hay archivos disponibles', {
        description: 'Este proyecto no contiene archivos adjuntos.'
      });
      return;
    }

    const isMock = mockProjects.some(m => m.id === project.id);
    if (isMock) {
      toast.info('Modo Demostración', {
        description: 'Los proyectos de ejemplo (Mocks) no tienen archivos reales descargables.'
      });
      return;
    }

    const trackDownload = () => {
      if (!project || !project.id) return;
      const isMock = mockProjects.some(m => m.id === project.id);
      if (isMock) return;

      supabase.rpc('increment_download', { project_id_param: project.id }).then(({error}) => { if (error) console.error("Error RPC:", error); });
      setProject(prev => ({...prev, descargas: (prev.descargas || 0) + 1}));
    };

    const zipOrRar = project.archivos.find(f => f.tipo === 'zip' || f.tipo === 'rar');
    if (zipOrRar && zipOrRar.url) {
      toast.success('Iniciando descarga', {
        description: `Descargando el comprimido original: ${zipOrRar.nombre}`
      });
      window.open(zipOrRar.url, '_blank');
      trackDownload();
      return;
    }

    setDownloadingAll(true);
    toast.info('Preparando descarga en lote', {
      description: 'Generando archivo ZIP, por favor espera...'
    });

    try {
      const zip = new JSZip();
      
      // Sanitizar título para ser usado como carpeta
      const safeTitle = project.titulo ? project.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'proyecto';
      const folderName = safeTitle;
      const projectFolder = zip.folder(folderName);
      
      let filesAdded = 0;

      for (const file of project.archivos) {
        if (!file.url) continue;
        
        try {
          const response = await fetch(file.url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          projectFolder.file(file.nombre, blob);
          filesAdded++;
        } catch (error) {
          console.error(`Error downloading file ${file.nombre}:`, error);
          toast.warning('Advertencia de descarga', {
             description: `No se pudo empaquetar ${file.nombre}. El archivo podría tener restricciones de origen (CORS) o no existir.`
          });
        }
      }

      if (filesAdded === 0) {
        throw new Error("No pudimos anexar ningún archivo al ZIP.");
      }

      toast.info('Comprimiendo', {
        description: 'Creando archivo .ZIP final...'
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${folderName}.zip`);
      
      trackDownload();
      
      toast.success('Descarga completada', {
        description: `Proyecto guardado como ${folderName}.zip`
      });

    } catch (error) {
      console.error('Error generating zip:', error);
      toast.error('Error al empaquetar', {
        description: error.message || 'Intenta iniciar la descarga de los archivos uno por uno.'
      });
    } finally {
      setDownloadingAll(false);
    }
  };

  // Buscar el proyecto por ID/slug a la base de datos o en los mocks locales
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);

      // 1. Primero buscar en mockProjects (por si el slug coincide con uno de los ejemplos)
      const localMock = mockProjects.find((p) => p.slug === slug);
      if (localMock) {
        setProject(localMock);
        setLoading(false);
        return; // Salimos temprano y no consultamos Supabase
      }

      // 2. Si no está en los locales, buscar en Supabase
      // Si el param es un UUID directo, buscar por id; si es un slug amigable, buscar por título
      try {
        const processProjectData = async (data) => {
          const isImage = (fmt) => ['png','jpg','jpeg','webp','gif','svg'].includes(fmt?.toLowerCase());
          const parseExt = (name) => name?.split('.').pop()?.toLowerCase();
          
          let galeria = [];
          let archivos = [];
          
          if (data.file_urls) {
            data.file_urls.forEach(file => {
               const ext = parseExt(file.name);
               if (isImage(ext)) {
                 galeria.push(file.url);
               } else {
                 archivos.push({
                   nombre: file.name,
                   tipo: ext || 'doc',
                   peso: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                   url: file.url
                 });
               }
            });
          }

          let currentViews = data.views_count || 0;
          
          if (!viewTrackedRef.current) {
            viewTrackedRef.current = true;
            currentViews += 1;
            supabase.rpc('increment_view', { project_id_param: data.id }).then(({error}) => { if (error) console.error("Error RPC:", error); });
          }

          setProject({
            id: data.id,
            slug: toSlug(data.title) || data.id,
            titulo: data.title,
            descripcion: data.description,
            carrera: data.career?.name_career || 'Carrera no especificada',
            semestre: `${data.semester}° Semestre`,
            ano_publicacion: data.date_published ? new Date(data.date_published).getFullYear().toString() : 'Reciente',
            sede: data.location?.name_location || 'Sede no especificada',
            tipo: diccionarios.tipos[data.project_type] || data.project_type,
            autores: [data.profiles?.full_name || 'Autor Desconocido'],
            profesor: data.professor_name || 'No especificado',
            fecha_publicacion: data.date_published || 'Reciente',
            linea_investigacion: data.subject || 'Línea de Vida Académica',
            palabras_clave: data.keywords || [],
            galeria: galeria,
            archivos: archivos,
            enlace_online: data.external_link,
            vistas: currentViews,
            descargas: data.downloads_count || 0
          });
        };

        if (isUUID(slug)) {
          // Buscar directamente por UUID
          const { data, error } = await supabase
            .from('projects')
            .select(`*, career:career_id(name_career), location:location_id(name_location), profiles:user_id(full_name)`)
            .eq('id', slug)
            .single();
          if (error) throw error;
          if (data) await processProjectData(data);
        } else {
          // Buscar todos y filtrar por slug generado del título
          const { data: allData, error: allError } = await supabase
            .from('projects')
            .select(`*, career:career_id(name_career), location:location_id(name_location), profiles:user_id(full_name)`);
          if (allError) throw allError;
          const match = allData?.find(p => toSlug(p.title) === slug);
          if (!match) throw new Error('Proyecto no encontrado');
          await processProjectData(match);
        }
      } catch (err) {
        console.error("Error al obtener detalle del proyecto:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cargando proyecto...</h1>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Proyecto no encontrado o Pendiente de Aprobación</h1>
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
            
            {/* Stats Visibles */}
            {project.vistas !== undefined && (
              <div className="flex items-center gap-4 ml-auto text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary-500" /> {project.vistas}</span>
                <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-primary-500" /> {project.descargas}</span>
              </div>
            )}
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
                    className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm cursor-zoom-in group bg-gray-50 dark:bg-gray-800 transition-all hover:shadow-xl hover:border-primary-500/30"
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
                    {file.url ? (
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => {
                          const isMock = mockProjects.some(m => m.id === project.id);
                          if (!isMock) {
                            supabase.rpc('increment_download', { project_id_param: project.id }).then(({error}) => { if (error) console.error("Error RPC:", error); });
                            setProject(prev => ({...prev, descargas: (prev.descargas || 0) + 1}));
                          }
                        }}
                        className="bg-white dark:bg-gray-950 hover:bg-primary-50 text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-700 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap self-end sm:self-center"
                      >
                        Descargar
                      </a>
                    ) : (
                      <button className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-bold px-4 py-1.5 rounded-lg text-xs cursor-not-allowed whitespace-nowrap self-end sm:self-center">
                        No disponible
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Global Zip Button */}
            <div className="flex justify-center md:justify-start mt-6">
               <button 
                 onClick={handleDownloadAll}
                 disabled={downloadingAll}
                 className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-full md:w-auto justify-center group"
               >
                 {downloadingAll ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                 ) : (
                   <Archive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 )}
                 {downloadingAll ? 'Generando ZIP...' : 'Descargar Proyecto Completo (.ZIP)'}
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
          <div className="relative max-w-7xl w-full h-[85vh] flex items-center justify-center select-none" onClick={(e) => e.stopPropagation()}>
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
