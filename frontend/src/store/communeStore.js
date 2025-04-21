// stores/communeStore.js
import { create } from 'zustand';

const useCommuneStore = create((set) => ({
  communes: [],
  communedetail: [],
  loading: false,
  error: null,

  fetchDetailCommune: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communes/${id}/details/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Réponse API pour fetchDetailCommune:', data); // Vérification des données
      set({ communedetail: data, loading: false }); // Mise à jour du store
    } catch (error) {
      console.error('fetchDetailCommune: Error fetching commune detail:', error);
      set({ error: error.message, loading: false });
    }
  },


  // Action pour récupérer les communes
  fetchCommunes: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/communes/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      set({ communes: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action pour créer une commune
  createCommune: async (commune) => {
    console.log("données dans store");
    
    console.log(commune);
    
    if (!commune) {
      throw new Error('Les données de la commune sont manquantes ou invalides.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token utilisé:', token);
      console.log('Payload envoyé:', JSON.stringify(commune));
  
      const response = await fetch('http://127.0.0.1:8000/api/communes/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commune),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }
  
      const newCommune = await response.json();
      console.log('Réponse après l\'ajout :', newCommune);
  
      set((state) => ({ communes: [...state.communes, newCommune] }));
      return newCommune;
    } catch (error) {
      console.error('Erreur lors de la création de la commune :', error);
      throw error;
    }
  },

  // Action pour mettre à jour une commune
  updateCommune: async (id, updatedCommune) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communes/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCommune)
      });
      const data = await response.json();
      set((state) => ({
        communes: state.communes.map(commune => 
          commune.id === id ? data : commune
        )
      }));
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Action pour supprimer une commune
  deleteCommune: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://127.0.0.1:8000/api/communes/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set((state) => ({
        communes: state.communes.filter(commune => commune.id !== id)
      }));
    } catch (error) {
      throw error;
    }
  }
}));

export default useCommuneStore;
