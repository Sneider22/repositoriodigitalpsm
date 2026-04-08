import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileText, Calendar, GraduationCap, MapPin, Tag, Plus, Loader2, Link as LinkIcon, User, BookOpen, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-left"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="h-5 w-5 text-primary-500 shrink-0" />
          <span className={`truncate ${!value ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 text-primary-500 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="py-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id); setIsOpen(false); }}
                className={`w-full text-left px-5 py-3 text-sm transition-colors ${value === opt.id ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
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

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, status: '' });
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

  const [careers, setCareers] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔍 Modal Abierto: Cargando Carreras y Sedes...");
      try {
        const [cRes, lRes] = await Promise.all([
          supabase.from('career').select('career_id, name_career').order('name_career'),
          supabase.from('location').select('location_id, name_location').order('name_location')
        ]);
        
        if (cRes.error) console.error("❌ Error Supabase Carreras:", cRes.error.message);
        if (lRes.error) console.error("❌ Error Supabase Sedes:", lRes.error.message);

        if (cRes.data) {
          console.log(`✅ ${cRes.data.length} carreras recibidas.`);
          setCareers(cRes.data.map(c => ({ id: c.career_id, label: c.name_career })));
        }
        if (lRes.data) {
          console.log(`✅ ${lRes.data.length} sedes recibidas.`);
          setLocations(lRes.data.map(l => ({ id: l.location_id, label: l.name_location })));
        }
      } catch (err) {
        console.error("🔴 Error fatal en fetchData:", err.message);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const projectTypes = [
    { id: "grado", label: "Trabajo de Grado" },
    { id: "investigacion", label: "Proyecto de Investigación" },
    { id: "pasantia", label: "Pasantías" },
    { id: "comunitario", label: "Servicio Comunitario" },
    { id: "materia", label: "Proyecto de Materia" }
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para subir un proyecto");

    setLoading(true);
    setUploadProgress({ current: 0, total: files.length, status: 'Iniciando subida...' });
    console.log("📤 Iniciando subida de proyecto...");

    try {
      // Validar sesión antes de empezar
      if (!user) throw new Error("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");

      // VALIDACIÓN DE CAMPOS OBLIGATORIOS (Prevención de Error 23503)
      if (!formData.career || !formData.location || !formData.project_type || !formData.semester) {
        throw new Error("Por favor, selecciona una Carrera, una Sede, un Tipo de Proyecto y el Semestre. Todos son obligatorios.");
      }

      if (files.length === 0) {
        throw new Error("Debes subir al menos un archivo (PDF, Imagen, etc.) para tu proyecto.");
      }

      // PASO 1: Intentar subir archivos a Supabase Storage
      const uploadedFilesMetadata = [];
      let storageWarning = false;

      if (files.length > 0) {
        let count = 0;
        for (const file of files) {
          count++;
          setUploadProgress({ 
            current: count, 
            total: files.length, 
            status: `Subiendo: ${file.name.substring(0, 15)}... (${count}/${files.length})` 
          });
          
          console.log(`📁 Subiendo archivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);

          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `projects/${user.id}/${Date.now()}_${fileName}`;

          try {
            const { error: uploadError } = await supabase.storage
              .from('project-files')
              .upload(filePath, file);

            if (uploadError) {
              console.error("❌ Error de Storage:", uploadError);
              storageWarning = true;
              break; 
            }

            const { data: { publicUrl } } = supabase.storage
              .from('project-files')
              .getPublicUrl(filePath);

            console.log(`✅ Archivo subido: ${file.name}`);
            uploadedFilesMetadata.push({
              name: file.name,
              url: publicUrl,
              size: file.size,
              type: file.type || 'application/octet-stream' // Fallback para tipos vacíos en móvil
            });
          } catch (fileError) {
            console.error(`⚠️ No se pudo subir ${file.name}:`, fileError.message);
            storageWarning = true;
            break;
          }
        }
      }

      // PASO 2: Guardar el proyecto en la base de datos (CON o SIN archivos)
      setUploadProgress(prev => ({ ...prev, status: 'Guardando datos del proyecto...' }));
      console.log("💾 Guardando datos del proyecto en la base de datos...");

      const projectData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        career_id: Number(formData.career),
        semester: parseInt(formData.semester),
        project_type: formData.project_type,
        date_published: formData.date_published,
        location_id: Number(formData.location),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
        subject: formData.subject || 'Sin materia',
        professor_name: formData.professor_name || null,
        external_link: formData.external_link || null,
        file_urls: uploadedFilesMetadata,
        status: 'pending'
      };

      console.log("📋 Datos a insertar:", JSON.stringify(projectData, null, 2));

      // Tiempo de espera para DB: 45 segundos
      const { data: insertedData, error: dbError } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (dbError) {
        console.error("❌ Error Detallado de Base de Datos:", dbError);
        throw new Error(`Error de Base de Datos: ${dbError.message} (${dbError.code || 'sin código'})`);
      }

      console.log("✅ Proyecto guardado correctamente:", insertedData);
      setUploadProgress(prev => ({ ...prev, status: '¡Completado con éxito!' }));

      if (storageWarning) {
        alert("⚠️ El proyecto se guardó correctamente, pero algunos archivos NO se pudieron subir por inestabilidad en la conexión.");
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
      setUploadProgress({ current: 0, total: 0, status: '' });
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
                  value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-primary-500" /> Carrera *
                </label>
                <CustomDropdown 
                  icon={GraduationCap}
                  defaultLabel="Selecciona una carrera"
                  options={careers}
                  value={formData.career}
                  onChange={val => setFormData({ ...formData, career: val })}
                />
              </div>

              {/* Fila 2 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-primary-500" /> Semestre *
                </label>
                <CustomDropdown 
                  icon={Tag}
                  defaultLabel="Selecciona semestre"
                  options={[...Array(10)].map((_, i) => ({ id: i + 1, label: `${i + 1}° Semestre` }))}
                  value={formData.semester ? parseInt(formData.semester) : ''}
                  onChange={val => setFormData({ ...formData, semester: val })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary-500" /> Tipo de Proyecto *
                </label>
                <CustomDropdown 
                  icon={FileText}
                  defaultLabel="Selecciona tipo de proyecto"
                  options={projectTypes}
                  value={formData.project_type}
                  onChange={val => setFormData({ ...formData, project_type: val })}
                />
              </div>

              {/* Fila 3 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" /> Nombre de Materia/Línea de investigación *
                </label>
                <input
                  type="text" required placeholder="Ej: Base de Datos, Diseño Arquitectónico..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" /> Fecha de Publicación *
                </label>
                <input
                  type="date" required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.date_published} onChange={e => setFormData({ ...formData, date_published: e.target.value })}
                />
              </div>

              {/* Fila 4 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" /> Sede / Extensión *
                </label>
                <CustomDropdown 
                  icon={MapPin}
                  defaultLabel="Selecciona sede"
                  options={locations}
                  value={formData.location}
                  onChange={val => setFormData({ ...formData, location: val })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-primary-500" /> Palabras Clave *
                </label>
                <input
                  type="text" required placeholder="Ej: Python, Autocad, Automatización, Reingeniería"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })}
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
                  value={formData.external_link} onChange={e => setFormData({ ...formData, external_link: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary-500" /> Profesor (Opcional)
                </label>
                <input
                  type="text" placeholder="Nombre del docente"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-gray-900 dark:text-white"
                  value={formData.professor_name} onChange={e => setFormData({ ...formData, professor_name: e.target.value })}
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
                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Subiendo...</span>
                    </div>
                    {uploadProgress.total > 0 && (
                      <span className="text-[10px] font-normal opacity-80 mt-1">
                        {uploadProgress.status}
                      </span>
                    )}
                  </div>
                ) : 'Confirmar y Subir Proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
