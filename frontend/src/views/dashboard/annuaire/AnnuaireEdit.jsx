import { useState, useEffect } from 'react';
import { z } from 'zod';
import { TextField } from '@mui/material';
import Modal from '../../../components/ui/Modal';

// Schéma de validation Zod (identique à AnnuaireCreate)
const annuaireSchema = z.object({
    acteurs: z.string()
        .min(1, "Le champ Acteurs est requis")
        .trim(),
    personne_reference: z.string()
        .trim()
        .min(1, "Le champ Personne de référence est requis"),
    contacts: z.string()
        .trim()
        .min(1, "Le champ Contacts est requis"),
    interventions_actuelles: z.string()
        .trim()
        .min(1, "Le champ Interventions actuelles est requis"),
    domaines_intervention_possibles: z.string()
        .trim()
        .min(1, "Le champ Domaines d'intervention possibles est requis"),
    ouverture: z.string()
        .trim()
        .min(1, "Le champ Ouverture est requis")
});

function AnnuaireEdit({ isOpen, annuaire, onChange, onSave, onClose }) {
  // Fallback si `annuaire` est null/undefined
  const validAnnuaire = annuaire || {
    acteurs: '',
    personne_reference: '',
    contacts: '',
    interventions_actuelles: '',
    domaines_intervention_possibles: '',
    ouverture: ''
  };
 
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
 
  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    onChange({
      acteurs: '',
      personne_reference: '',
      contacts: '',
      interventions_actuelles: '',
      domaines_intervention_possibles: '',
      ouverture: ''
    });
    setErrors({});
  };

  // Réinitialise les erreurs quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  // Gère les changements pour les champs texte du formulaire
  const handleChange = (name, value) => {
    onChange({ ...validAnnuaire, [name]: value });

    // Efface l'erreur pour ce champ lors de la modification
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Valide les données avec Zod
  const validateForm = () => {
    try {
      annuaireSchema.parse(validAnnuaire);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Gère la sauvegarde des données du formulaire
  const handleSave = () => {
    if (validateForm()) { 
      onSave(validAnnuaire);
    }
  };
 
  // Destructuration pour faciliter l'accès aux champs
  const { 
    acteurs = '', 
    personne_reference = '', 
    contacts = '', 
    interventions_actuelles = '', 
    domaines_intervention_possibles = '', 
    ouverture = '' 
  } = validAnnuaire;

  // Styles personnalisés MUI
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': { borderColor: '#1C252E' },
      '&.Mui-focused fieldset': { borderColor: '#1C252E' },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 'bold',
      color:'#637381',
      '&.Mui-focused': {
        fontWeight: 'bold',
        color: '#1C252E',
      },
    },
  };

  return (
    <Modal
      title="Modifier un annuaire"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      resetForm={resetForm}
      maxWidth="600px"
    >
      {/* Champ Acteurs */}
      <div className="row">
        <div className="col mb-3 mt-2"> 
          <TextField
            label="Acteurs"
            fullWidth
            required
            sx={textFieldStyles}
            value={acteurs}
            onChange={(e) => handleChange('acteurs', e.target.value)}
            error={!!errors.acteurs}
            helperText={errors.acteurs}
          />
        </div>
      </div>

      {/* Champ Personne de référence */}
      <div className="row">
        <div className="col mb-3"> 
          <TextField
            label="Personne de référence"
            fullWidth
            required
            sx={textFieldStyles}
            value={personne_reference}
            onChange={(e) => handleChange('personne_reference', e.target.value)}
            error={!!errors.personne_reference}
            helperText={errors.personne_reference}
          />
        </div> 
      </div>

      {/* Champ Contacts */}
      <div className="row">
        <div className="col mb-3">
          <TextField
            label="Contacts"
            fullWidth
            required
            sx={textFieldStyles}
            value={contacts}
            onChange={(e) => handleChange('contacts', e.target.value)}
            error={!!errors.contacts}
            helperText={errors.contacts}
          />
        </div>
      </div>

      {/* Champ Interventions actuelles */}
      <div className="row">
        <div className="col mb-3">
          <TextField
            label="Interventions actuelles"
            fullWidth
            required
            multiline
            rows={3}
            sx={textFieldStyles}
            value={interventions_actuelles}
            onChange={(e) => handleChange('interventions_actuelles', e.target.value)}
            error={!!errors.interventions_actuelles}
            helperText={errors.interventions_actuelles}
          />
        </div>
      </div>

      {/* Champ Domaines d'intervention possibles */}
      <div className="row">
        <div className="col mb-3">
          <TextField
            label="Domaines d'intervention possibles"
            fullWidth
            required
            multiline
            rows={4}
            sx={textFieldStyles}
            value={domaines_intervention_possibles}
            onChange={(e) => handleChange('domaines_intervention_possibles', e.target.value)}
            error={!!errors.domaines_intervention_possibles}
            helperText={errors.domaines_intervention_possibles}
          />
        </div>
      </div>

      {/* Champ Ouverture */}
      <div className="row">
        <div className="col mb-0">
          <TextField
            label="Ouverture"
            fullWidth
            required
            sx={textFieldStyles}
            value={ouverture}
            onChange={(e) => handleChange('ouverture', e.target.value)}
            error={!!errors.ouverture}
            helperText={errors.ouverture}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AnnuaireEdit;