"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Divider } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import VonjyLogo from "../../assets/VonjyLogo.svg"
import Parametre from "./settings/Index" // Import du modal
import { Paragraphe } from "../../components/ui/TypographyVariants"
import useUserStore from "../../store/userStore"

function AppHeader({ scrolled }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openParametre, setOpenParametre] = useState(false) // Pour gérer le modal
  const { fetchUser, user, logout } = useUserStore() // Ajout de logout depuis le store

  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenParametre = () => {
    setOpenParametre(true)
    handleClose()
  }

  const handleCloseParametre = () => {
    setOpenParametre(false)
  }

  const handleLogout = async () => {
    await logout() // Appel à la fonction logout du store
    handleClose() // Fermer le menu après déconnexion
  }

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
            <Paragraphe sx={{ marginRight: 1, fontSize: '1.05rem', display: { xs: 'none', md: 'block' }, }}>
            {user?.namefull?.charAt(0).toUpperCase() + user?.namefull?.slice(1) || "Nom indisponible"}
            </Paragraphe>
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
            <Menu
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "10px",
                  boxShadow:
                    "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px;",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(20px)",
                  overflow: "visible",
                  position: "relative",
                  maxWidth: "200px",
                },
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              MenuListProps={{
                "aria-labelledby": "user-menu",
              }}
            >
              <Paragraphe className="mx-3 my-3" sx={{ marginRight: 1, fontSize: '1.05rem', display: { xs: 'block', md: 'none' }, }}>
                {user?.email || "Email non disponible"}
              </Paragraphe>
              <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
              <MenuItem className="mx-2 my-1" sx={{ borderRadius: "10px" }} onClick={handleOpenParametre}>
                Paramètres
              </MenuItem>
              <MenuItem className="mx-2 my-1" sx={{ borderRadius: "10px" }} onClick={handleLogout}>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Parametre isOpen={openParametre} onClose={handleCloseParametre} />
    </>
  )
}

AppHeader.propTypes = {
  scrolled: PropTypes.bool.isRequired,
}

export default AppHeader
