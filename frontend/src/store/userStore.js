    import { create } from 'zustand';
    import axios from 'axios';

    const useUserStore = create((set, get) => ({
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    loading: false,
    error: null,

    // Définir le token d'accès
    setAccessToken: (token) => {
        localStorage.setItem('access_token', token);
        set({ accessToken: token });
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
        const response = await axios.get('http://127.0.0.1:8000/api/user/info/', {
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
            await axios.post('http://127.0.0.1:8000/api/auth/logout/', {}, {
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
    }));
    
    export default useUserStore;
