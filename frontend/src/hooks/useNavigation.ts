import { useState, useEffect } from 'react';

export const useNavigation = () => {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setCurrentPath(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return { currentPath, handleNavigation };
}; 