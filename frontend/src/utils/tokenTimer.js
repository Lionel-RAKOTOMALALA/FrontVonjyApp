import React, { useEffect, useState } from 'react';

// Fonction pour récupérer l'expiration du token
function getTokenExpiration(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Décoder la partie payload du JWT
    return payload.exp ? payload.exp * 1000 : null; // Convertir en millisecondes
  } catch (e) {
    console.error("Erreur de décodage du token JWT", e);
    return null;
  }
}

function TokenTimer() {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');  // Récupère le token depuis localStorage
    if (!token) {
      console.log("Aucun token trouvé");
      return;
    }

    const expirationTime = getTokenExpiration(token);
    if (!expirationTime) {
      console.log("Expiration du token non trouvée");
      return;
    }

    const updateTime = () => {
      const now = Date.now();
      const remaining = expirationTime - now;
      setRemainingTime(remaining); // Mettre à jour l'état avec la durée restante

      // Afficher la durée restante dans la console
      console.log(`Token expires in: ${Math.floor(remaining / 1000)} seconds`);

      // Si le token est expiré, arrêter l'intervalle
      if (remaining <= 0) {
        console.log("Token expired");
        clearInterval(intervalId);
      }
    };

    // Mettre à jour chaque seconde
    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Affichage initial

    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(intervalId);
  }, []); // L'effet ne dépend de rien (ne s'exécute qu'une fois)
  
}

export default TokenTimer;
