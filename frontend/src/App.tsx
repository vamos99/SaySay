import React from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { useNavigation } from './hooks/useNavigation';
import { ROUTES } from './utils/constants';

export const App: React.FC = () => {
  const { currentPath, handleNavigation } = useNavigation();

  const renderPage = () => {
    switch (currentPath) {
      case ROUTES.LOGIN:
        return <LoginPage />;
      case ROUTES.REGISTER:
        return <RegisterPage />;
      case ROUTES.CONTACT:
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Header onNavigate={handleNavigation} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}; 