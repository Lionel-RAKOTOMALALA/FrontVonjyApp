import { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';
import RadioGroupField from "../../../components/ui/form/RadioGroupField";
import useResponsableStore from '../../../store/responsableStore';

// Schéma zod pour la validation
const responsableSchema = z.object({
  fokotany_id: z.string().min(1, "Le fokotany est requis"),
  classe_responsable: z.string().min(1, "La classe est requise"),
  nom_responsable: z.string().min(1, "Le nom est requis"),
  prenom_responsable: z.string().optional(),
  contact_responsable: z.string().optional(),
  fonction: z.string().min(1, "La fonction est requise"),
  formation_acquise: z.enum(["true", "false"]),
});

const ResponsableEdit = ({ isOpen, responsable, onSave, onClose }) => {
  const { updateResponsable } = useResponsableStore();
  const [fokotanys, setFokotanys] = useState([]);
  const [errors, setErrors] = useState({});
  const [, setSubmitError] = useState('');
  const [loadingFokotanys, setLoadingFokotanys] = useState(false);

  const [localResponsable, setLocalResponsable] = useState({
    fokotany_id: '',
    classe_responsable: '',
    nom_responsable: '',
    prenom_responsable: '',
    contact_responsable: '',
    fonction: '',
    formation_acquise: 'true',
  });

  // Initialize localResponsable state when responsable prop changes
  useEffect(() => {
    if (responsable) {
      setLocalResponsable({
        fokotany_id: responsable.fokotany?.id?.toString() || '',
        classe_responsable: responsable.classe_responsable || '',
        nom_responsable: responsable.nom_responsable || '',
        prenom_responsable: responsable.prenom_responsable || '',
        contact_responsable: responsable.contact_responsable || '',
        fonction: responsable.fonction || '',
        formation_acquise: responsable.formation_acquise ? 'true' : 'false',
      });
      // Reset errors when new responsable is loaded
      setErrors({});
      setSubmitError('');
    }
  }, [responsable]);

  // Fetch fokotanys
  useEffect(() => {
    const fetchFokotanys = async () => {
      setLoadingFokotanys(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/fokotany/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des fokotanys.');
        }
        const data = await response.json();
        setFokotanys(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des fokotanys :', err);
        setErrors((prev) => ({ ...prev, fokotany_id: 'Impossible de charger les fokotanys.' }));
      } finally {
        setLoadingFokotanys(false);
      }
    };

    fetchFokotanys();
  }, []);

  // Validation d'un champ individuel
  const validateField = (name, value) => {
    try {
      responsableSchema.pick({ [name]: true }).parse({ [name]: value });
      return "";
    } catch (err) {
      return err.errors?.[0]?.message || "";
    }
  };

  // Gestion du changement de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalResponsable((prev) => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError('');
  };

  // Validation globale du formulaire
  const isFormValid = responsableSchema.safeParse(localResponsable).success;

  const handleSave = async () => {
    try {
      // Validation complète avant sauvegarde
      responsableSchema.parse(localResponsable);

      const payload = {
        ...localResponsable,
        formation_acquise: localResponsable.formation_acquise === 'true',
      };
 

      await updateResponsable(responsable.id, payload);
      if (onSave) onSave('Responsable modifié avec succès !');
      onClose();
    } catch (err) {
      if (err.errors) {
        // Erreurs zod
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Erreur lors de la mise à jour du responsable :', err);
        setSubmitError(err.message || 'Une erreur est survenue lors de la modification.');
      }
    }
  };

  return (
    <Modal
      title="Modifier un responsable"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          {loadingFokotanys ? (
            <p>Chargement des fokotanys...</p>
          ) : fokotanys.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={localResponsable.fokotany_id}
              onChange={handleChange}
              options={fokotanys.map((fokotany) => ({
                value: fokotany.id.toString(),
                label: fokotany.nomFokotany,
              }))}
              placeholder="Choisissez un fokotany"
              error={!!errors.fokotany_id}
              helperText={errors.fokotany_id}
            />
          ) : (
            <p className="text-danger">Aucun fokotany disponible.</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Classe Responsable"
            name="classe_responsable"
            value={localResponsable.classe_responsable}
            onChange={handleChange}
            error={!!errors.classe_responsable}
            helperText={errors.classe_responsable}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du Responsable"
            name="nom_responsable"
            value={localResponsable.nom_responsable}
            onChange={handleChange}
            error={!!errors.nom_responsable}
            helperText={errors.nom_responsable}
          />
        </div>
        <div className="col mb-3">
          <InputField
            required={false}
            label="Prénom du Responsable"
            name="prenom_responsable"
            value={localResponsable.prenom_responsable}
            onChange={handleChange}
            error={!!errors.prenom_responsable}
            helperText={errors.prenom_responsable}
          />
        </div>
      </div> 
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Fonction"
            name="fonction"
            value={localResponsable.fonction}
            onChange={handleChange}
            error={!!errors.fonction}
            helperText={errors.fonction}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required={false}
            label="Contact"
            name="contact_responsable"
            value={localResponsable.contact_responsable}
            onChange={handleChange}
            error={!!errors.contact_responsable}
            helperText={errors.contact_responsable}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <RadioGroupField
            label="Formation Acquise"
            name="formation_acquise"
            value={localResponsable.formation_acquise}
            onChange={handleChange}
            options={[
              { value: 'true', label: 'Oui' },
              { value: 'false', label: 'Non' },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ResponsableEdit;