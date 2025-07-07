// ChauffeurCreate.js
import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import { z } from "zod";

// Schéma de validation Zod
const userSchema = z.object({
  nameFull: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  avatar: z.any().optional(),
});

const UserCreate = ({ isOpen, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    nameFull: '',
    email: '',
    avatar: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [avatarError, setAvatarError] = useState(null);

  // Gère les changements pour les champs texte du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
      setFormData(prev => ({
        ...prev,
        avatar: Object.assign(file, { preview: URL.createObjectURL(file) })
      }));
      setAvatarError(null);
    }
  };

  // Fonction de validation complète du formulaire
  const validateForm = () => {
    const result = userSchema.safeParse(formData);
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

  // Gère la sauvegarde des données du formulaire
  const handleSave = () => {
    // Validation uniquement à la soumission
    const isValid = validateForm();
    
    if (!isValid) {
      return; // Arrêter si le formulaire n'est pas valide
    }

    console.log('Données du user:', formData);
    
    // Appeler la fonction onSave du parent si elle existe
    if (onSave) {
      onSave(formData);
    }
  };

  // Nettoyer l'URL de l'avatar à la fermeture et reset le formulaire
  const handleClose = () => {
    if (formData.avatar && formData.avatar.preview) {
      URL.revokeObjectURL(formData.avatar.preview);
    }
    onClose && onClose();
    resetForm();
  };

  const resetForm = () => {
    // Reset form
    setFormData({
      nameFull: '',
      email: '',
      avatar: null,
    });
    setFormErrors({});
    setAvatarError(null);
  };

  return (
    <Modal
      title="Créer un utilisateur"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={handleClose}
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-2 mt-2 text-center">
          <UploadAvatar
            file={formData.avatar}
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
            user={formData}
          />
        </div>
      </div>
      {/* Champ Nom */}
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom complet"
            name="nameFull"
            value={formData.nameFull}
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
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UserCreate;