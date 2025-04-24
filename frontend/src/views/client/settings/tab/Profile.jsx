"use client"

import { Box, Button } from "@mui/material"
import InputField from "../../../../components/ui/form/InputField"
import useUserStore from "../../../../store/userStore" // Import du store

const ProfilTab = ({ formData, initialFormData, handleChange, onClose, onSnackbar }) => {
  const { user, updateUser } = useUserStore() // Récupération des données utilisateur et de la méthode updateUser
  console.log("ProfilTab - Données utilisateur:", formData) // Vérification des données utilisateur;
  
  // Vérifie si les données du formulaire ont été modifiées
  const isModified = JSON.stringify(formData) !== JSON.stringify(initialFormData)

  const handleSubmit = async () => {
    if (!user) {
      onSnackbar(true, "error", "Utilisateur non connecté")
      return
    }

    try {
      // Appel à la méthode updateUser du store
      const result = await updateUser(formData)

      if (result.success) {
        onSnackbar(true, "success", "Profil modifié avec succès")
        onClose()
      } else {
        onSnackbar(true, "error", "Erreur lors de la modification du profil")
      }
    } catch (error) {
      console.error("Erreur lors de la modification du profil:", error)
      onSnackbar(true, "error", "Erreur inattendue")
    }
  }

  return (
    <>
      <Box>
        <InputField
          className="mb-4 mt-3"
          label="Nom complet"
          name="namefull" // Correspondance avec le champ backend
          required={false}
          value={formData.namefull || ""} // Gestion des valeurs nulles ou undefined
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