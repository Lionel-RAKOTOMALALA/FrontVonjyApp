import { create } from 'zustand';
import axios from 'axios';

const useActeursCommuneStore = create((set, get) => ({
  acteurs: [], // Liste des acteurs
  loading: false, // État de chargement
  error: null, // Message d'erreur

  // Récupérer les acteurs d'une commune spécifique depuis l'API
  fetchActeurs: async (idCommune) => {
    set({ loading: true, error: null });
    const accessToken = localStorage.getItem('access_token'); // Récupérer le token depuis le localStorage
    try {
      const response = await axios.get(`https://www.admin.com/api/acteurs_commune/${idCommune}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ajouter le token en tant qu'en-tête Authorization
        },
      });
      set({ acteurs: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la récupération des acteurs',
        loading: false,
      });
    }
  },

  // Ajouter un nouvel acteur
  addActeur: async (newActeur) => {
    set({ loading: true, error: null });
    const accessToken = localStorage.getItem('access_token'); // Récupérer le token depuis le localStorage
    try {
      const response = await axios.post('https://www.admin.com/api/acteurs-commune/', newActeur, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ajouter le token en tant qu'en-tête Authorization
        },
      });
      set({ acteurs: [...get().acteurs, response.data], loading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors de l\'ajout d\'un acteur',
        loading: false,
      });
      return { success: false, error: error.response?.data };
    }
  },

  // Mettre à jour un acteur existant
  updateActeur: async (id, updatedData) => {
    set({ loading: true, error: null });
    const accessToken = localStorage.getItem('access_token'); // Récupérer le token depuis le localStorage
    try {
      const response = await axios.put(`https://www.admin.com/api/acteurs-commune/${id}/`, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ajouter le token en tant qu'en-tête Authorization
        },
      });
      set({
        acteurs: get().acteurs.map((acteur) =>
          acteur.id === id ? { ...acteur, ...response.data } : acteur
        ),
        loading: false,
      });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'acteur',
        loading: false,
      });
      return { success: false, error: error.response?.data };
    }
  },

  // Supprimer un acteur
  deleteActeur: async (id) => {
    set({ loading: true, error: null });
    const accessToken = localStorage.getItem('access_token'); // Récupérer le token depuis le localStorage
    try {
      await axios.delete(`https://www.admin.com/api/acteurs-commune/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Ajouter le token en tant qu'en-tête Authorization
        },
      });
      set({
        acteurs: get().acteurs.filter((acteur) => acteur.id !== id),
        loading: false,
      });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression de l\'acteur',
        loading: false,
      });
      return { success: false, error: error.response?.data };
    }
  },
}));

export default useActeursCommuneStore;