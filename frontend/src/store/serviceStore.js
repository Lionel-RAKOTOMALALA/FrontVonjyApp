import { create } from 'zustand';

const useServiceStore = create((set) => ({
  services: [],
  loading: false,
  error: null,

  // Action to fetch services
  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/services/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des services.');
      }

      const data = await response.json();
      set({ services: data, loading: false });
    } catch (error) {
      console.error('Erreur API:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Action to create a service
  createService: async (service) => {
    if (
      !service ||
      !service.nomService ||
      !service.description ||
      !service.offre ||
      !service.membre ||
      !service.membre ||
      service.nombre_membre === undefined ||
      service.nombre_membre === null ||
      !service.fokotany_id
    ) {
      throw new Error('Les données du service sont manquantes ou invalides.');
    }
    try {
      const token = localStorage.getItem('access_token'); 

      const response = await fetch('http://localhost:8000/api/services/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }

      const newService = await response.json(); 

      set((state) => ({
        services: [...state.services, newService],
      }));
      return newService;
    } catch (error) {
      console.error('Erreur lors de la création du service :', error);
      throw error;
    }
  },

  // Action to update a service
  updateService: async (id, updatedService) => {
    if (!id || !updatedService) {
      throw new Error('ID ou données du service manquantes pour la mise à jour.');
    }
    try {
      const token = localStorage.getItem('access_token'); 

      const response = await fetch(`http://localhost:8000/api/services/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la requête. Vérifiez vos données.'
        );
      }

      const data = await response.json(); 
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? data : service
        ),
      }));
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service :', error);
      throw error;
    }
  },

  // Action to delete a service
  deleteService: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/services/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(
          errorDetails.message || 'Erreur lors de la suppression du service.'
        );
      }

      // Successful deletion, update the state
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
      throw error;
    }
  },
}));

export default useServiceStore;