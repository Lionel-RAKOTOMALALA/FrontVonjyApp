"use client"

import { useState, useEffect } from 'react'
import Modal from "../../../components/ui/Modal"
import InputField from "../../../components/ui/form/InputField"
import useUserStore from '../../../store/userStore' // Ajustez le chemin selon votre structure
import { z } from "zod"
import SnackbarAlert from "../../../components/ui/SnackbarAlert"
import UploadAvatar from "../../../components/upload/UploadAvatar"

// Schéma de validation Zod
const profileSchema = z.object({
  namefull: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  avatar: z.any().optional(), // Ajout du champ avatar
})

const Profile = ({ isOpen, onClose }) => {
  const { user, loading, error, fetchUser, updateUser } = useUserStore()

  // États locaux pour le formulaire
  const [formData, setFormData] = useState({
    namefull: '',
    email: '',
    avatar: null, // Ajout du champ avatar
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [avatarError, setAvatarError] = useState(null) // État pour l'erreur d'avatar

  // États pour la Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    if (isOpen && !user) {
      fetchUser()
    }
  }, [isOpen, user, fetchUser])

  // Mettre à jour le formulaire quand les données utilisateur changent
  useEffect(() => {
    if (user) {
      setFormData({
        namefull: user.namefull || user.full_name || user.name || '',
        email: user.email || '',
        avatar: null // Reset avatar à null au chargement
      })
    }
  }, [user])

  // Validation du formulaire avec zod + validation de l'avatar
  useEffect(() => {
    const result = profileSchema.safeParse(formData)
    let hasErrors = false
    const errors = {}

    if (!result.success) {
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message
      })
      hasErrors = true
    }

    // Validation de l'avatar
    if (avatarError) {
      errors.avatar = avatarError
      hasErrors = true
    }

    setFormErrors(errors)
    setIsFormValid(!hasErrors)
  }, [formData, avatarError])

  // Gérer les changements dans les champs
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validation personnalisée des fichiers image
  const validateImageFile = (file) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/webp', 'image/bmp', 'image/svg+xml'
    ];
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    
    // Vérifier le type MIME
    if (!allowedTypes.includes(file.type)) {
      return `Le type de fichier ${file.type} n'est pas autorisé. Seules les images sont acceptées.`;
    }
    
    // Vérifier l'extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return `L'extension ${fileExtension} n'est pas autorisée.`;
    }
    
    // Vérifier la taille (optionnel - 5MB max)
    const maxSize = 1 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Le fichier est trop volumineux (5MB maximum).';
    }
    
    return null;
  };

  // Gérer le changement de fichier avatar avec validation
  const handleAvatarDrop = (acceptedFiles, rejectedFiles) => {
    // Réinitialiser l'erreur d'avatar
    setAvatarError(null);

    // Gérer les fichiers rejetés
    if (rejectedFiles.length > 0) {
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

    // Gérer les fichiers acceptés
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validation supplémentaire côté client
      const validationError = validateImageFile(file);
      if (validationError) {
        setAvatarError(validationError);
        return;
      }

      // Fichier valide, l'ajouter au formulaire
      setFormData(prev => ({
        ...prev,
        avatar: Object.assign(file, { preview: URL.createObjectURL(file) })
      }));
      
      // Réinitialiser l'erreur d'avatar
      setAvatarError(null);
    }
  };

  // Gérer la sauvegarde
  const handleSave = async () => {
    if (!isFormValid) return

    try {
      const result = await updateUser(formData)

      if (result?.success) {
        setSnackbarMessage('Profil mis à jour avec succès')
        setSnackbarSeverity('success')
        setOpenSnackbar(true)
        onClose()
        fetchUser()
      } else {
        setSnackbarMessage(result?.error || 'Erreur lors de la mise à jour')
        setSnackbarSeverity('error')
        setOpenSnackbar(true)
      }
    } catch (err) {
      setSnackbarMessage('Erreur lors de la sauvegarde')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }
  } 

  // Gérer la fermeture du modal
  const handleClose = () => {
    // Nettoyer les URLs d'objet pour éviter les fuites mémoire
    if (formData.avatar && formData.avatar.preview) {
      URL.revokeObjectURL(formData.avatar.preview);
    }
    onClose()
  }

  return (
    <>
      <Modal
        maxWidth="450px"
        title="Profile"
        btnLabel="Modifier"
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        isFormValid={isFormValid} 
      >
        {loading && (
          <div className="text-center py-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        )}
 
        {!loading && (
          <>
            {/* Champ d'upload d'avatar avec UploadAvatar */}
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
                  user={user}
                />
              </div>
            </div>

            <div className="row">
              <div className="col mb-2 mt-2">
                <InputField
                  label="Nom complet"
                  name="namefull"
                  value={formData.namefull}
                  onChange={(e) => handleInputChange('namefull', e.target.value)}
                  error={!!formErrors.namefull}
                  helperText={formErrors.namefull}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col mb-0 mt-2">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  required
                />
              </div>
            </div>
          </>
        )}
      </Modal>
      <SnackbarAlert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  )
}

export default Profile