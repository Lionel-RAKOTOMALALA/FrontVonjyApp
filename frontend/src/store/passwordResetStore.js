import { create } from 'zustand';
import axios from 'axios';

const usePasswordResetStore = create((set) => ({
  // États
  loading: false,
  error: null,
  success: null,
  email: '',

  // Actions
  setEmail: (email) => set({ email }),
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  // 1. Demander la réinitialisation (envoi du code)
  requestReset: async (email) => {
    set({ loading: true, error: null, success: null });
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/request-reset/', {
        email: email
      });
      
      set({
        loading: false,
        success: response.data.message,
        email: email
      });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      // Gestion d'erreur améliorée
      let errorMessage = 'Erreur lors de l\'envoi du code';
      
      if (error.response) {
        // Erreur avec réponse du serveur
        if (error.response.status === 500) {
          errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
        } else if (error.response.status === 404) {
          errorMessage = 'Utilisateur introuvable';
        } else {
          errorMessage = error.response.data?.message || `Erreur ${error.response.status}`;
        }
      } else if (error.request) {
        // Erreur de réseau
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      }
      
      set({
        loading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  // 2. Vérifier le code et définir le nouveau mot de passe
  verifyCode: async (email, code, newPassword) => {
    set({ loading: true, error: null, success: null });
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify-code/', {
        email: email,
        code: code,
        new_password: newPassword
      });
      
      set({
        loading: false,
        success: response.data.message
      });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      // Gestion d'erreur améliorée
      let errorMessage = 'Erreur lors de la vérification du code';
      
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
        } else if (error.response.status === 400) {
          errorMessage = 'Code invalide ou expiré';
        } else {
          errorMessage = error.response.data?.message || `Erreur ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      }
      
      set({
        loading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  // Réinitialiser le store
  resetStore: () => {
    set({
      loading: false,
      error: null,
      success: null,
      email: ''
    });
  }
}));

export default usePasswordResetStore;