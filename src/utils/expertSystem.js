/**
 * Motor de Inferencia Experto - Índice de Relevancia Académica (IRA)
 * 
 * Este módulo contiene la lógica matemática y heurística para jerarquizar
 * y recomendar proyectos académicos dentro del Repositorio Digital PSM.
 * 
 * Fórmula Principal (Weighted Sum Model):
 * IRA = (Wt * T) + (Wp * P) + (Wv * V) + (Ws * S) + (Wk * K)
 * 
 * Factores (max 100 puntos c/u):
 * - T: Rigor de la Jerarquía Académica
 * - P: Impacto Social / Popularidad
 * - V: Recencia y Vigencia
 * - S: Afinidad de Nivel (Semestre)
 * - K: Coincidencia Semántica (Palabras clave por carrera)
 */

// 1. Ponderación de Pesos (Ws)
// La suma total de los pesos es 1.0 (100%)
export const WEIGHTS = {
  T_RIGOR: 0.30,        // 30%
  P_IMPACT: 0.25,       // 25%
  V_RECENCY: 0.15,      // 15%
  S_AFFINITY: 0.15,     // 15%
  K_KEYWORDS: 0.15      // 15%
};

// 2. Diccionarios Dinámicos por Carrera para el factor de Coincidencia (K)
// Estas palabras representan tendencias, tecnologías o temas relevantes por especialidad para el Motor de Búsqueda.
export const CAREER_KEYWORDS = {
  // --- ARQUITECTURA Y DISEÑO ---
  arquitectura: [
    'BIM', 'sustentable', 'bioclimático', 'urbanismo', 'domótica', 'resiliencia', 'paisajismo',
    'interiorismo', 'modelado 3D', 'Smart Cities', 'vivienda social', 'patrimonio',
    'eficiencia energética', 'geometría paramétrica', 'urbanismo táctico', 'diseño', 'Twinmotion', 'rehabilitación', 'ecológico'
  ],
  diseno: [
    'UX/UI', 'prototipado', 'ergonomía', 'renderizado', 'funcionalidad', 'innovación',
    'materiales', 'CAD', 'estética', 'Design Thinking', 'branding', 'usabilidad',
    'manufactura aditiva', 'economía circular'
  ],

  // --- INGENIERÍAS ESTRUCTURALES Y PESADAS ---
  civil: [
    'sismoresistente', 'geotecnia', 'BIM', 'hidráulica', 'patología', 'pavimento', 'vialidad',
    'Smart Cities', 'concreto armado', 'estructuras metálicas', 'análisis estructural',
    'infraestructura vial', 'mecánica de suelos', 'drenaje urbano', 'puentes'
  ],
  petroleo: [
    'yacimiento', 'perforación', 'recuperación terciaria', 'hidrocarburos', 'offshore',
    'refinación', 'gas', 'sísmica', 'petrofísica', 'explotación', 'caracterización',
    'pozos', 'estimulación', 'transporte de fluidos'
  ],
  quimica: [
    'petroquímica', 'catalizadores', 'biotecnología', 'reactores', 'procesos', 'termodinámica',
    'polímeros', 'separación', 'nanotecnología', 'biocombustibles', 'tratamiento de aguas',
    'destilación', 'cinética'
  ],

  // --- TECNOLOGÍA Y ELECTRICIDAD ---
  sistemas: [
    'IA', 'Machine Learning', 'nube', 'cloud', 'ciberseguridad', 'Fullstack', 'Blockchain',
    'DevOps', 'API', 'Big Data', 'React', 'algoritmo', 'arquitectura de software',
    'ciencia de datos', 'deep learning', 'microservicios', 'QA testing', 'QA testing', 'base de datos', 'dashboard'
  ],
  electrica: [
    'fotovoltaico', 'renovable', 'microredes', 'potencia', 'transformador', 'Smart Grid',
    'alta tensión', 'eficiencia energética', 'protecciones eléctricas', 'subestaciones',
    'calidad de energía', 'sistemas de puesta a tierra'
  ],
  electronica: [
    'IoT', 'sistemas embebidos', 'PLC', 'robótica', 'telemetría', 'FPGA', 'sensores',
    'automatización', 'Edge Computing', 'microcontroladores', 'procesamiento de señales',
    'instrumentación', 'control industrial'
  ],
  telecomunicaciones: [
    '5G', 'fibra óptica', 'protocolos', 'señales', 'redes inalámbricas', 'antenas', 'VoIP',
    'enrutamiento', 'microondas', 'satelital', 'redes GPON', 'seguridad de red', 'SDN'
  ],

  // --- GESTIÓN Y PROCESOS ---
  industrial: [
    'Industria 4.0', 'optimización', 'Lean Manufacturing', 'logística', 'calidad', 'Six Sigma',
    'procesos', 'seguridad industrial', 'cadena de suministro', 'producción', 'investigación de operaciones',
    'gestión de proyectos', 'KPI', 'simulación de procesos'
  ],
  mantenimiento: [
    'confiabilidad', 'predictivo', 'vibraciones', 'tribología', 'RCM', 'termodinámica', 'motores',
    'gestión de activos', 'TPM', 'mantenimiento centrado en confiabilidad', 'análisis de fallas',
    'lubricación industrial', 'bombas centrífugas'
  ],
  agronomica: [
    'agroecología', 'hidroponía', 'riego', 'cultivos', 'biotecnología', 'suelos', 'invernadero',
    'agrotéxicos', 'sustentabilidad', 'seguridad alimentaria', 'maquinaria agrícola',
    'control biológico', 'desarrollo rural'
  ]
};

/**
 * A. Factor T (Tipo): Jerarquía Académica (Rigor)
 * Asigna un puntaje basado en la profundidad investigativa del proyecto/documento.
 */
function calculateRigor(type = '') {
  const normalizedType = type.trim();

  const typePoints = {
    'Trabajo de Grado': 100,
    'Proyecto de Investigación': 90,
    'Asignación Académica': 80,
    'Servicio Comunitario': 75,
    'Pasantias': 75,
    'Pasantías': 75,   // Tal como aparece en el selector de la imagen
    'Pasantia': 75,
    'Pasantía': 75
  };

  // Retorna el puntaje del mapeo directo, si no existe o es desconocido, asignamos una base de 50 puntos
  return typePoints[normalizedType] || 50;
}

/**
 * B. Factor P (Popularidad): Impacto de la Comunidad (Heurística)
 * Usa una mini-fórmula que da mayor prioridad (x3) a las descargas sobre las simples vistas.
 * Se normaliza para tener un Techo (Cap) de 100 puntos y evitar que desequilibre el modelo.
 */
function calculatePopularity(downloads = 0, views = 0) {
  // Variables seguras para cuando los proyectos son mockups sin dichos campos
  const dl = Number(downloads) || 0;
  const vw = Number(views) || 0;

  const impactoRaw = (dl * 3) + vw;

  // Normalización COMPENSADA: 
  // Para evitar que proyectos nuevos o mockups (0 vistas) pierdan el 25% completo de su nota, 
  // establecemos una "calificación base" de 50 puntos. Las interacciones suman sobre esa base.
  const points = 50 + ((impactoRaw / 300) * 50);

  return Math.min(100, points);
}

/**
 * C. Factor V (Recencia/Vigencia): El Factor Tiempo
 * Resta 5 puntos por cada año de antigüedad. El conocimiento más fresco retiene más valor.
 */
function calculateRecency(year) {
  const currentYear = new Date().getFullYear();
  // Validación: si no existe el año por error de data, evaluamos como el año actual
  const projectYear = Number(year) || currentYear;

  const antiguedad = Math.max(0, currentYear - projectYear);

  // V = max(0, 100 - (Antigüedad * 5))
  return Math.max(0, 100 - (antiguedad * 5));
}

/**
 * D. Factor S (Semestre): Afinidad de Nivel
 * Asigna puntajes directamente equivalentes a la madurez académica del semestre en curso.
 */
function calculateAffinity(semester) {
  const s = Number(semester) || 1; // Fallback al semestre 1

  if (s >= 9) return 100; // 9°, 10°
  if (s >= 6) return 85;  // 6°, 7°, 8°
  if (s >= 3) return 70;  // 3°, 4°, 5°
  return 55;              // 1°, 2°
}

/**
 * E. Factor K (Keywords): Coincidencia Semántica Multidisciplinaria (Inteligencia)
 * Busca coincidencias de texto en el título o resumen basándose en las tendencias de la carrera.
 * Otorga +20 puntos de bono por cada palabra clave encontrada.
 */
function calculateKeywordsMatch(title = "", summary = "", career = "") {
  const textToAnalyze = `${title} ${summary}`.toLowerCase();

  // Garantizar que career es un string seguro
  const safeCareer = String(career || "").toLowerCase();

  // Buscar en las llaves del diccionario si alguna coincide
  let keywords = [];
  for (const key in CAREER_KEYWORDS) {
    if (safeCareer.includes(key) || key.includes(safeCareer)) {
      keywords = CAREER_KEYWORDS[key];
      break;
    }
  }

  let matchCount = 0;
  keywords.forEach(word => {
    // Busca si la tendencia existe textualmente dentro del abstract o el título
    if (textToAnalyze.includes(word.toLowerCase())) {
      matchCount++;
    }
  });

  // Detector de Esfuerzo Mínimo (Anti-Spam)
  // Si sumando el título y la descripción hay menos de 30 caracteres, es muy probable
  // que sea basura o proyectos de prueba ("Ooo", "asd"). Le quitamos el baseline regalado.
  if (textToAnalyze.length < 30) {
    return matchCount * 25; // 0 baseline de ayuda
  }

  // Para no penalizar proyectos cuyo resumen es válido pero le faltan palabras, 
  // damos una base de 50 puntos.
  // Cada coincidencia aporta 25 puntos adicionales (con 2 matches ya llega a 100).
  const bonusSuma = 50 + (matchCount * 25);
  return Math.min(100, bonusSuma);
}

/**
 * Ecuación Maestra: Calcula el Índice de Relevancia Académica (IRA)
 * utilizando el Weighted Sum Model consolidando la data heurística cualitativa y cuantitativa.
 * 
 * @param {Object} projectData Data JSON del proyecto (Supabase o Mockup)
 * @param {string} projectData.type Tipo documental
 * @param {number} projectData.downloads Número de descargas
 * @param {number} projectData.views Número de visualizaciones
 * @param {number} projectData.year Año del proyecto
 * @param {number|string} projectData.semester Semestre del responsable (1 a 10)
 * @param {string} projectData.career ID de la escuela/carrera
 * @param {string} projectData.title Título de investigación
 * @param {string} projectData.summary Resumen técnico
 * @param {Object} [userData=null] Perfil del usuario (Futuras expansiones para match usuario-proyecto)
 * 
 * @returns {number} Calificación Entera del 0 al 100 (Porcentaje Score)
 */
export function calculateIRA(projectData, userData = null) {
  // Manejo de seguridad en caso de recibir objetos nulos
  if (!projectData) return 0;

  const {
    type = '',
    downloads = 0,
    views = 0,
    year = new Date().getFullYear(),
    semester = 1,
    career = '',
    title = '',
    summary = ''
  } = projectData;

  // Transformación cualitativa y cuantitativa a puntos normalizados
  const T = calculateRigor(type);
  const P = calculatePopularity(downloads, views);
  const V = calculateRecency(year);
  const S = calculateAffinity(semester);
  const K = calculateKeywordsMatch(title, summary, career);

  // Ecuación Sumativa Final
  let rawIRA =
    (WEIGHTS.T_RIGOR * T) +
    (WEIGHTS.P_IMPACT * P) +
    (WEIGHTS.V_RECENCY * V) +
    (WEIGHTS.S_AFFINITY * S) +
    (WEIGHTS.K_KEYWORDS * K);

  // -------------------------------------------------------------
  // HEURÍSTICA DE CASTIGO ANTI-SPAM (Low-Effort Penalty)
  // Si el título es muy corto o el resumen no tiene al menos 50 letras,
  // el proyecto recibe un castigo contundente del -30% sobre su nota final.
  if (title.trim().length <= 10 || summary.trim().length < 50) {
    rawIRA -= 30; // Castigo directo al IRA final
  }
  // -------------------------------------------------------------

  // Acotamos para asegurar integridad matemática y retornamos entero
  return Math.min(100, Math.max(0, Math.round(rawIRA)));
}

/* =========================================================================
 * 📋 FICHA TÉCNICA - MOTOR DE INFERENCIA EXPERTO
 * =========================================================================
 * 
 * ALGORITMO: Weighted Sum Model (Modelo de Suma Ponderada)
 * PROPÓSITO: Jerarquización algorítmica de proyectos del Repositorio Digital PSM.
 * 
 * 1. FÓRMULA MAESTRA:
 *    IRA = (Wt*T) + (Wp*P) + (Wv*V) + (Ws*S) + (Wk*K)
 * 
 * 2. VARIABLES Y PONDERACIONES (Ws):
 *    - T (Rigor):     30% -> Basado en el tipo de trabajo documental.
 *    - P (Impacto):   25% -> Heurística de descargas (x3) + vistas. (Baseline: 50 pts)
 *    - V (Recencia):  15% -> Castigo de 5% por año de antigüedad.
 *    - S (Afinidad):  15% -> Madurez académica (Semestre).
 *    - K (Coinciden.):15% -> Coincidencias "Fuzzy" con dict. por carrera. (Baseline: 50 pts)
 * 
 * 3. DESGLOSE DE PUNTOS BASE:
 *    Rigor        -> Tesis: 100 | Proyecto: 90 | Asignación: 80 | Com./Pas.: 75
 *    Popularidad  -> Base: 50 | 300 Interacciones Raw: 100
 *    Afinidad     -> 9-10°: 100 | 6-8°: 85 | 3-5°: 70 | 1-2°: 55
 *    Keywords     -> Base: 50 | Match: +25
 *    Antigüedad   -> -5 Puntos por año desde la publicación.
 * 
 * ESCALA FINAL: 0% - 100% (Normalizado e Integro)
 * ========================================================================= */
