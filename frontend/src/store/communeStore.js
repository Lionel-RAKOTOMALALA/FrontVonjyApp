import { create } from 'zustand';

const useCommuneStore = create((set) => ({
  communes: [],
  communedetail: [],
  totals: {},
  loading: false,
  error: null,

  // Action pour récupérer les détails d'une commune
  fetchDetailCommune: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/communes/${id}/details/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Réponse API pour fetchDetailCommune:', data);
      set({ communedetail: data, loading: false });
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
      const response = await fetch('http://localhost:8000/api/communes/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
    
    const token = localStorage.getItem('access_token');
    console.log('Token utilisé:', token);
    console.log('Payload envoyé:', JSON.stringify(commune));

    const response = await fetch('http://localhost:8000/api/communes/', {
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
  },

  // Action pour mettre à jour une commune
  updateCommune: async (id, updatedCommune) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8000/api/communes/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCommune)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    set((state) => ({
      communes: state.communes.map(commune => 
        commune.id === id ? data : commune
      )
    }));
    return data;
  },

  // Action pour supprimer une commune
  deleteCommune: async (id) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8000/api/communes/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    set((state) => ({
      communes: state.communes.filter(commune => commune.id !== id)
    }));
  },

  // Action pour récupérer les totaux (communes, fokotanys, services)
  fetchTotals: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/totals/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Réponse API pour fetchTotals:', data);
      set({ totals: data, loading: false });
    } catch (error) {
      console.error('fetchTotals: Error fetching totals:', error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useCommuneStore;