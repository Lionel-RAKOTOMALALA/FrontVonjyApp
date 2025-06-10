import { create } from 'zustand';

const useFokotanyStore = create((set) => ({
  fokotanys: [],
  loading: false,
  error: null,

  // Action pour récupérer les fokotanys
  fetchFokotanys: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/fokotany/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      set({ fokotanys: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Action pour créer un fokotany
  createFokotany: async (fokotany) => {
    if (!fokotany || !fokotany.nomFokotany || !fokotany.commune_id) {
      throw new Error('Les données du fokotany sont manquantes ou invalides.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token utilisé:', token);
      console.log('Payload envoyé:', JSON.stringify(fokotany));

      const response = await fetch('http://localhost:8000/api/fokotany/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fokotany),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }

      const newFokotany = await response.json();
      console.log('Réponse après l\'ajout :', newFokotany);

      set((state) => ({ fokotanys: [...state.fokotanys, newFokotany] }));
      return newFokotany;
    } catch (error) {
      console.error('Erreur lors de la création du fokotany :', error);
      throw error;
    }
  },

  // Action pour mettre à jour un fokotany
  updateFokotany: async (id, updatedFokotany) => {
    if (!id || !updatedFokotany) {
      throw new Error('ID ou données du fokotany manquantes pour la mise à jour.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Données envoyées pour la mise à jour :', updatedFokotany); // Debug
  
      const response = await fetch(`http://localhost:8000/api/fokotany/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFokotany),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails); // Debug
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }
  
      const data = await response.json();
      console.log('Réponse après mise à jour :', data); // Debug
  
      set((state) => ({
        fokotanys: state.fokotanys.map((fokotany) =>
          fokotany.id === id ? data : fokotany
        ),
      }));
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du fokotany :', error); // Debug
      throw error;
    }
  },

  // Action pour supprimer un fokotany
  deleteFokotany: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/fokotany/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      set((state) => ({
        fokotanys: state.fokotanys.filter((fokotany) => fokotany.id !== id),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du fokotany :', error);
      throw error;
    }
  },
}));

export default useFokotanyStore;