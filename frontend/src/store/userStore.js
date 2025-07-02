import { create } from 'zustand';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || null;
  }
  return null;
};

const setStoredToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

const removeStoredToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

const useUserStore = create((set, get) => ({
  user: null,
  accessToken: getStoredToken(),
  loading: false,
  error: null,
  // Nouveau flag pour distinguer les types de chargement
  isAuthLoading: false,
  isProfileLoading: false,

  setAccessToken: (token) => {
    setStoredToken(token);
    set({ accessToken: token });

    try {
      const decodedToken = jwtDecode(token);
      set({ user: { ...get().user, uid: decodedToken.uid } });
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
      set({ error: 'Token invalide' });
    }
  },

  fetchUser: async () => {
    const { accessToken } = get();
    if (!accessToken) {
      set({ error: 'Token non disponible', isAuthLoading: false });
      return;
    }

    // Utiliser isAuthLoading pour le chargement initial
    set({ isAuthLoading: true, error: null });

    try {
      const response = await axios.get('http://localhost:8000/api/user/info/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set({ 
        user: response.data, 
        isAuthLoading: false,
        // Maintenir la compatibilité avec l'ancien loading
        loading: false 
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur de récupération des données utilisateur';
      set({
        error: errorMessage,
        isAuthLoading: false,
        loading: false
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    const { accessToken } = get();

    try {
      if (accessToken) {
        await axios.post('http://localhost:8000/api/auth/logout/', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error.response?.data?.message || error.message);
    } finally {
      removeStoredToken();
      set({ 
        user: null, 
        accessToken: null, 
        error: null,
        isAuthLoading: false,
        isProfileLoading: false,
        loading: false
      });
    }
  },

  updateUser: async (updatedData) => {
    const { accessToken, user } = get();

    if (!accessToken) {
      set({ error: 'Token non disponible' });
      return { success: false, error: 'Non authentifié' };
    }

    const uid = user?.uid;
    if (!uid) {
      set({ error: 'UID non disponible dans l\'utilisateur' });
      return { success: false, error: 'Utilisateur non identifié' };
    }

    // Utiliser isProfileLoading pour les mises à jour de profil
    set({ isProfileLoading: true, error: null });

    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/update-profile/${uid}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedUser = { ...user, ...response.data };
      set({ 
        user: updatedUser, 
        isProfileLoading: false,
        // Ne pas modifier loading pour éviter d'affecter ProtectedRoute
        loading: false
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour des informations utilisateur';
      set({
        error: errorMessage,
        isProfileLoading: false,
        loading: false
      });
      return { 
        success: false, 
        error: errorMessage,
        details: error.response?.data 
      };
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useUserStore;