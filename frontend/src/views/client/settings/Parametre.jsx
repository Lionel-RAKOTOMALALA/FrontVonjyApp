"use client"

import { useState } from "react"
import Modal from "../../../components/ui/Modal"
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Avatar,
  Button,
  Typography,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

const Parametre = ({ isOpen, onClose }) => {
  const [tabValue, setTabValue] = useState(0)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmationMotDePasse: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState({
    ancien: false,
    nouveau: false,
    confirmation: false,
  })

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Validate password fields on change
    if (name === "nouveauMotDePasse" || name === "confirmationMotDePasse") {
      validatePassword()
    }
  }

  const validatePassword = () => {
    const newErrors = {}
    const { nouveauMotDePasse, confirmationMotDePasse } = formData

    if (nouveauMotDePasse) {
      if (nouveauMotDePasse.length < 8) {
        newErrors.nouveauMotDePasse = "Le mot de passe doit comporter au moins 8 caractères."
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(nouveauMotDePasse)) {
        newErrors.nouveauMotDePasse = "Le mot de passe doit contenir au moins un symbole."
      } else if (!/\d/.test(nouveauMotDePasse)) {
        newErrors.nouveauMotDePasse = "Le mot de passe doit contenir au moins un chiffre."
      } else if (!/[A-Z]/.test(nouveauMotDePasse)) {
        newErrors.nouveauMotDePasse = "Le mot de passe doit contenir au moins une lettre majuscule."
      }
    }

    if (nouveauMotDePasse && confirmationMotDePasse && nouveauMotDePasse !== confirmationMotDePasse) {
      newErrors.confirmationMotDePasse = "Les mots de passe doivent correspondre."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (tabValue === 1) {
      const isValid = validatePassword()
      if (!isValid) return
    }

    // Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
    console.log("Données soumises:", formData)
    onClose()
  }

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    })
  }

  const getInitial = () => {
    return formData.nom ? formData.nom.charAt(0).toUpperCase() : "?"
  }

  const getRandomColor = () => {
    const colors = ["#F44336", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#3F51B5"]
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
  }

  return (
    <Modal title="Paramètres" btnLabel="Créer" isOpen={isOpen} maxWidth="435px" onClose={onClose}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" aria-label="paramètres tabs">
            <Tab label="Profile" />
            <Tab label="Sécurité" />
          </Tabs>
        </Box>

        {/* Onglet Profile */}
        {tabValue === 0 && (
          <Box sx={{ p: 1 }}> 

            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
          </Box>
        )}

        {/* Onglet Sécurité */}
        {tabValue === 1 && (
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              label="Ancien mot de passe"
              name="ancienMotDePasse"
              type={showPassword.ancien ? "text" : "password"}
              value={formData.ancienMotDePasse}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleTogglePasswordVisibility("ancien")} edge="end">
                      {showPassword.ancien ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              name="nouveauMotDePasse"
              type={showPassword.nouveau ? "text" : "password"}
              value={formData.nouveauMotDePasse}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.nouveauMotDePasse}
              helperText={errors.nouveauMotDePasse}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleTogglePasswordVisibility("nouveau")} edge="end">
                      {showPassword.nouveau ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirmation du mot de passe"
              name="confirmationMotDePasse"
              type={showPassword.confirmation ? "text" : "password"}
              value={formData.confirmationMotDePasse}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.confirmationMotDePasse}
              helperText={errors.confirmationMotDePasse}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleTogglePasswordVisibility("confirmation")} edge="end">
                      {showPassword.confirmation ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormHelperText>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Le mot de passe doit comporter au moins 8 caractères, un symbole, un chiffre et une lettre majuscule.
              </Typography>
            </FormHelperText>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default Parametre
