import { create } from 'zustand';

const useChefServiceStore = create((set) => ({
  chefServices: [],
  loading: false,
  error: null,

  // Action to fetch chef services
  fetchChefServices: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://www.admin.com/api/chefs/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des chefs de service.');
      }

      const data = await response.json();
      set({ chefServices: data, loading: false });
    } catch (error) {
      console.error('Erreur API:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Action to create a chef service
  createChefService: async (chefService) => {
    if (
      !chefService ||
      !chefService.nomChef ||
      !chefService.prenomChef ||
      !chefService.contact ||
      !chefService.adresse ||
      !chefService.sexe ||
      !chefService.service_id
    ) {
      throw new Error('Les données du chef de service sont manquantes ou invalides.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Payload envoyé:', JSON.stringify(chefService));

      const response = await fetch('https://www.admin.com/api/chefs/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chefService),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }

      const newChefService = await response.json();
      console.log('Réponse après l\'ajout :', newChefService);

      set((state) => ({
        chefServices: [...state.chefServices, newChefService],
      }));
      return newChefService;
    } catch (error) {
      console.error('Erreur lors de la création du chef de service :', error);
      throw error;
    }
  },

  // Action to update a chef service
  updateChefService: async (id, updatedChefService) => {
    if (!id || !updatedChefService) {
      throw new Error('ID ou données du chef de service manquantes pour la mise à jour.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Données envoyées pour la mise à jour :', updatedChefService);

      const response = await fetch(`https://www.admin.com/api/chefs/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChefService),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }

      const data = await response.json();
      console.log('Réponse après mise à jour :', data);

      set((state) => ({
        chefServices: state.chefServices.map((chefService) =>
          chefService.id === id ? data : chefService
        ),
      }));
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du chef de service :', error);
      throw error;
    }
  },

  // Action to delete a chef service
  deleteChefService: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://www.admin.com/api/chefs/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la suppression du chef de service.'
        );
      }

      // Successful deletion, update the state
      set((state) => ({
        chefServices: state.chefServices.filter((chefService) => chefService.id !== id),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du chef de service :', error);
      throw error;
    }
  },
}));

export default useChefServiceStore;