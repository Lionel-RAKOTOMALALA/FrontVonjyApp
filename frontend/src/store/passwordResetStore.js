import { create } from 'zustand'

const usePasswordResetStore = create((set, get) => ({
  // État
  loading: false,
  error: null,
  success: false,

  // Actions
  resetPassword: async (newPassword, confirmPassword, otpCode) => {
    set({ loading: true, error: null, success: false })
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('http://localhost:8000/api/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword,
          otp_code: otpCode
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réinitialisation du mot de passe')
      }

      set({ 
        loading: false, 
        success: true, 
        error: null 
      })

      return { success: true, data }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message, 
        success: false 
      })
      throw error
    }
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    set({ loading: true, error: null, success: false })
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }

      const response = await fetch('http://localhost:8000/api/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du changement de mot de passe')
      }

      set({ 
        loading: false, 
        success: true, 
        error: null 
      })

      return { success: true, data }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message, 
        success: false 
      })
      throw error
    }
  },

  // Reset state
  resetState: () => {
    set({ loading: false, error: null, success: false })
  }
}))

export default usePasswordResetStore 