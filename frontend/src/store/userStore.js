import { create } from 'zustand';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Bibliothèque pour décoder les tokens JWT

const useUserStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('access_token') || null,
  loading: false,
  error: null,

  // Définir le token d'accès
  setAccessToken: (token) => {
    localStorage.setItem('access_token', token);
    set({ accessToken: token });

    // Décoder le token pour récupérer l'UID
    try {
      const decodedToken = jwtDecode(token);
      set({ user: { ...get().user, uid: decodedToken.uid } }); // Ajouter l'UID au user dans le store
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  },

  // Récupérer les informations utilisateur
  fetchUser: async () => {
    const { accessToken } = get();
    if (!accessToken) {
      set({ error: 'Token non disponible', loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get('http://localhost:8000/api/user/info/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set({ user: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur de récupération des données utilisateur',
        loading: false,
      });
    }
  },

  // Déconnexion de l'utilisateur
  logout: async () => {
    const { accessToken } = get();

    try {
      if (accessToken) {
        // Appel à l'API de déconnexion
        await axios.post('http://localhost:8000/api/auth/logout/', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error.response?.data?.message || error.message);
    } finally {
      // Nettoyage des données locales après la déconnexion
      localStorage.removeItem('access_token');
      set({ user: null, accessToken: null });
    }
  },

  // Mettre à jour les informations utilisateur
  updateUser: async (updatedData) => {
    const { accessToken, user } = get();

    if (!accessToken) {
      set({ error: 'Token non disponible' });
      return;
    }

    const uid = user?.uid;
    if (!uid) {
      set({ error: 'UID non disponible dans l\'utilisateur' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/update-profile/${uid}/`, // Appel API avec UID inclus dans l'URL
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Mettre à jour les informations utilisateur dans le store
      set({ user: { ...user, ...updatedData }, loading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour des informations utilisateur',
        loading: false,
      });
      return { success: false, error: error.response?.data };
    }
  },
}));

export default useUserStore;