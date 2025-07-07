import { create } from 'zustand';
import axios from 'axios';

const useSimpleUsersStore = create((set, get) => ({
  // État
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  searchResults: [],
  isSearching: false,

  // Actions

  // 1. Récupérer tous les utilisateurs simples
  fetchSimpleUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/users/simples/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set({ users: response.data, loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la récupération des utilisateurs';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // 2. Rechercher des utilisateurs simples
  searchSimpleUsers: async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      set({ searchResults: [], isSearching: false });
      return { success: true, data: [] };
    }

    set({ isSearching: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/users/simples/search/?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      set({ searchResults: response.data, isSearching: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la recherche';
      set({ error: errorMessage, isSearching: false });
      return { success: false, error: errorMessage };
    }
  },

  // 3. Créer un nouvel utilisateur simple (Admin uniquement)
  createSimpleUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      
      // Préparer les données pour l'API selon la logique du backend
      const formData = new FormData();
      formData.append('namefull', userData.namefull);
      formData.append('email', userData.email);
      formData.append('password', userData.password || 'defaultPassword123');
      formData.append('role', 'simple'); // Le backend force le rôle SIMPLE
      
      // Ajouter la photo si elle existe
      if (userData.photo_profil && userData.photo_profil instanceof File) {
        formData.append('photo_profil', userData.photo_profil);
      }

      console.log('Envoi des données:', {
        namefull: userData.namefull,
        email: userData.email,
        hasPhoto: !!userData.photo_profil
      });

      const response = await axios.post('http://localhost:8000/api/admin/users/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Réponse du serveur:', response.data);
      console.log('Status:', response.status);
      
      // Ajouter le nouvel utilisateur à la liste
      set((state) => ({
        users: [...state.users, response.data],
        loading: false
      }));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          error.response?.data?.error ||
                          'Erreur lors de la création de l\'utilisateur';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage, details: error.response?.data };
    }
  },

  // 4. Mettre à jour un utilisateur simple (Admin uniquement)
  updateSimpleUser: async (uid, userData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      
      // Préparer les données pour l'envoi
      const formData = new FormData();
      formData.append('namefull', userData.namefull);
      formData.append('email', userData.email);
      
      // Ajouter la photo si elle existe et que c'est un nouveau fichier
      if (userData.photo_profil && userData.photo_profil instanceof File) {
        formData.append('photo_profil', userData.photo_profil);
      }

      console.log('Mise à jour utilisateur:', {
        uid,
        namefull: userData.namefull,
        email: userData.email,
        hasNewPhoto: userData.photo_profil instanceof File
      });

      // Utiliser l'endpoint UpdateUserView qui gère les mises à jour
      const response = await axios.put(`http://localhost:8000/api/auth/update-profile/${uid}/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Réponse mise à jour:', response.data);
      
      // Extraire les données utilisateur de la réponse
      const updatedUserData = response.data.user || response.data;
      
      // Mettre à jour l'utilisateur dans la liste avec les nouvelles données
      set((state) => ({
        users: state.users.map(user => 
          user.uid === uid ? { 
            ...user, 
            namefull: updatedUserData.namefull,
            email: updatedUserData.email,
            photo_profil: updatedUserData.photo_profil
          } : user
        ),
        searchResults: state.searchResults.map(user => 
          user.uid === uid ? { 
            ...user, 
            namefull: updatedUserData.namefull,
            email: updatedUserData.email,
            photo_profil: updatedUserData.photo_profil
          } : user
        ),
        loading: false
      }));
      
      return { success: true, data: updatedUserData };
    } catch (error) {
      console.error('Erreur modification utilisateur:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          error.response?.data?.error ||
                          'Erreur lors de la modification de l\'utilisateur';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage, details: error.response?.data };
    }
  },

  // 5. Supprimer un utilisateur simple (Admin uniquement)
  deleteSimpleUser: async (uid) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/admin/users/${uid}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Retirer l'utilisateur de la liste
      set((state) => ({
        users: state.users.filter(user => user.uid !== uid),
        searchResults: state.searchResults.filter(user => user.uid !== uid),
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          'Erreur lors de la suppression de l\'utilisateur';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // 6. Sélectionner un utilisateur
  selectUser: (user) => {
    set({ selectedUser: user });
  },

  // 7. Effacer la sélection
  clearSelectedUser: () => {
    set({ selectedUser: null });
  },

  // 8. Effacer les résultats de recherche
  clearSearchResults: () => {
    set({ searchResults: [], isSearching: false });
  },

  // 9. Effacer les erreurs
  clearError: () => {
    set({ error: null });
  },

  // 10. Réinitialiser le store
  reset: () => {
    set({
      users: [],
      selectedUser: null,
      loading: false,
      error: null,
      searchResults: [],
      isSearching: false,
    });
  },

  // 11. Obtenir un utilisateur par UID
  getUserById: (uid) => {
    const { users } = get();
    return users.find(user => user.uid === uid) || null;
  },

  // 12. Vérifier si un utilisateur existe
  userExists: (email) => {
    const { users } = get();
    return users.some(user => user.email === email);
  },

  // 13. Compter le nombre d'utilisateurs
  getUserCount: () => {
    const { users } = get();
    return users.length;
  },

  // 14. Filtrer les utilisateurs par rôle (pour extensibilité)
  getUsersByRole: (role) => {
    const { users } = get();
    return users.filter(user => user.role === role);
  },

  // 15. Trier les utilisateurs
  sortUsers: (sortBy = 'namefull', sortOrder = 'asc') => {
    const { users } = get();
    const sortedUsers = [...users].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    set({ users: sortedUsers });
  },
}));

export default useSimpleUsersStore; 