import { create } from 'zustand';
import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const useAnnuaireStore = create((set, get) => ({
  annuaires: [],
  loading: false,
  error: null,

  fetchAnnuaires: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:8000/api/annuaire/', {
        headers: getAuthHeaders()
      });
      set({ annuaires: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data || 'Erreur lors du chargement', loading: false });
    }
  },

  createAnnuaire: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:8000/api/annuaire/', data, {
        headers: getAuthHeaders()
      });
      set({ loading: false });
      get().fetchAnnuaires();
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.response?.data || 'Erreur lors de la création', loading: false });
      return { success: false, error: error.response?.data };
    }
  },

  updateAnnuaire: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`http://localhost:8000/api/annuaire/${id}/`, data, {
        headers: getAuthHeaders()
      });
      set({ loading: false });
      get().fetchAnnuaires();
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.response?.data || 'Erreur lors de la modification', loading: false });
      return { success: false, error: error.response?.data };
    }
  },

  deleteAnnuaire: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`http://localhost:8000/api/annuaire/${id}/`, {
        headers: getAuthHeaders()
      });
      set({ loading: false });
      get().fetchAnnuaires();
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data || 'Erreur lors de la suppression', loading: false });
      return { success: false, error: error.response?.data };
    }
  },
}));

export default useAnnuaireStore; 