<div align="center" style="margin-bottom: 20px;">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=008080&height=200&section=header&text=Repositorio%20Digital%20PSM&fontSize=50&fontColor=ffffff&animation=fadeIn" />

  <h1 align="center">🎓 Repositorio Digital PSM 🏢</h1>

  <p align="center">
    <strong>Plataforma inteligente y profesional diseñada para centralizar, preservar y difundir el conocimiento académico generado por la comunidad del <em>Politécnico Santiago Mariño</em>.</strong>
    <br />
    <em>Tesis de Grado - Ingeniería de Sistemas</em>
  </p>

  <p align="center">
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    </a>
        <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
      <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
    </a>
    <a href="https://supabase.com/">
      <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    </a>
    <a href="https://www.postgresql.org/">
      <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    </a>
  </p>
</div>

---

## 🚀 Visión General
Este sistema permite a los estudiantes registrar sus proyectos de grado, pasantías y trabajos de investigación en un entorno seguro y estético, facilitando la consulta mutua y elevando el estándar de excelencia universitaria.

## 🛠️ Stack Tecnológico
- **Frontend Core:** React 18 con Vite para un desarrollo ultra-rápido.
- **Estilizado Premium:** Tailwind CSS para una interfaz moderna, responsive y con soporte nativo de Modo Oscuro.
- **Iconografía:** Lucide React para una guía visual clara y minimalista.
- **Backend & Seguridad:** Supabase (PostgreSQL + Go/Rust Auth) para gestión de sesiones y almacenamiento de datos en tiempo real.
- **Routing:** React Router v6 para una navegación fluida entre secciones.

---

## 📐 Sistema Experto: El Índice de Relevancia Académica (IRA)

El núcleo funcional y la innovación principal de esta arquitectura es el **Motor de Inferencia Experto**. Este motor se encarga de calcular matemáticamente el *IRA*, un algoritmo que jerarquiza autónomamente los proyectos basándose en un Modelo de Suma Ponderada (*Weighted Sum Model*).

### La Fórmula Maestra
```math
IRA = (Wt \times T) + (Wp \times P) + (Wv \times V) + (Ws \times S) + (Wk \times K)
```

### Ponderación de Variables
Cada factor del proyecto es normalizado a una escala del 0 a 100 y multiplicado por su peso algorítmico asignado:

- 📊 **( T ) Rigor (30%):** Basado en la jerarquía documental.
- 📈 **( P ) Impacto (25%):** Heurística compensada basada en descargas (con alto peso) y visualizaciones.
- ⏳ **( V ) Recencia (15%):** Penalización estandarizada por años de antigüedad.
- 🎓 **( S ) Afinidad (15%):** Evaluando el nivel de madurez académica según el semestre del responsable.
- 🧠 **( K ) Coincidencia Semántica (15%):** Inteligencia basada en *Fuzzy Matching* sobre diccionarios técnicos especializados propios de cada carrera de ingeniería.

*(Incluye penalizaciones Heurísticas de "Low-Effort" / Anti-Spam para descripciones vacías o poco profesionales)*.

---

## ✨ Características Principales

### 1. Ecosistema de Autenticación Unificado
- Gestión de roles (Estudiante / Administrador).
- Perfiles de usuario reactivos en la barra de navegación.

### 2. Motor de Exploración Inteligente
- Ordenamiento y filtrado avanzado impulsado por el algoritmo **IRA**.
- Búsqueda filtrada por Carrera, Semestre, Sede y Tipo de Proyecto.
- Previsualización dinámica de tarjetas con metadatos y puntaje analítico incrustado.

### 3. Visualización Inmersiva
- Galería multimedia optimizada con sistema Lightbox (estilo Instagram).
- Sección de archivos compacta y enfocada en descargas directas.
- Adaptabilidad total: Centrado ergonómico en móviles y flujo de tarjetas en rejilla para desktop.

### 4. Moderación y Calidad 🛡️
- Panel donde el Administrador valida y audita cada entrega antes de publicarse en la red general.
- Clasificación visual e indicadores de advertencia impulsados por el motor de inferencia.

---

## 📸 Interfaz y Experiencia de Usuario (UI/UX)

<table align="center" width="100%" border="0" style="border: none;">
  <tr>
    <td width="50%" align="center">
      <b>1. Pantalla de Inicio y Dashboard</b><br/>
  <img src="public/screenshots/inicio.jpg" alt="Inicio" width="100%" style="border-radius: 15px; margin-top: 10px; margin-bottom: 20px; box-shadow: 0px 4px 15px rgba(0,0,0,0.3);" />
    </td>
    <td width="50%" align="center">
      <b>2. Motor Experto en Acción</b><br/>
      <img src="public/screenshots/repositorios.jpg" alt="Repositorios y Scoring" width="100%" style="border-radius: 10px; margin-top: 10px;" />
    </td>
  </tr>
</table>

<table align="center" width="100%" border="0" style="border: none;">
  <tr>
    <td width="50%" align="center">
      <b>3. Ficha Técnica General</b><br/>
      <img src="public/screenshots/detalle1.jpg" alt="Ficha del Proyecto" width="100%" style="border-radius: 10px; margin-top: 10px;" />
    </td>
    <td width="50%" align="center">
      <b>4. Anexos y Previsualización Funcional</b><br/>
  <img src="public/screenshots/detalle2.jpg" alt="Visualización de anexo" width="100%" style="border-radius: 15px; margin-top: 10px; margin-bottom: 20px; box-shadow: 0px 4px 15px rgba(0,0,0,0.3);" />
    </td>
  </tr>
</table>


---

## 📋 Cualidades Técnicas
- **Diseño Glassmorphism & Modo Oscuro:** Interfaz optimizada para reducir la fatiga visual.
- **Arquitectura de Contexto:** Manejo ágil de sesiones mediante `AuthContext`.
- **Componentización Sólida:** Creación de utilities puros en JavaScript (`expertSystem.js`) separando lógica pesada de las vistas en React.

<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif" alt="Squirtle Corriendo" width="60" />
  <br/><br/>
  <p>© 2026 - Repositorio Digital PSM. Todos los derechos reservados.</p>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=008080&height=100&section=footer" />
</div>
