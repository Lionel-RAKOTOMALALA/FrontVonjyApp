"use client"

import { useState, useEffect } from "react"
import Modal from "../../../components/ui/Modal"
import { Tabs, Tab, Box } from "@mui/material"
import ProfilTab from "./tab/Profile"
import SecuriteTab from "./tab/Securite"
import SnackbarAlert from "../../../components/ui/SnackbarAlert"
import useUserStore from "../../../store/userStore"

const Parametre = ({ isOpen, onClose }) => {
  const [tabValue, setTabValue] = useState(0)
  const { fetchUser, user } = useUserStore()

  useEffect(() => {
    // Ne fetch les informations utilisateur qu'une seule fois si elles ne sont pas déjà présentes
    if (!user) {
      fetchUser()
    }
    console.log("Informations de l'utilisateur connecté dans profile:", user)
  }, [user, fetchUser])

  const initialPasswordData = {
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmationMotDePasse: "",
  }

  const [profileData, setProfileData] = useState({
    nom_complet: "",
    email: "",
  })
  const [passwordData, setPasswordData] = useState(initialPasswordData)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState({
    ancien: false,
    nouveau: false,
    confirmation: false,
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  // Mettre à jour `profileData` lorsque `user` change
  useEffect(() => {
    if (user) {
      setProfileData({
        nom_complet: user.namefull || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    if (name === "nouveauMotDePasse" || name === "confirmationMotDePasse") {
      validatePassword({ ...passwordData, [name]: value })
    }
  }

  const validatePassword = (data = passwordData) => {
    const { nouveauMotDePasse, confirmationMotDePasse } = data
    const newErrors = {}

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

    if (
      nouveauMotDePasse &&
      confirmationMotDePasse &&
      nouveauMotDePasse !== confirmationMotDePasse
    ) {
      newErrors.confirmationMotDePasse = "Les mots de passe doivent correspondre."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSnackbar = (open, severity, message) => {
    setSnackbar({ open, severity, message })
  }

  const tabStyle = {
    textTransform: 'none',
    '&.Mui-selected': {
      color: '#1C252E',
      fontWeight: 'bold',
    },
  }

  const tabParentStyle = {
    boxShadow: 'inset 0 -2px 0 0 rgba(145 158 171 / 0.08)',
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      width: '100%',
      backgroundColor: '#1C252E',
    },
  }

  const handleCloseModal = () => {
    onClose()
    setTimeout(() => {
      setTabValue(0)
    }, 200)
  }

  return (
    <>
      <Modal
        maxWidth="450px"
        hideDefaultActions
        title="Paramètres"
        btnLabel="Créer"
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={tabParentStyle}
              TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
            >
              <Tab sx={tabStyle} label="Profile" />
              <Tab sx={tabStyle} label="Sécurité" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <ProfilTab
              formData={profileData}
              initialFormData={{
                nom_complet: user?.namefull || "",
                email: user?.email || "",
              }}
              handleChange={handleProfileChange}
              onClose={handleCloseModal}
              onSnackbar={handleSnackbar}
            />
          )}

          {tabValue === 1 && (
            <SecuriteTab
              formData={passwordData}
              handleChange={handlePasswordChange}
              errors={errors}
              showPassword={showPassword}
              handleTogglePasswordVisibility={handleTogglePasswordVisibility}
              onClose={handleCloseModal}
              onSnackbar={handleSnackbar}
              validatePassword={validatePassword}
            />
          )}
        </Box>
      </Modal>

      <SnackbarAlert
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        setOpen={(open) => setSnackbar({ ...snackbar, open })}
      />
    </>
  )
}

export default Parametre
