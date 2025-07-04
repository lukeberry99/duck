import { useState, useEffect } from 'react';

export const useDebugMenu = () => {
  const [isDebugMenuOpen, setIsDebugMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger on 'D' key when not typing in an input field
      if (
        event.key === 'D' && 
        !event.ctrlKey && 
        !event.metaKey && 
        !event.altKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault();
        setIsDebugMenuOpen(prev => !prev);
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeDebugMenu = () => {
    setIsDebugMenuOpen(false);
  };

  return {
    isDebugMenuOpen,
    closeDebugMenu,
    toggleDebugMenu: () => setIsDebugMenuOpen(prev => !prev)
  };
};