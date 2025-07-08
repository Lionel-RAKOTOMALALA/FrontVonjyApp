"use client"

import { useState } from "react"
import { z } from "zod"
import Modal from "../../../components/ui/Modal"
import SnackbarAlert from "../../../components/ui/SnackbarAlert"
import InputField from "../../../components/ui/form/InputField"
import useUserStore from "../../../store/userStore"
import jwtDecode from "jwt-decode"
import { Checkbox, FormControlLabel } from "@mui/material"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string()
    .min(6, "6 caractères minimum")
    .regex(/[A-Za-z]/, "Au moins une lettre")
    .regex(/[0-9]/, "Au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

const Securite = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  // Utiliser le store utilisateur
  const { user, accessToken } = useUserStore()

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur du mot de passe actuel quand l'utilisateur tape
    if (name === 'currentPassword' && errors.currentPassword) {
      setErrors(prev => ({ ...prev, currentPassword: '' }))
    }
  }

  const validate = () => {
    try {
      passwordSchema.parse(form)
      setErrors({})
      return true
    } catch (err) {
      if (err.errors) {
        const errs = {}
        err.errors.forEach(e => {
          errs[e.path[0]] = e.message
        })
        setErrors(errs)
      }
      return false
    }
  }

  const handleSave = async () => {
    if (!validate()) return

    setLoading(true)

    try {
      // Récupérer l'uid depuis le store utilisateur ou décoder le token
      let uid = user?.uid

      if (!uid && accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken)
          uid = decodedToken.uid
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error)
        }
      }

      console.log('User from store:', user)
      console.log('UID found:', uid)
      console.log('AccessToken exists:', !!accessToken)

      if (!accessToken) {
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Token d\'authentification manquant'
        })
        return
      }

      if (!uid) {
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'ID utilisateur manquant'
        })
        return
      }

      const requestBody = {
        current_password: form.currentPassword,
        new_password: form.newPassword
      }

      console.log('Request body:', requestBody)

      // Appeler l'API update-profile pour changer le mot de passe
      const response = await fetch(`http://localhost:8000/api/auth/update-profile/${uid}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('Response status:', response.status)
      console.log('Response data:', data)

      if (!response.ok) {
        // Gérer l'erreur de mot de passe incorrect
        if (response.status === 400 || response.status === 401) {
          setErrors(prev => ({
            ...prev,
            currentPassword: 'Mot de passe actuel incorrect'
          }))
          return
        }
        throw new Error(data.message || data.detail || 'Une erreur est survenue')
      }

      setSnackbar({
        open: true,
        severity: 'success',
        message: data.message || 'Mot de passe modifié avec succès'
      })
      onClose()
      resetForm()

    } catch (error) {
      console.error('Error in handleSave:', error)
      setSnackbar({
        open: true,
        severity: 'error',
        message: error.message || 'Une erreur est survenue'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setErrors({})
    setShowPasswords(false)
  }

  return (
    <>
      <Modal
        maxWidth="450px"
        title="Securité"
        btnLabel="Modifier"
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        resetForm={resetForm}
        loading={loading}
      >
        <div className="row">
          <div className="col mt-2">
            <InputField
              label="Mot de passe actuel"
              name="currentPassword"
              type={showPasswords ? "text" : "password"}
              value={form.currentPassword}
              onChange={e => handleChange('currentPassword', e.target.value)}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mt-3">
            <InputField
              label="Nouveau mot de passe"
              name="newPassword"
              type={showPasswords ? "text" : "password"}
              value={form.newPassword}
              onChange={e => handleChange('newPassword', e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mt-3">
            <InputField
              label="Confirmer le nouveau mot de passe"
              name="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={form.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mt-3 px-3">
            <FormControlLabel
              control={
                <Checkbox
                  id="showPasswords"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  disabled={loading}
                  size="small"
                  sx={{
                    color: "rgba(0,0,0,0.5)",
                    "&.Mui-checked": {
                      color: "rgba(254, 201, 31, 1)",
                    },
                  }}
                />
              }
              label={<p style={{ fontSize: "0.75rem", color:"#616161" }}>Afficher les mots de passe</p>}
            />
          </div>
        </div>
      </Modal>
      <SnackbarAlert
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        setOpen={handleCloseSnackbar}
      />
    </>
  )
}

export default Securite