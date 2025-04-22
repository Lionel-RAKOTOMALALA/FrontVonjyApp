"use client"

import { Box, Button } from "@mui/material"
import InputField from "../../../../components/ui/form/InputField"

const ProfilTab = ({ formData, initialFormData, handleChange, onClose, onSnackbar }) => {
  // Vérifie si les données du formulaire ont été modifiées
  const isModified = JSON.stringify(formData) !== JSON.stringify(initialFormData)

  const handleSubmit = () => {
    // Traitement ici
    console.log("Profil modifié:", formData)
    onSnackbar(true, "success", "Profil modifié avec succès")
    onClose()
  }

  return (
    <>
      <Box>
        <InputField
          className="mb-4 mt-3"
          label="Nom complet"
          name="nom_complet"
          required={false}
          value={formData.nom_complet || ""} // Gestion des valeurs nulles ou undefined
          onChange={(e) => handleChange(e)} // Assurez-vous que la fonction handleChange est correctement propagée
        />
        <InputField
          className="mb-4"
          label="Email"
          name="email"
          type="email"
          value={formData.email || ""} // Gestion des valeurs nulles ou undefined
          onChange={(e) => handleChange(e)}
          required={false}
        />
      </Box>
      <Box className="d-flex gap-3 justify-content-end mb-4">
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            borderRadius: '8px',
            fontWeight: '700',
            color: '#1C252E',
            borderColor: 'rgba(145, 158, 171, 0.35)',
            '&:hover': {
              bgcolor: 'rgba(145, 158, 171, 0.08)',
              borderColor: 'rgba(145, 158, 171, 0.35)',
            },
          }}
        >
          Fermer
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isModified} // Désactiver le bouton si aucune modification
          sx={{
            bgcolor: '#1C252E',
            textTransform: 'none',
            fontSize: '0.875rem',
            borderRadius: '8px',
            fontWeight: '700',
            '&:hover': { bgcolor: '#454F5B' },
          }}
        >
          Modifier
        </Button>
      </Box>
    </>
  )
}

export default ProfilTab
