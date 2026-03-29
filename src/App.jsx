import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Repository from './pages/Repository'
import Info from './pages/Info'
import ProjectDetail from './pages/ProjectDetail'
import Auth from './pages/Auth'

import { AuthProvider, useAuth } from './context/AuthContext'
import { Loader2 } from 'lucide-react'

// Utilidad nativa de React Router para reiniciar el Scroll a tope de página
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Cargando repositorio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repositorios" element={<Repository />} />
          <Route path="/repositorios/proyecto/:slug" element={<ProjectDetail />} />
          <Route path="/info" element={<Info />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
