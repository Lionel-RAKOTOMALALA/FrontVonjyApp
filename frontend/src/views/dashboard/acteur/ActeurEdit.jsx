import  { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import useActeursCommuneStore from '../../../store/acteursCommuneStore';

// Schéma de validation avec Zod - harmonisé avec ActeurCreate
const acteurSchema = z.object({
  commune_id: z.string().trim().min(1, "La commune est requise"),
  role_acteurs: z.string().trim().min(1, "Le rôle est requis"),
  nom: z.string().trim().min(1, "Le nom est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().trim().optional(),
  contact: z.string().trim()
    .min(1, "Le contact est requis")
    .regex(/^(\+?261|0)?[0-9\s\-.]{8,15}$/, "Format de contact invalide (ex: 033 24 992 10)"),
  interventions_actuelles: z.string().trim().optional(),
  domaines_intervention_possibles: z.string().trim().optional(),
  ouverture: z.string().trim().min(1, "L'ouverture est requise")
});

const ActeurEdit = ({ isOpen, acteur, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    commune_id: '',
    role_acteurs: '',
    nom: '',
    prenom: '',
    contact: '',
    interventions_actuelles: '',
    domaines_intervention_possibles: '',
    ouverture: ''
  });

  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { updateActeur } = useActeursCommuneStore();

  // Fonction pour extraire les données de l'acteur
  const getActeurData = (acteurData) => {
    if (!acteurData) return {
      commune_id: '',
      role_acteurs: '',
      nom: '',
      prenom: '',
      contact: '',
      interventions_actuelles: '',
      domaines_intervention_possibles: '',
      ouverture: ''
    };

    // Extraire l'ID de la commune de manière sécurisée
    let communeId = '';
    if (acteurData.commune_id) {
      communeId = acteurData.commune_id.toString();
    } else if (acteurData.commune?.id) {
      communeId = acteurData.commune.id.toString();
    }

    return {
      commune_id: communeId,
      role_acteurs: acteurData.role_acteurs || '',
      nom: acteurData.nom || '',
      prenom: acteurData.prenom || '',
      contact: acteurData.contact || '',
      interventions_actuelles: acteurData.interventions_actuelles || '',
      domaines_intervention_possibles: acteurData.domaines_intervention_possibles || '',
      ouverture: acteurData.ouverture || ''
    };
  };

  // Fetch communes for dropdown
  useEffect(() => {
    const fetchCommunes = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/communes/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des communes.');
        }
        const data = await response.json();
        setCommunes(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des communes :', err);
        setError('Impossible de charger les communes.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCommunes();
    }
  }, [isOpen]);

  // Initialiser le formulaire avec les données de l'acteur après le chargement des communes
  useEffect(() => {
    if (isOpen && acteur && communes.length > 0) {
      const initialData = getActeurData(acteur);
      // Vérifier si la commune existe dans la liste avant de l'assigner
      const communeExists = communes.some(commune => 
        commune.id.toString() === initialData.commune_id
      );
      
      if (!communeExists && initialData.commune_id) {
        console.warn(`Commune avec ID ${initialData.commune_id} non trouvée dans la liste`);
        initialData.commune_id = ''; // Reset si la commune n'existe pas
      }
      
      setFormData(initialData);
    }
  }, [isOpen, acteur, communes]);

  // Validation en temps réel d'un champ
  const validateField = (name, value) => {
    try {
      acteurSchema.pick({ [name]: true }).parse({ [name]: value });
      return '';
    } catch (err) {
      return err.errors?.[0]?.message || '';
    }
  };

  // Validation complète du formulaire
  const validateForm = () => {
    try {
      acteurSchema.parse(formData);
      return { isValid: true, errors: {} };
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        return { isValid: false, errors: fieldErrors };
      }
      return { isValid: false, errors: {} };
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel seulement après la première soumission
    if (hasSubmitted) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    setSubmitError('');
  };

  const handleSave = async () => {
    setHasSubmitted(true);

    // Validation complète du formulaire
    const validation = validateForm();

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Préparer les données pour l'API (convertir commune_id en number)
      const payload = {
        ...formData,
        commune_id: parseInt(formData.commune_id, 10)
      };

      await updateActeur(acteur.id, payload);
      if (onSuccess) onSuccess('Acteur modifié avec succès !');
      resetForm();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setSubmitError(err.message || "Une erreur est survenue lors de la modification.");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la modification.", 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      commune_id: '',
      role_acteurs: '',
      nom: '',
      prenom: '',
      contact: '',
      interventions_actuelles: '',
      domaines_intervention_possibles: '',
      ouverture: ''
    });
    setErrors({});
    setError('');
    setSubmitError('');
    setHasSubmitted(false);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Modal
      title="Modifier un acteur"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="600px"
    >
      {submitError && (
        <div className="alert alert-danger">{submitError}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4 mt-2">
          <InputField
            required
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            error={!!errors.nom}
            helperText={errors.nom}
          />
        </div>
        <div className="col-md-6 mb-4 mt-2">
          <InputField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            error={!!errors.prenom}
            helperText={errors.prenom}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <SelectField
            required
            label="Commune"
            name="commune_id"
            value={formData.commune_id}
            onChange={handleChange}
            options={communes.map((commune) => ({
              label: commune.nomCommune,
              value: commune.id.toString(),
            }))}
            disabled={loading || communes.length === 0}
            error={!!errors.commune_id}
            helperText={errors.commune_id || (loading ? "Chargement des communes..." : "")}
            placeholder="Sélectionnez une commune"
          />
        </div>
        <div className="col-md-6 mb-4">
          <InputField
            required
            label="Rôle"
            name="role_acteurs"
            value={formData.role_acteurs}
            onChange={handleChange}
            error={!!errors.role_acteurs}
            helperText={errors.role_acteurs}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <InputField
            required
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Ex: 033 24 992 10"
            error={!!errors.contact}
            helperText={errors.contact}
          />
        </div>
        <div className="col-md-6 mb-4">
          <InputField
            required
            label="Ouverture"
            name="ouverture"
            value={formData.ouverture}
            onChange={handleChange}
            error={!!errors.ouverture}
            helperText={errors.ouverture}
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-4">
          <InputField
            label="Interventions actuelles"
            name="interventions_actuelles"
            value={formData.interventions_actuelles}
            onChange={handleChange}
            error={!!errors.interventions_actuelles}
            multiline
            helperText={errors.interventions_actuelles}
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-4">
          <InputField
            label="Domaines d'intervention possibles"
            name="domaines_intervention_possibles"
            value={formData.domaines_intervention_possibles}
            onChange={handleChange}
            error={!!errors.domaines_intervention_possibles}
            helperText={errors.domaines_intervention_possibles}
            multiline
          />
        </div>
      </div>
    </Modal>
  );
};

export default ActeurEdit;