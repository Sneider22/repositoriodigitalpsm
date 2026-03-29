import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

const InfoSection = () => {
  return (
    <section id="info" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Información Institucional
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Conoce los pilares fundamentales que guían el desarrollo de nuestros estudiantes y profesionales en nuestra casa de estudios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Misión */}
          <div className="flex flex-col items-center text-center bg-gray-50 dark:bg-gray-700/40 p-10 rounded-3xl shadow-sm hover:shadow-lg dark:hover:shadow-[0_10px_40px_-15px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-default">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Target className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Misión</h3>
            <p className="text-lg text-gray-600 dark:text-gray-100 leading-relaxed font-medium">
              Formar profesionales integrales, competentes y comprometidos con el desarrollo social, a través de programas académicos de excelencia que promuevan la investigación, la innovación y el emprendimiento.
            </p>
          </div>

          {/* Visión */}
          <div className="flex flex-col items-center text-center bg-gray-50 dark:bg-gray-700/40 p-10 rounded-3xl shadow-sm hover:shadow-lg dark:hover:shadow-[0_10px_40px_-15px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-default">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Eye className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Visión</h3>
            <p className="text-lg text-gray-600 dark:text-gray-100 leading-relaxed font-medium">
              Ser reconocida como una institución de educación superior líder en la formación de profesionales de calidad, con proyección nacional e internacional, que contribuya al desarrollo sostenible de la región.
            </p>
          </div>

          {/* Valores */}
          <div className="flex flex-col items-center text-center bg-gray-50 dark:bg-gray-700/40 p-10 rounded-3xl shadow-sm hover:shadow-lg dark:hover:shadow-[0_10px_40px_-15px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-default">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Valores</h3>
            <ul className="text-lg text-gray-600 dark:text-gray-100 space-y-4 font-medium flex flex-col items-center">
              <li className="flex items-center justify-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-sm"></span> Excelencia Académica</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-sm"></span> Integridad y Ética</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-sm"></span> Innovación y Creatividad</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-sm"></span> Compromiso Social</li>
              <li className="flex items-center justify-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-sm"></span> Respeto y Tolerancia</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
