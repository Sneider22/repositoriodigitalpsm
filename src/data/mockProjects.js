export const mockProjects = [
  {
    id: "mock-1",
    slug: "diseno-sistema-estructural-sismorresistente",
    titulo: "Diseño de un Sistema Estructural Sismorresistente para Edificios Multifamiliares",
    descripcion: "Análisis exhaustivo y diseño tridimensional de un sistema estructural en concreto armado capaz de resistir cargas sísmicas medias y altas en la zona oriental de Venezuela. Incorpora normativas COVENIN vigentes y modelado en software especializado.",
    carrera: "Ingeniería Civil", carrera_id: "civil",
    semestre: "10mo Semestre", semestre_id: "10",
    ano_publicacion: "2023",
    sede: "Extensión Porlamar", sede_id: "porlamar",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    autores: ["Carlos Mendoza", "Ana Ruiz"], autor: "Carlos Mendoza & Ana Ruiz",
    profesor: "Ing. Roberto Méndez",
    fecha_publicacion: "12 de Octubre, 2023",
    linea_investigacion: "Estructuras y Sismología",
    palabras_clave: ["Sismorresistente", "Concreto Armado", "Edificios", "COVENIN"],
    score: 98, vistas: 342, descargas: 125,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Memoria_Calculo.pdf", tipo: "pdf", peso: "8.5 MB" },
      { nombre: "Planos_Estructurales.dwg", tipo: "cad", peso: "22.1 MB" }
    ]
  },
  {
    id: "mock-2",
    slug: "prototipo-app-movil-inventarios-clinicos",
    titulo: "Prototipo de Aplicación Móvil para la Gestión de Inventarios Clínicos",
    descripcion: "Desarrollo de una app móvil progresiva usando React Native y Supabase para el control del almacén del Instituto de Salud local, logrando eficientizar tiempos en un 40%. La solución incluye escaneo de códigos de barras y alertas en tiempo real.",
    carrera: "Ingeniería de Sistemas", carrera_id: "sistemas",
    semestre: "8vo Semestre", semestre_id: "8",
    ano_publicacion: "2024",
    sede: "Sede Principal Barcelona", sede_id: "barcelona",
    tipo: "Proyecto de Materia", tipo_id: "materia",
    autores: ["Luis Fermín"], autor: "Luis Fermín",
    profesor: "MSc. Juan Pérez",
    fecha_publicacion: "05 de Marzo, 2024",
    linea_investigacion: "Desarrollo de Software e IA",
    palabras_clave: ["Mobile", "React Native", "Inventario", "Salud"],
    score: 92, vistas: 210, descargas: 45,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1551288049-bbbda536339a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Codigo_Fuente.zip", tipo: "zip", peso: "12.4 MB" },
      { nombre: "Manual_Usuario.pdf", tipo: "pdf", peso: "1.2 MB" }
    ]
  },
  {
    id: "mock-3",
    slug: "plan-mantenimiento-preventivo-bombas-industriales",
    titulo: "Plan Estandarizado de Mantenimiento Preventivo para Bombas Industriales",
    descripcion: "Propuesta de un manual operativo de mantenimiento mecánico predictivo y preventivo diseñado para turbinas y bombas centrífugas en la industria del gas y el petróleo. Incluye análisis de vibraciones y termografía.",
    carrera: "Ing. de Mantenimiento Mecánico", carrera_id: "mantenimiento",
    semestre: "9no Semestre", semestre_id: "9",
    ano_publicacion: "2023",
    sede: "Extensión Maracaibo", sede_id: "maracaibo",
    tipo: "Pasantías", tipo_id: "pasantia",
    autores: ["Miguel Rivas"], autor: "Miguel Rivas",
    profesor: "Ing. Carlos Govea",
    fecha_publicacion: "20 de Agosto, 2023",
    linea_investigacion: "Mantenimiento Industrial",
    palabras_clave: ["Mantenimiento", "Bombas", "Industria", "Petróleo"],
    score: 87, vistas: 156, descargas: 89,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Plan_Mantenimiento.pdf", tipo: "pdf", peso: "3.8 MB" }
    ]
  },
  {
    id: "mock-4",
    slug: "restauracion-modernizacion-arquitectonica-casco-historico",
    titulo: "Restauración y Modernización Arquitectónica del Casco Histórico",
    descripcion: "Proyecto urbanístico, paisajista y sociológico para restaurar los espacios públicos de la Plaza Central, incorporando jardines autosustentables e iluminación solar. Se enfoca en la preservación del patrimonio colonial.",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "10mo Semestre", semestre_id: "10",
    ano_publicacion: "2024",
    sede: "Extensión Caracas", sede_id: "caracas",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    autores: ["Elena Suárez"], autor: "Elena Suárez",
    profesor: "Arq. Mario Rossi",
    fecha_publicacion: "10 de Enero, 2024",
    linea_investigacion: "Urbanismo y Patrimonio",
    palabras_clave: ["Arquitectura", "Patrimonio", "Sustentable", "Urbanismo"],
    score: 85, vistas: 412, descargas: 210,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Propuesta_Urbana.pdf", tipo: "pdf", peso: "15.0 MB" },
      { nombre: "Modelado_3D.obj", tipo: "3d", peso: "85.0 MB" }
    ]
  },
  {
    id: "mock-5",
    slug: "diseno-complejo-turistico-ecologico-costero",
    titulo: "Diseño de un Complejo Turístico Ecológico Integrado al Entorno Costero",
    descripcion: "Propuesta arquitectónica de cabañas turísticas sustentables utilizando materiales endémicos y sistemas pasivos de climatización para minimizar la huella de carbono.",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "10mo Semestre", semestre_id: "10",
    ano_publicacion: "2023",
    sede: "Extensión Porlamar", sede_id: "porlamar",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    autores: ["Marcos Torres", "Lucía Peña"], autor: "Marcos Torres",
    profesor: "Arq. Hernán Cortés",
    fecha_publicacion: "15 de Noviembre, 2023",
    linea_investigacion: "Diseño Arquitectónico Sustentable",
    palabras_clave: ["Ecoturismo", "Climatización Pasiva", "Bambú", "Desarrollo Costero", "Bioclimática"],
    score: 95, vistas: 580, descargas: 231,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Memoria_Descriptiva.pdf", tipo: "pdf", peso: "4.2 MB" },
      { nombre: "Planos_Estructurales.dwg", tipo: "cad", peso: "15.8 MB" },
      { nombre: "Renders_Alta_Resolucion.rar", tipo: "rar", peso: "145.0 MB" },
      { nombre: "Base_De_Datos_Ambiental.sql", tipo: "sql", peso: "350 KB" }
    ]
  },
  {
    id: "mock-6",
    slug: "centro-cultural-biblioteca-publica-diseno-parametrico",
    titulo: "Centro Cultural y Biblioteca Pública con Diseño Paramétrico",
    descripcion: "Diseño de un recinto público enfocado en la difusión cultural, utilizando herramientas de diseño arquitectónico generativo para optimizar iluminación natural y acústica.",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "9no Semestre", semestre_id: "9",
    ano_publicacion: "2024",
    sede: "Extensión Mérida", sede_id: "merida",
    tipo: "Proyecto de Materia", tipo_id: "materia",
    autores: ["Valeria Guzmán"], autor: "Valeria Guzmán",
    profesor: "Arq. Luis Salas",
    fecha_publicacion: "22 de Febrero, 2024",
    linea_investigacion: "Arquitectura Biomimética",
    palabras_clave: ["Paramétrico", "Biblioteca", "Cultura", "Acústica"],
    score: 89, vistas: 320, descargas: 110,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Proyecto_Parametrico.pdf", tipo: "pdf", peso: "9.7 MB" }
    ]
  },
  {
    id: "mock-7",
    slug: "viviendas-interes-social-modulares-expandibles",
    titulo: "Viviendas de Interés Social Modulares y Expandibles",
    descripcion: "Alternativa habitacional de bajo costo diseñada bajo un esquema arquitectónico modular que permite crecimiento ordenado según las necesidades del grupo familiar.",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "10mo Semestre", semestre_id: "10",
    ano_publicacion: "2023",
    sede: "Extensión Valencia", sede_id: "valencia",
    tipo: "Trabajo de Grado", tipo_id: "grado",
    autores: ["Simón Andrade"], autor: "Simón Andrade",
    profesor: "Arq. Claudia Martínez",
    fecha_publicacion: "30 de Junio, 2023",
    linea_investigacion: "Vivienda Social",
    palabras_clave: ["Vivienda", "Modular", "Interés Social", "Costos"],
    score: 96, vistas: 890, descargas: 412,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Diseño_Modular.pdf", tipo: "pdf", peso: "5.5 MB" }
    ]
  },
  {
    id: "mock-8",
    slug: "intervencion-paisajismo-zonas-universitarias",
    titulo: "Intervención de Paisajismo en Zonas Universitarias Deterioradas",
    descripcion: "Recuperación de espacios verdes dentro del campus universitario promoviendo senderos bioclimáticos, áreas de estudio al aire libre y reforestación.",
    carrera: "Arquitectura", carrera_id: "arquitectura",
    semestre: "8vo Semestre", semestre_id: "8",
    ano_publicacion: "2024",
    sede: "Sede Principal Barcelona", sede_id: "barcelona",
    tipo: "Servicio Comunitario", tipo_id: "comunitario",
    autores: ["Ricardo Silva"], autor: "Ricardo Silva",
    profesor: "Ing. Beatriz Díaz",
    fecha_publicacion: "14 de Abril, 2024",
    linea_investigacion: "Paisajismo Urbano",
    palabras_clave: ["Paisajismo", "Universidad", "Ecológico", "Campus"],
    score: 82, vistas: 120, descargas: 35,
    status: "published",
    galeria: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    archivos: [
      { nombre: "Informe_Servicio.pdf", tipo: "pdf", peso: "2.8 MB" }
    ]
  }
];
