"use client"

import { useState } from "react"
import { z } from "zod"
import Modal from "../../../components/ui/Modal"
import SnackbarAlert from "../../../components/ui/SnackbarAlert"
import InputField from "../../../components/ui/form/InputField"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "6 caractères minimum"),
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
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
    // Appelle ici ton API de changement de mot de passe
    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Mot de passe modifié avec succès'
    })
    onClose()
    resetForm()
  }

  const resetForm = () =>{
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setErrors({}) 
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
      >
        <div className="row">
          <div className="col mt-2">
            <InputField
              label="Mot de passe actuel"
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={e => handleChange('currentPassword', e.target.value)}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col mt-3">
            <InputField
              label="Nouveau mot de passe"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={e => handleChange('newPassword', e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col mt-3">
            <InputField
              label="Confirmer le nouveau mot de passe"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
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