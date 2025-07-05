import { create } from 'zustand'
import axios from 'axios'

const usePasswordResetStore = create((set) => ({
  // États
  loading: false,
  error: null,
  success: null,
  email: '',

  // Actions d'état
  setEmail: (email) => set({ email }),
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  // 1. Demander la réinitialisation (envoi du code)
  requestReset: async (email) => {
    set({ loading: true, error: null, success: null })
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/request-reset/', { email })
      set({ loading: false, success: response.data.message, email })
      return { success: true, message: response.data.message }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi du code'
      set({ loading: false, error: errorMessage })
      return { success: false, error: errorMessage }
    }
  },

  // 2. Vérifier le code et définir le nouveau mot de passe
  verifyCode: async (email, code, newPassword) => {
    set({ loading: true, error: null, success: null })
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify-code/', {
        email,
        code,
        new_password: newPassword
      })
      set({ loading: false, success: response.data.message })
      return { success: true, message: response.data.message }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la vérification du code'
      set({ loading: false, error: errorMessage })
      return { success: false, error: errorMessage }
    }
  },

  // 3. Réinitialiser le mot de passe avec OTP
  resetPassword: async (email, code, newPassword) => {
    set({ loading: true, error: null, success: null })
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', {
        email: email,
        code: code,
        new_password: newPassword
      })
      set({ loading: false, success: response.data.message, error: null })
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe'
      set({ loading: false, error: errorMessage, success: false })
      throw new Error(errorMessage)
    }
  },

  // 4. Changer le mot de passe (utilisateur connecté)
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    set({ loading: true, error: null, success: null })
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token d\'authentification manquant')
      const response = await axios.post('http://127.0.0.1:8000/api/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      set({ loading: false, success: response.data.message, error: null })
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      set({ loading: false, error: errorMessage, success: false })
      throw new Error(errorMessage)
    }
  },

  // Réinitialiser tout le store
  resetStore: () => {
    set({
      loading: false,
      error: null,
      success: null,
      email: ''
    })
  }
}))

export default usePasswordResetStore 
