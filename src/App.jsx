import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Repository from './pages/Repository'
import Info from './pages/Info'
import ProjectDetail from './pages/ProjectDetail'
import Auth from './pages/Auth'
import AdminPanel from './pages/AdminPanel'
import MyProjects from './pages/MyProjects'

import { AuthProvider, useAuth } from './context/AuthContext'

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
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/mis-proyectos" element={<MyProjects />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors closeButton />
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
