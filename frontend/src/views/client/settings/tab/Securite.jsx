"use client"

import {
  Box,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  FormHelperText,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import InputField from "../../../../components/ui/form/InputField"

const SecuriteTab = ({
  formData,
  handleChange,
  errors,
  showPassword,
  handleTogglePasswordVisibility,
  onClose,
  onSnackbar,
  validatePassword,
}) => {
  const handleSubmit = () => {
    if (validatePassword()) {
      console.log("Changement de mot de passe:", formData)
      onSnackbar(true, "success", "Mot de passe modifié avec succès")
      onClose()
    } else {
      onSnackbar(true, "error", "Erreur de validation du mot de passe")
    }
  }

  return (
    <>
      <Box>
        <InputField
          sx={{mb:3, mt:2}}
          label="Ancien mot de passe"
          name="ancienMotDePasse"
          type={showPassword.ancien ? "text" : "password"}
          value={formData.ancienMotDePasse}
          onChange={handleChange}
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
        <InputField
          sx={{mb:3}} 
          fullWidth
          label="Nouveau mot de passe"
          name="nouveauMotDePasse"
          type={showPassword.nouveau ? "text" : "password"}
          value={formData.nouveauMotDePasse}
          onChange={handleChange}
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
        <InputField
          sx={{mb:3}}
          fullWidth
          label="Confirmation du mot de passe"
          name="confirmationMotDePasse"
          type={showPassword.confirmation ? "text" : "password"}
          value={formData.confirmationMotDePasse}
          onChange={handleChange}
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
        <FormHelperText sx={{ mb: 3, mx:3,textAlign:'center' }}>
          <span variant="body2" component="span" color="text.secondary">
            Le mot de passe doit comporter au moins 8 caractères, un symbole, un chiffre et une lettre majuscule.
          </span>
        </FormHelperText>
      </Box>
      <Box className="d-flex gap-3 mt-4 justify-content-end mb-4">
        <Button variant="outlined" onClick={onClose} sx={{
          textTransform: 'none', fontSize: '0.875rem', borderRadius: '8px', fontWeight: '700',
          color: '#1C252E', borderColor: 'rgba(145, 158, 171, 0.35)',
          '&:hover': {
            bgcolor: 'rgba(145, 158, 171, 0.08)',
            borderColor: 'rgba(145, 158, 171, 0.35)',
          },
        }}>
          Fermer
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
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

export default SecuriteTab
