/**
 * Utilitaires pour la gestion des images
 */

const BACKEND_URL = 'http://localhost:8000';

/**
 * Construit l'URL complète d'une image de profil
 * @param {string} photoUrl - L'URL ou le chemin de l'image
 * @returns {string|null} - L'URL complète ou null si pas d'image
 */
export const getProfileImageUrl = (photoUrl) => {
  if (!photoUrl) return null;
  
  // Si c'est déjà une URL complète, la retourner
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  
  // Si c'est un chemin relatif, construire l'URL complète
  if (photoUrl.startsWith('/')) {
    return `${BACKEND_URL}${photoUrl}`;
  }
  
  // Si c'est juste un nom de fichier, construire le chemin complet
  return `${BACKEND_URL}/media/photos_profil/${photoUrl}`;
};

/**
 * Valide un fichier image
 * @param {File} file - Le fichier à valider
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validateImageFile = (file) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'image/webp', 'image/bmp', 'image/svg+xml'
  ];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  
  if (!allowedTypes.includes(file.type)) {
    return `Le type de fichier ${file.type} n'est pas autorisé. Seules les images sont acceptées.`;
  }
  
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return `L'extension ${fileExtension} n'est pas autorisée.`;
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'Le fichier est trop volumineux (5MB maximum).';
  }
  
  return null;
};

/**
 * Génère les initiales à partir d'un nom complet
 * @param {string} namefull - Le nom complet
 * @returns {string} - Les initiales (max 2 caractères)
 */
export const getInitials = (namefull) => {
  if (!namefull) return '';
  const names = namefull.split(' ');
  const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
  return initials.substring(0, 2); // Prendre seulement les 2 premières initiales
};

/**
 * Gère les erreurs de chargement d'image
 * @param {Event} e - L'événement d'erreur
 */
export const handleImageError = (e) => {
  // En cas d'erreur de chargement, masquer l'image et afficher les initiales
  e.target.style.display = 'none';
  if (e.target.nextSibling) {
    e.target.nextSibling.style.display = 'flex';
  }
}; 