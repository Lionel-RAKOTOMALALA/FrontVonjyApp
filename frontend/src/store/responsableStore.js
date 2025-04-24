import { create } from 'zustand';

const useResponsableStore = create((set) => ({
  responsables: [],
  loading: false,
  error: null,

  // Action pour récupérer les responsables
  fetchResponsables: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://www.admin.com/api/responsables/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des responsables.');
      }

      const data = await response.json();
      set({ responsables: data, loading: false });
    } catch (error) {
      console.error('Erreur API:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Action pour créer un responsable
  createResponsable: async (responsable) => {
    if (
      !responsable ||
      !responsable.nom_responsable || 
      !responsable.fokotany_id
    ) {
      throw new Error('Les données du responsable sont manquantes ou invalides.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Payload envoyé:', JSON.stringify(responsable));

      const response = await fetch('https://www.admin.com/api/responsables/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responsable),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }

      const newResponsable = await response.json();
      console.log('Réponse après l\'ajout :', newResponsable);

      set((state) => ({
        responsables: [...state.responsables, newResponsable],
      }));
      return newResponsable;
    } catch (error) {
      console.error('Erreur lors de la création du responsable :', error);
      throw error;
    }
  },

  // Action pour mettre à jour un responsable
  updateResponsable: async (id, updatedResponsable) => {
    if (!id || !updatedResponsable) {
      throw new Error('ID ou données du responsable manquantes pour la mise à jour.');
    }
    try {
      const token = localStorage.getItem('access_token');
      console.log('Données envoyées pour la mise à jour :', updatedResponsable);

      const response = await fetch(`https://www.admin.com/api/responsables/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedResponsable),
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
        responsables: state.responsables.map((responsable) =>
          responsable.id === id ? data : responsable
        ),
      }));
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du responsable :', error);
      throw error;
    }
  },

  // Action pour supprimer un responsable
  deleteResponsable: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://www.admin.com/api/responsables/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la suppression du responsable.'
        );
      }

      // Suppression réussie, mise à jour de l'état
      set((state) => ({
        responsables: state.responsables.filter((responsable) => responsable.id !== id),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du responsable :', error);
      throw error;
    }
  },
}));

export default useResponsableStore;