import React from 'react';
import { Search, Download, Eye, GitBranch, Book, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="animate-in fade-in duration-500">

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-900 pt-20 pb-24 border-b border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-50 dark:hidden blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50 dark:hidden blur-3xl opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Repositorio Digital <br />
              <span className="text-primary-600 dark:text-primary-500">Politécnico Santiago Mariño</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-10 leading-relaxed font-medium">
              Plataforma integral para la gestión y difusión de proyectos académicos
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/repositorios" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg text-center">
                Explorar Proyectos
              </Link>
              {user ? (
                <Link to="/repositorios" state={{ openUploadModal: true }} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-200 dark:border-primary-800 hover:border-primary-600 dark:hover:border-primary-500 rounded-xl font-semibold transition-all text-lg hover:bg-primary-50 dark:hover:bg-gray-700 text-center">
                  Subir Proyecto
                </Link>
              ) : (
                <Link to="/auth" state={{ isLogin: true }} className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-200 dark:border-primary-800 hover:border-primary-600 dark:hover:border-primary-500 rounded-xl font-semibold transition-all text-lg hover:bg-primary-50 dark:hover:bg-gray-700 text-center">
                  Subir Proyecto
                </Link>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-16 md:mt-24">

            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Exploración Fácil</h3>
              <p className="text-xs md:text-base text-gray-600 dark:text-gray-200 leading-relaxed md:font-medium">Encuentra proyectos por carrera, semestre, sede, tipo de proyecto y palabras clave.</p>
            </div>

            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Vista Detallada</h3>
              <p className="text-xs md:text-base text-gray-600 dark:text-gray-200 leading-relaxed md:font-medium">Cada proyecto tiene su propia página con descripción completa, archivos y metadatos.</p>
            </div>

            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Descarga Completa</h3>
              <p className="text-xs md:text-base text-gray-600 dark:text-gray-200 leading-relaxed md:font-medium">Accede a todos los archivos del proyecto en formato ZIP original.</p>
            </div>

            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <GitBranch className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Enlaces Externos</h3>
              <p className="text-xs md:text-base text-gray-600 dark:text-gray-200 leading-relaxed md:font-medium">Accede directamente a los repositorios en GitHub o enlaces externos.</p>
            </div>

          </div>

          {/* Info Blocks (¿Qué encontrarás? & ¿Por qué existe?) */}
          <div className="mt-20 md:mt-32 max-w-5xl mx-auto space-y-12">

            {/* Block 1: ¿Qué encontrarás aquí? */}
            <div className="bg-white dark:bg-gray-800 px-5 py-10 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 transition-all hover:shadow-md">
              <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <Info className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8 md:mb-10 text-center">
                  ¿Qué encontrarás aquí?
                </h3>
                <div className="space-y-3 text-base text-gray-600 dark:text-gray-200 leading-relaxed font-medium">
                  <p className="text-center md:text-left">
                    El Repositorio Digital PSM (Politecnico Santiago Mariño) es una plataforma diseñada especialmente para estudiantes, profesores e investigadores. Aquí podrás acceder a una extensa colección de proyectos académicos de todas las carreras y sedes de la universidad.
                  </p>
                  <p className="text-center md:text-left">
                    Nuestro objetivo es facilitar el intercambio de conocimiento entre los miembros de nuestra comunidad universitaria. Los proyectos incluyen trabajos de grado, proyectos de investigación, pasantías, servicios comunitarios y proyectos por materia.
                  </p>
                  <p className="text-center md:text-left">
                    Desde proyectos de ingeniería hasta diseños arquitectónicos, encontrarás una amplia variedad de trabajos que pueden servirte como referencia para tus propios proyectos.
                  </p>
                </div>
              </div>
            </div>

            {/* Block 2: ¿Por qué existe este repositorio? */}
            <div className="bg-white dark:bg-gray-800 px-5 py-10 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 transition-all hover:shadow-md">
              <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8 md:mb-10 text-center">
                  ¿Por qué existe este repositorio?
                </h3>
                <div className="space-y-3 text-base text-gray-600 dark:text-gray-200 leading-relaxed font-medium">
                  <p className="text-center md:text-left">
                    La Universidad Politecnico Santiago Mariño reconoce la necesidad de preservar y compartir el conocimiento generado por nuestros estudiantes y profesionales. Muchas veces, los trabajos excelentes de nuestros estudiantes se quedan guardados en un archivo personal, perdiendo su potencial de inspirar y ayudar a otros. Este repositorio surge para:
                  </p>
                  <ul className="space-y-3 mt-4 ml-0 font-semibold">
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary-500"></span>
                      <span>Preservar el trabajo académico de la comunidad universitaria</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary-500"></span>
                      <span>Facilitar la consulta y referencia de proyectos previos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary-500"></span>
                      <span>Inspirar a nuevos estudiantes con ejemplos de excelencia académica</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary-500"></span>
                      <span>Promover la colaboración entre diferentes carreras y sedes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-primary-500"></span>
                      <span>Crear un catálogo de referencia para futuros trabajos de investigación</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Careers Summary Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3 mb-4">
              <Book className="text-primary-500 w-8 h-8" /> Carreras Disponibles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-200">
              Proyectos de 12 carreras diferentes de ingeniería, arquitectura y disciplinas afines
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-4xl mx-auto">
            { [
              { id: "arquitectura", label: "Arquitectura" },
              { id: "civil", label: "Ing. Civil" },
              { id: "electrica", label: "Ing. Eléctrica" },
              { id: "electronica", label: "Ing. Electrónica" },
              { id: "industrial", label: "Ing. Industrial" },
              { id: "mantenimiento", label: "Ing. Mecánica" },
              { id: "sistemas", label: "Ing. de Sistemas" },
              { id: "diseno", label: "Ing. Diseño Industrial" },
              { id: "telecomunicaciones", label: "Ing. Telecom" },
              { id: "quimica", label: "Ing. Química" },
              { id: "petroleo", label: "Ing. de Petróleo" },
              { id: "agronomica", label: "Ing. Agronómica" }
            ].map((carrera, index) => (
              <Link
                key={index}
                to="/repositorios"
                state={{ carreraId: carrera.id }}
                className="whitespace-nowrap px-3 py-1.5 text-[12px] sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-all hover:-translate-y-1 block text-center"
              >
                {carrera.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
