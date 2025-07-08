import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/auth';

function getTokenExpiration(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch (e) {
    console.error("Erreur de décodage du token JWT", e);
    return null;
  }
}

function TokenTimer() {
  const [, setRemainingTime] = useState(null);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const intervalRef = useRef(null); // 🧠 Référence vers le timer

  // Écouter les changements de token dans le localStorage (en cas de login via un autre onglet, par exemple)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('access_token');
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Si déconnecté → on coupe le timer et reset l’état
    if (!isLoggedIn || !token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; 
      }
      setRemainingTime(null);
      return;
    }

    const expirationTime = getTokenExpiration(token);
    if (!expirationTime) { 
      return;
    }

    const updateTime = () => {
      const now = Date.now();
      const remaining = expirationTime - now;
      setRemainingTime(remaining); 

      if (remaining <= 0) { 
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    intervalRef.current = setInterval(updateTime, 1000);
    updateTime();

    // Nettoyage si le composant se démonte ou si l’effet se relance
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoggedIn, token]);

  return null;
}

export default TokenTimer;
