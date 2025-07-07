// ChauffeurCreate.js
import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import { z } from "zod";
import useSimpleUsersStore from '../../../store/simpleUsersStore';
import { validateImageFile } from '../../../utils/imageUtils';

// Schéma de validation Zod
const userSchema = z.object({
  namefull: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  photo_profil: z.any().optional(),
});

const UserCreate = ({ isOpen, onSave, onClose }) => {
  // Utiliser le store
  const { createSimpleUser } = useSimpleUsersStore();

  // État local pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    namefull: '',
    email: '',
    photo_profil: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [avatarError, setAvatarError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gère les changements pour les champs texte du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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
        photo_profil: Object.assign(file, { preview: URL.createObjectURL(file) })
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
      errors.photo_profil = avatarError;
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  };

  // Gère la sauvegarde des données du formulaire
  const handleSave = async () => {
    // Validation uniquement à la soumission
    const isValid = validateForm();
    
    if (!isValid || isSubmitting) {
      return; // Arrêter si le formulaire n'est pas valide ou si déjà en cours
    }

    setIsSubmitting(true);

    try {
      // Préparer les données pour l'API selon la logique du backend
      const userData = {
        namefull: formData.namefull,
        email: formData.email,
        password: 'defaultPassword123', // Mot de passe par défaut
        // Le rôle sera forcé à 'simple' par le backend
      };

      // Si une photo est sélectionnée, l'ajouter aux données
      if (formData.photo_profil) {
        userData.photo_profil = formData.photo_profil;
      }

      const result = await createSimpleUser(userData);
      
      console.log('Résultat de createSimpleUser:', result);
      
      if (result.success) {
        // Appeler la fonction onSave du parent si elle existe
        if (onSave) {
          onSave(result.data);
        }
        handleClose();
      } else {
        console.log('Erreur détectée:', result.error);
        // Gérer les erreurs de l'API
        setFormErrors({
          submit: result.error || 'Erreur lors de la création de l\'utilisateur'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setFormErrors({
        submit: 'Erreur lors de la création de l\'utilisateur'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nettoyer l'URL de l'avatar à la fermeture et reset le formulaire
  const handleClose = () => {
    if (formData.photo_profil && formData.photo_profil.preview) {
      URL.revokeObjectURL(formData.photo_profil.preview);
    }
    onClose && onClose();
    resetForm();
  };

  const resetForm = () => {
    // Reset form
    setFormData({
      namefull: '',
      email: '',
      photo_profil: null,
    });
    setFormErrors({});
    setAvatarError(null);
    setIsSubmitting(false);
  };

  return (
    <Modal
      title="Créer un utilisateur"
      btnLabel={isSubmitting ? "Création..." : "Créer"}
      isOpen={isOpen}
      onSave={handleSave}
      onClose={handleClose}
      maxWidth="435px"
      disabled={isSubmitting}
    >
      {/* Affichage des erreurs de soumission */}
      {formErrors.submit && (
        <div className="alert alert-danger mb-3">
          {formErrors.submit}
        </div>
      )}

      <div className="row">
        <div className="col mb-2 mt-2 text-center">
          <UploadAvatar
            file={formData.photo_profil}
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
            name="namefull"
            value={formData.namefull}
            onChange={handleChange}
            error={!!formErrors.namefull}
            helperText={formErrors.namefull}
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