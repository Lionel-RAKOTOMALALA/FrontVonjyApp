import { create } from 'zustand';

const useDistrictStore = create((set) => ({
  districts: [],
  loading: false,
  error: null,

  // Action pour récupérer les districts
  fetchDistricts: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/annuaire/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Réponse API pour fetchDistricts:', data);
      set({ districts: data, loading: false });
    } catch (error) {
      console.error('fetchDistricts: erreur lors de la récupération des districts', error);
      set({ error: error.message, loading: false });
    }
  },

  // Action pour créer un district
  createDistrict: async (district) => {
    if (!district) {
      throw new Error('Les données du district sont manquantes ou invalides.');
    }
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/annuaire/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(district),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Erreur lors de la création du district.');
      }

      const newDistrict = await response.json();
      set((state) => ({ districts: [...state.districts, newDistrict] }));
      return newDistrict;
    } catch (error) {
      console.error('Erreur création district:', error);
      throw error;
    }
  },

  // Action pour mettre à jour un district
  updateDistrict: async (id, updatedDistrict) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/annuaire/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDistrict),
      });

      const data = await response.json();
      set((state) => ({
        districts: state.districts.map((district) =>
          district.id === id ? data : district
        ),
      }));
      return data;
    } catch (error) {
      console.error('Erreur updateDistrict:', error);
      throw error;
    }
  },

  // Action pour supprimer un district
  deleteDistrict: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/annuaire/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      set((state) => ({
        districts: state.districts.filter((district) => district.id !== id),
      }));
    } catch (error) {
      console.error('Erreur suppression district:', error);
      throw error;
    }
  },
}));

export default useDistrictStore;
