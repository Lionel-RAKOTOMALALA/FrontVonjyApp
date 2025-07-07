import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import { z } from "zod";

// Schéma de validation Zod pour l'édition
const userEditSchema = z.object({
  nameFull: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  avatar: z.any().optional(),
});

function UserEdit({ isOpen, chauffeur, onChange, onSave, onClose }) {
  // Fallback si `chauffeur` est null/undefined
  const validChauffeur = chauffeur || {
    nameFull: '',
    email: '',
    avatar: null,
  };
 
  // États pour la validation
  const [formErrors, setFormErrors] = useState({});
  const [avatarError, setAvatarError] = useState(null);

  // Validation personnalisée des fichiers image
  const validateImageFile = (file) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'image/webp', 'image/bmp', 'image/svg+xml'
    ];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    if (!allowedTypes.includes(file.type)) {
      return `Le type de fichier ${file.type} n'est pas autorisé. Seules les images sont acceptées.`;
    }
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return `L'extension ${fileExtension} n'est pas autorisée.`;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Le fichier est trop volumineux (5MB maximum).';
    }
    return null;
  };

  // Fonction de validation complète du formulaire
  const validateForm = () => {
    const result = userEditSchema.safeParse(validChauffeur);
    let hasErrors = false;
    const errors = {};

    // Validation avec Zod
    if (!result.success) {
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      hasErrors = true;
    }

    // Validation de l'avatar
    if (avatarError) {
      errors.avatar = avatarError;
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  // Gère la sauvegarde avec validation
  const handleSave = () => {
    // Validation uniquement à la soumission
    const isValid = validateForm();
    
    if (!isValid) {
      return; // Arrêter si le formulaire n'est pas valide
    }

    console.log('Données du user modifiées:', validChauffeur);
    
    // Appeler la fonction onSave du parent si elle existe
    if (onSave) {
      onSave(validChauffeur);
    }
  };

  // Gère les changements pour les champs texte du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({
      ...validChauffeur,
      [name]: value
    });
  };

  // Gère le changement de fichier avatar avec validation
  const handleAvatarDrop = (acceptedFiles, rejectedFiles) => {
    setAvatarError(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      let errorMessage = 'Fichier non autorisé';

      if (rejectedFile.errors) {
        const error = rejectedFile.errors[0];
        if (error.code === 'file-invalid-type') {
          errorMessage = 'Seules les images sont autorisées (JPEG, PNG, GIF, WebP, BMP, SVG)';
        } else if (error.code === 'file-too-large') {
          errorMessage = 'Le fichier est trop volumineux (5MB maximum)';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      setAvatarError(errorMessage);
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validationError = validateImageFile(file);
      if (validationError) {
        setAvatarError(validationError);
        return;
      }
      onChange({
        ...validChauffeur,
        avatar: Object.assign(file, { preview: URL.createObjectURL(file) })
      });
      setAvatarError(null);
    }
  };

  // Nettoyer l'URL de l'avatar à la fermeture et reset les erreurs
  const handleClose = () => {
    if (validChauffeur.avatar && validChauffeur.avatar.preview) {
      URL.revokeObjectURL(validChauffeur.avatar.preview);
    }
    onClose && onClose();
    setFormErrors({});
    setAvatarError(null);
  };

  // Reset des erreurs quand le modal s'ouvre avec de nouvelles données
  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
      setAvatarError(null);
    }
  }, [isOpen]);

  // Destructuration pour faciliter l'accès aux champs
  const { nameFull = '', email = '', avatar = null } = validChauffeur;

  return (
    <Modal
      title="Modifier un utilisateur"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={handleClose}
    >
      <div className="row">
        <div className="col mb-2 mt-2 text-center">
          <UploadAvatar
            file={avatar}
            onDrop={handleAvatarDrop}
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/gif': ['.gif'],
              'image/webp': ['.webp'],
              'image/bmp': ['.bmp'],
              'image/svg+xml': ['.svg'],
            }}
            maxSize={5 * 1024 * 1024} // 5MB
            error={!!avatarError}
            helperText={avatarError && (
              <div className="text-danger small mt-1">
                {avatarError}
              </div>
            )}
            user={validChauffeur}
          />
        </div>
      </div>
      {/* Champ Nom complet */}
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom complet"
            name="nameFull"
            value={nameFull}
            onChange={handleChange}
            error={!!formErrors.nameFull}
            helperText={formErrors.nameFull}
          />
        </div>
      </div>
      {/* Champ Email */}
      <div className="row">
        <div className="col mb-0">
          <InputField
            required
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </div>
      </div>
    </Modal>
  );
}

export default UserEdit;