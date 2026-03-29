import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Calendar, GraduationCap, MapPin, Tag, Plus, Loader2, Link as LinkIcon, User, BookOpen, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    career: '',
    semester: '',
    project_type: '',
    subject: '',
    date_published: new Date().toISOString().split('T')[0],
    location: '',
    keywords: '',
    description: '',
    professor_name: '',
    external_link: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const careers = [
    "Arquitectura", "Ing. Civil", "Ing. Eléctrica", "Ing. Electrónica", 
    "Ing. Industrial", "Ing. Mecánica", "Ing. de Sistemas", "Ing. Diseño Industrial", 
    "Ing. Telecom", "Ing. Química", "Ing. de Petróleo", "Ing. Agronómica"
  ];

  const projectTypes = [
    "Trabajo de Grado", "Proyecto de Investigación", "Pasantías", 
    "Servicio Comunitario", "Proyecto de Materia"
  ];

  const locations = [
    "Sede Barcelona", "Extensión Maturín", "Extensión Puerto Ordaz", 
    "Extensión San Cristóbal", "Sede Valencia", "Extensión Porlamar", 
    "Extensión Cabimas", "Sede Maracaibo", "Extensión Mérida", "Extensión Caracas"
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Utilidad: ejecutar una promesa con timeout máximo
  const withTimeout = (promise, ms, label) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout: "${label}" tardó más de ${ms/1000} segundos. Revisa tu conexión o intenta con un archivo más pequeño.`)), ms)
      )
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para subir un proyecto");

    setLoading(true);
    console.log("📤 Iniciando subida de proyecto...");

    try {
      // PASO 1: Intentar subir archivos a Supabase Storage
      const uploadedFilesMetadata = [];
      let storageWarning = false;
      
      if (files.length > 0) {
        for (const file of files) {
          console.log(`📁 Subiendo archivo: ${file.name} (${(file.size/1024).toFixed(1)} KB)...`);
          
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${Date.now()}_${fileName}`;

          try {
            const { error: uploadError } = await withTimeout(
              supabase.storage.from('project-files').upload(filePath, file),
              60000, // 60 segundos máximo por archivo
              `Subida de ${file.name}`
            );

            if (uploadError) {
              console.error("❌ Error de Storage:", uploadError);
              storageWarning = true;
              break; // No seguir intentando más archivos
            }

            const { data: { publicUrl } } = supabase.storage
              .from('project-files')
              .getPublicUrl(filePath);

            console.log(`✅ Archivo subido: ${file.name}`);
            uploadedFilesMetadata.push({
              name: file.name,
              url: publicUrl,
              size: file.size,
              type: file.type
            });
          } catch (fileError) {
            console.error(`⚠️ No se pudo subir ${file.name}:`, fileError.message);
            storageWarning = true;
            break;
          }
        }
      }

      // PASO 2: Guardar el proyecto en la base de datos (CON o SIN archivos)
      console.log("💾 Guardando datos del proyecto en la base de datos...");
      
      const projectData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        career: formData.career,
        semester: parseInt(formData.semester),
        project_type: formData.project_type,
        date_published: formData.date_published,
        location: formData.location,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        professor_name: formData.professor_name || null,
        external_link: formData.external_link || null,
        file_urls: uploadedFilesMetadata,
        status: 'pending'
      };

      // Solo añadir subject si tiene valor
      if (formData.subject) {
        projectData.subject = formData.subject;
      }

      console.log("📋 Datos a insertar:", JSON.stringify(projectData, null, 2));

      const { data: insertedData, error: dbError } = await withTimeout(
        supabase.from('projects').insert([projectData]).select(),
        15000,
        "Guardar proyecto"
      );

      if (dbError) {
        console.error("❌ Error de Base de Datos:", dbError);
        throw new Error(`Error al guardar el proyecto: ${dbError.message}`);
      }

      console.log("✅ Proyecto guardado correctamente:", insertedData);
      
      if (storageWarning) {
        alert("⚠️ El proyecto se guardó correctamente, pero los archivos NO se pudieron subir.\n\nDebes crear el bucket 'project-files' manualmente en:\nSupabase → Storage → New Bucket → Nombre: project-files → Marcar 'Public bucket' → Create.");
      } else {
        alert("¡Proyecto enviado con éxito! Un administrador lo revisará pronto.");
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("🔴 Error completo:", error);
      alert(error.message || "Ocurrió un error inesperado al subir el proyecto.");
    } finally {
      setLoading(false);
      console.log("🏁 Proceso de subida terminado.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-950 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-gray-800">
        
        {/* Header */}
        <div className="px-8 py-6 bg-primary-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Subir Nuevo Proyecto</h2>
              <p className="text-primary-100 text-xs">Completa los detalles académicos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Grid 2 Columnas - Orden Z */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              
              {/* Fila 1 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary-500" /> Título del Proyecto *
                </label>
                <input 
                  type="text" required placeholder="Ej: Sistema de Autopago..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-primary-500" /> Carrera *
                </label>
                <div className="relative">
                  <select 
                    required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none pr-12"
                    value={formData.career} onChange={e => setFormData({...formData, career: e.target.value})}
                  >
                    <option value="">Selecciona una carrera</option>
                    {careers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none opacity-70" />
                </div>
              </div>

              {/* Fila 2 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-primary-500" /> Semestre *
                </label>
                <div className="relative">
                  <select 
                    required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none pr-12"
                    value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}
                  >
                    <option value="">Selecciona semestre</option>
                    {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1}° Semestre</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none opacity-70" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary-500" /> Tipo de Proyecto *
                </label>
                <div className="relative">
                  <select 
                    required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none pr-12"
                    value={formData.project_type} onChange={e => setFormData({...formData, project_type: e.target.value})}
                  >
                    <option value="">Selecciona tipo</option>
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none opacity-70" />
                </div>
              </div>

              {/* Fila 3 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" /> Nombre de Materia/Línea de investigación *
                </label>
                <input 
                  type="text" required placeholder="Ej: Base de Datos, Diseño Arquitectónico..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" /> Fecha de Publicación *
                </label>
                <input 
                  type="date" required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.date_published} onChange={e => setFormData({...formData, date_published: e.target.value})}
                />
              </div>

              {/* Fila 4 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" /> Sede / Extensión *
                </label>
                <div className="relative">
                  <select 
                    required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none pr-12"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">Selecciona sede</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none opacity-70" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-primary-500" /> Palabras Clave *
                </label>
                <input 
                  type="text" required placeholder="Ej: Python, Autocad, Automatización, Reingeniería"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})}
                />
              </div>

              {/* Fila 5 (Opcionales) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-primary-500" /> Link del proyecto (Opcional)
                </label>
                <input 
                  type="url" placeholder="https://..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.external_link} onChange={e => setFormData({...formData, external_link: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary-500" /> Profesor (Opcional)
                </label>
                <input 
                  type="text" placeholder="Nombre del docente"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.professor_name} onChange={e => setFormData({...formData, professor_name: e.target.value})}
                />
              </div>

            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary-500" /> Descripción detallada del Proyecto *
              </label>
              <textarea 
                required rows="4" placeholder="Describe los objetivos, metodología y resultados..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none text-gray-900 dark:text-white"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1">
                Archivos del Proyecto (PDF, Imágenes, CAD, ZIP...) *
              </label>
              <div 
                className="relative border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-12 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-all group cursor-pointer bg-gray-50/50 dark:bg-gray-900/30"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setFiles([...files, ...Array.from(e.dataTransfer.files)]);
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  id="file-upload" type="file" multiple className="hidden" 
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-3xl text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Arrastra y suelta aquí</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">O haz clic para seleccionar archivos desde tu dispositivo</p>
                  <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">Formatos soportados: PDF, ZIP, RAR, CAD, Imágenes, etc.</p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-primary-500 shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                      </div>
                      <button 
                        type="button" onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-8 flex gap-4">
              <button 
                type="button" onClick={onClose}
                className="flex-1 py-4 px-6 text-gray-500 dark:text-gray-400 font-bold bg-gray-100 dark:bg-gray-900 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" disabled={loading}
                className="flex-[2] py-4 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirmar y Subir Proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
