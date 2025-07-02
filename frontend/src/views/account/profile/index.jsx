"use client"

import { useState, useEffect } from 'react'
import Modal from "../../../components/ui/Modal"
import InputField from "../../../components/ui/form/InputField"
import useUserStore from '../../../store/userStore' // Ajustez le chemin selon votre structure
import { z } from "zod"
import SnackbarAlert from "../../../components/ui/SnackbarAlert"

// Schéma de validation Zod
const profileSchema = z.object({
  namefull: z.string().min(1, "Le nom complet est requis"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
})

const Profile = ({ isOpen, onClose }) => {
  const { user, loading, error, fetchUser, updateUser } = useUserStore()

  // États locaux pour le formulaire
  const [formData, setFormData] = useState({
    namefull: '',
    email: ''
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [formErrors, setFormErrors] = useState({})

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
        email: user.email || ''
      })
    }
  }, [user])

  // Validation du formulaire avec zod
  useEffect(() => {
    const result = profileSchema.safeParse(formData)
    if (!result.success) {
      const errors = {}
      result.error.errors.forEach(err => {
        errors[err.path[0]] = err.message
      })
      setFormErrors(errors)
      setIsFormValid(false)
    } else {
      setFormErrors({})
      setIsFormValid(true)
    }
  }, [formData])

  // Gérer les changements dans les champs
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && (
          <>
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