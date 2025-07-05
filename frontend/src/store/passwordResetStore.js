import { create } from 'zustand';
import axios from 'axios';

const usePasswordResetStore = create((set, get) => ({
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
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi du code';
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
      const errorMessage = error.response?.data?.message || 'Erreur lors de la vérification du code';
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