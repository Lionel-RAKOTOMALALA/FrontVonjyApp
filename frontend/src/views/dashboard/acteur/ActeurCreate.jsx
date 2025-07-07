import  { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField'; 
import useActeursCommuneStore from '../../../store/acteursCommuneStore';

// Schéma de validation avec Zod
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

const ActeurCreate = ({ isOpen, onClose, onSuccess }) => {
  const [acteur, setActeur] = useState({
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

  const { addActeur } = useActeursCommuneStore();

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
      acteurSchema.parse(acteur);
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

  // Vérifier si le formulaire est valide

  const handleChange = (event) => {
    const { name, value } = event.target;
    setActeur((prev) => ({ ...prev, [name]: value }));

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
      await addActeur(acteur);
      if (onSuccess) onSuccess('Acteur créé avec succès !');
      resetForm();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setSubmitError(err.message || "Une erreur est survenue lors de la création.");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la création.", 'error');
    }
  };

  const resetForm = () => {
    setActeur({
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
      title="Créer un acteur"
      btnLabel="Créer"
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
            value={acteur.nom}
            onChange={handleChange}
            error={!!errors.nom}
            helperText={errors.nom}
          />
        </div>
        <div className="col-md-6 mb-4 mt-2">
          <InputField
            label="Prénom"
            name="prenom"
            value={acteur.prenom}
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
            value={acteur.commune_id}
            onChange={handleChange}
            options={communes.map((commune) => ({
              label: commune.nomCommune,
              value: commune.id.toString(),
            }))}
            disabled={loading}
            error={!!errors.commune_id}
            helperText={errors.commune_id}
          />
        </div>
        <div className="col-md-6 mb-4">
          <InputField
            required
            label="Rôle"
            name="role_acteurs"
            value={acteur.role_acteurs}
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
            value={acteur.contact}
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
            value={acteur.ouverture}
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
            value={acteur.interventions_actuelles}
            onChange={handleChange} 
            error={!!errors.interventions_actuelles}
            helperText={errors.interventions_actuelles}
            multiline
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-4">
          <InputField
            label="Domaines d'intervention possibles"
            name="domaines_intervention_possibles"
            value={acteur.domaines_intervention_possibles}
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

export default ActeurCreate;