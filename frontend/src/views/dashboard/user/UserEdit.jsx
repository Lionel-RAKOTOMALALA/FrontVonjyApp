import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import { z } from "zod";
import useSimpleUsersStore from '../../../store/simpleUsersStore';
import { validateImageFile, getProfileImageUrl } from '../../../utils/imageUtils';

// Schéma de validation Zod pour l'édition
const userEditSchema = z.object({
  namefull: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  photo_profil: z.any().optional(),
});

function UserEdit({ isOpen, chauffeur, onSave, onClose }) {
  // Utiliser le store
  const { updateSimpleUser } = useSimpleUsersStore();

  // Fallback si `chauffeur` est null/undefined
  const validChauffeur = chauffeur || {
    namefull: '',
    email: '',
    photo_profil: null,
  };

  // État local pour les données du formulaire
  const [formData, setFormData] = useState(validChauffeur);
  const [formErrors, setFormErrors] = useState({});
  const [avatarError, setAvatarError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mettre à jour les données du formulaire quand l'utilisateur change
  useEffect(() => {
    if (chauffeur) {
      setFormData({
        uid: chauffeur.uid,
        namefull: chauffeur.namefull || '',
        email: chauffeur.email || '',
        photo_profil: chauffeur.photo_profil ? {
          name: chauffeur.photo_profil.split('/').pop(), // Nom du fichier
          preview: getProfileImageUrl(chauffeur.photo_profil), // URL de prévisualisation
          isExisting: true // Marqueur pour indiquer que c'est une image existante
        } : null,
      });
    }
  }, [chauffeur]);

  // Fonction de validation complète du formulaire
  const validateForm = () => {
    const result = userEditSchema.safeParse(formData);
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

  // Gère la sauvegarde avec validation
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
      };

      // Si une nouvelle photo est sélectionnée, l'ajouter aux données
      if (formData.photo_profil && formData.photo_profil instanceof File) {
        userData.photo_profil = formData.photo_profil;
      }

      console.log('Envoi des données de mise à jour:', userData);

      const result = await updateSimpleUser(formData.uid, userData);
      
      if (result.success) {
        console.log('Mise à jour réussie:', result.data);
        // Appeler la fonction onSave du parent si elle existe
        if (onSave) {
          onSave(result.data);
        }
        handleClose();
      } else {
        console.error('Erreur de mise à jour:', result.error);
        // Gérer les erreurs de l'API
        setFormErrors({
          submit: result.error || 'Erreur lors de la modification de l\'utilisateur'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setFormErrors({
        submit: 'Erreur lors de la modification de l\'utilisateur'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gère les changements pour les champs texte du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
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

  // Nettoyer l'URL de l'avatar à la fermeture et reset les erreurs
  const handleClose = () => {
    // Nettoyer l'URL de prévisualisation si c'est un nouveau fichier
    if (formData.photo_profil && formData.photo_profil.preview && !formData.photo_profil.isExisting) {
      URL.revokeObjectURL(formData.photo_profil.preview);
    }
    onClose && onClose();
    setFormErrors({});
    setAvatarError(null);
    setIsSubmitting(false);
  };

  // Reset des erreurs quand le modal s'ouvre avec de nouvelles données
  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
      setAvatarError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Modal
      title="Modifier un utilisateur"
      btnLabel={isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
      isOpen={isOpen}
      onSave={handleSave}
      onClose={handleClose}
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
      {/* Champ Nom complet */}
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
}

export default UserEdit;