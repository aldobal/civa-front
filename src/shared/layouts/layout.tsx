import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Rutas donde NO debe aparecer el header
  const authRoutes = ['/sign-in', '/sign-up'];
  const showHeader = !authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {showHeader && <Header />}
      <main className={showHeader ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
};