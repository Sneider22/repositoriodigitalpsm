import React from 'react';
import { GraduationCap, MapPin, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary-500" />
              <span className="text-lg font-bold text-white tracking-wide">
                Repositorio Universitario
              </span>
            </div>
            <p className="text-sm text-gray-300 max-w-sm text-center md:text-left">
              Plataforma para la gestión y difusión de proyectos académicos pertenecientes al PSM.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 cursor-default">
              <MapPin className="h-5 w-5 text-primary-500" />
              <span>Sedes a nivel nacional</span>
            </div>

            <div className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></div>

            <div className="flex items-center gap-2 cursor-default">
              <Code className="h-5 w-5 text-primary-500" />
              <span>Proyecto de Grado &copy; {new Date().getFullYear()}</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
