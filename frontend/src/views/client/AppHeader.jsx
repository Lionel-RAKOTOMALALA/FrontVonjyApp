"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, MenuList, MenuItem, Divider, Popover } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import VonjyLogo from "../../assets/VonjyLogo.svg"
import { Paragraphe } from "../../components/ui/TypographyVariants"
import useUserStore from "../../store/userStore"
import { useNavigate } from 'react-router-dom'
import ProfileModal from "../account/profile"
import SecuriteModal from "../account/security"
import CustomButton from "../../components/ui/CustomButton"

function AppHeader({ scrolled }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [openSecuriteModal, setOpenSecuriteModal] = useState(false)
  const { fetchUser, user, logout } = useUserStore() // Ajout de logout depuis le store
  const navigate = useNavigate()

  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleClose()
    navigate('/auth/login')
  }

  // Handlers pour ouvrir/fermer les modales
  const handleOpenProfile = () => {
    setOpenProfileModal(true)
    handleClose()
  }
  const handleCloseProfile = () => setOpenProfileModal(false)

  const handleOpenSecurite = () => {
    setOpenSecuriteModal(true)
    handleClose()
  }
  const handleCloseSecurite = () => setOpenSecuriteModal(false)

  useEffect(() => {
    // Ne fetch les informations utilisateur qu'une seule fois si elles ne sont pas déjà présentes
    if (!user) {
      fetchUser()
    }
    console.log("Informations de l'utilisateur connecté :", user)
  }, [user, fetchUser])

  return (
    <>
      <AppBar
        elevation={scrolled ? 4 : 0}
        className="z-1"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.85)", // Ajout de transparence
          color: "#000",
          transition: "all 0.3s ease",
          position: "fixed",
          boxShadow: scrolled ? "0 4px 32px 0 rgba(145, 158, 171, 0.16)" : "none",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <img
              src={VonjyLogo || "/placeholder.svg"}
              alt="Centre Vonjy Logo"
              style={{ height: "4em", marginRight: 10 }}
            />
          </Box>

          <Box display="flex" alignItems="center">
            <IconButton
              onClick={handleMenuClick}
              aria-label="User menu"
              aria-controls="user-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ bgcolor: "#fbc02d" }}>{user?.namefull?.charAt(0).toUpperCase() || "?"}</Avatar>
              <ArrowDropDownIcon className="rounded-circle border" sx={{ position: 'absolute', top: '34px', right: '8px', width: '16px', height: '16px', backgroundColor: "#fff" }} />
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  borderRadius: "10px",
                  boxShadow:
                    "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px;",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(20px)",
                  overflow: "visible",
                  position: "relative",
                  maxWidth: "200px",
                  p: 0,
                },
              }}
            >
              <Box sx={{ p: 2, pb: 1.5 }}>
                <Paragraphe className="fw-bold">
                  {user?.namefull || "Nom indisponible"}
                </Paragraphe>
                <Paragraphe>
                  {user?.email || "Email non disponible"}
                </Paragraphe>
              </Box>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuList
                disablePadding
                sx={{
                  p: 1,
                  gap: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiMenuItem-root': {
                    px: 1,
                    gap: 2,
                    borderRadius: 0.75,
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                  },
                }}
              >
                <MenuItem onClick={handleOpenProfile} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Icone profil */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                      <path opacity="0.4" d="M2.28099 19.6575C2.36966 20.5161 2.93261 21.1957 3.77688 21.3755C5.1095 21.6592 7.6216 22 12 22C16.3784 22 18.8905 21.6592 20.2232 21.3755C21.0674 21.1957 21.6303 20.5161 21.719 19.6575C21.8505 18.3844 22 16.0469 22 12C22 7.95305 21.8505 5.6156 21.719 4.34251C21.6303 3.48389 21.0674 2.80424 20.2231 2.62451C18.8905 2.34081 16.3784 2 12 2C7.6216 2 5.1095 2.34081 3.77688 2.62451C2.93261 2.80424 2.36966 3.48389 2.28099 4.34251C2.14952 5.6156 2 7.95305 2 12C2 16.0469 2.14952 18.3844 2.28099 19.6575Z" fill="#637381" />
                      <path d="M13.9382 13.8559C15.263 13.1583 16.1663 11.7679 16.1663 10.1666C16.1663 7.8655 14.3008 6 11.9996 6C9.69841 6 7.83291 7.8655 7.83291 10.1666C7.83291 11.768 8.73626 13.1584 10.0612 13.856C8.28691 14.532 6.93216 16.1092 6.51251 18.0529C6.45446 18.3219 6.60246 18.5981 6.87341 18.6471C7.84581 18.8231 9.45616 19 12.0006 19C14.545 19 16.1554 18.8231 17.1278 18.6471C17.3977 18.5983 17.5454 18.3231 17.4876 18.0551C17.0685 16.1103 15.7133 14.5321 13.9382 13.8559Z" fill="#637381" />
                    </svg>
                  </span>
                  <Paragraphe>
                    Profil
                  </Paragraphe>
                </MenuItem>
                <MenuItem onClick={handleOpenSecurite} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Icone sécurité */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" opacity="0.4" />
                      <path fill="currentColor" d="M13.5 15a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1.401A2.999 2.999 0 0 1 12 8a3 3 0 0 1 1.5 5.599z" />
                    </svg>
                  </span>
                  <Paragraphe>
                    Sécurité
                  </Paragraphe>
                </MenuItem>
              </MenuList>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Box sx={{ p: 1 }}>
                <CustomButton
                  fullWidth
                  color="danger"
                  size="medium"
                  variant="text"
                  onClick={handleLogout}
                >
                  Déconnexion
                </CustomButton>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>
      <ProfileModal isOpen={openProfileModal} onClose={handleCloseProfile} />
      <SecuriteModal isOpen={openSecuriteModal} onClose={handleCloseSecurite} />
    </>
  )
}

AppHeader.propTypes = {
  scrolled: PropTypes.bool.isRequired,
}

export default AppHeader