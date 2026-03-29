import React from 'react';
import { MapPin, BookOpen, FileText, User, ChevronRight, Award, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_40px_-15px_rgba(255,255,255,0.15)] hover:-translate-y-1.5 hover:border-primary-500/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      
      {/* Barra superior de inferencia (Brilla al pasar el ratón) */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/50">
          <FileText className="w-3.5 h-3.5" />
          {project.tipo}
        </span>
        
        {/* Badge del Motor de Inferencia */}
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1.5 rounded-lg text-xs font-extrabold shadow-sm border border-amber-100 dark:border-amber-800/50" title="Relevancia según Sistema Experto">
          <Award className="w-4 h-4 fill-amber-500/20" />
          {project.score}% Puntaje
        </div>
      </div>

      <Link to={`/repositorios/proyecto/${project.slug}`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors cursor-pointer">
          {project.titulo}
        </h3>
      </Link>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed">
        {project.descripcion}
      </p>

      <div className="space-y-3 mb-6 bg-gray-100 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-950 shadow-inner">
        <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-200 font-medium">
          <User className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="truncate">{project.autor}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
          <BookOpen className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="truncate">{project.carrera}</span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="shrink-0">{project.semestre} Semestre</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="truncate">{project.sede}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs font-semibold">
          <div className="flex items-center gap-1.5 hover:text-primary-500 transition-colors cursor-default"><Eye className="w-4 h-4"/> {project.vistas}</div>
          <div className="flex items-center gap-1.5 hover:text-primary-500 transition-colors cursor-default"><Download className="w-4 h-4"/> {project.descargas}</div>
        </div>
        <Link to={`/repositorios/proyecto/${project.slug}`} className="flex items-center gap-1 text-sm font-extrabold text-primary-600 dark:text-primary-400 group-hover:underline group-hover:translate-x-1 transition-transform">
          Ver Detalles <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default ProjectCard;
