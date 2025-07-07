"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { AppBar, Toolbar, Box, IconButton, Avatar, Popover, Divider, MenuList, MenuItem } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import VonjyLogo from "../../assets/VonjyLogo.svg" 
import useUserStore from "../../store/userStore"
import { useNavigate } from 'react-router-dom'
import ProfileModal from "../account/profile"
import SecuriteModal from "../account/security"
import CustomButton from "../../components/ui/CustomButton"

// Constantes pour les styles
const POPOVER_STYLES = {
  paper: {
    borderRadius: "10px",
    boxShadow: "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px;",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    overflow: "visible",
    position: "relative",
    maxWidth: "200px",
    p: 0,
  },
  menuList: {
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
  }
};

const AVATAR_BUTTON_STYLES = {
  p: '2px',
  width: 40,
  height: 40,
  background: (theme) =>
    `conic-gradient(${theme.palette.primary.light}, ${theme.palette.warning.light}, ${theme.palette.primary.light})`,
  position: "relative"
};

// Icônes SVG en tant que composants
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
    <path opacity="0.4" d="M2.28099 19.6575C2.36966 20.5161 2.93261 21.1957 3.77688 21.3755C5.1095 21.6592 7.6216 22 12 22C16.3784 22 18.8905 21.6592 20.2232 21.3755C21.0674 21.1957 21.6303 20.5161 21.719 19.6575C21.8505 18.3844 22 16.0469 22 12C22 7.95305 21.8505 5.6156 21.719 4.34251C21.6303 3.48389 21.0674 2.80424 20.2231 2.62451C18.8905 2.34081 16.3784 2 12 2C7.6216 2 5.1095 2.34081 3.77688 2.62451C2.93261 2.80424 2.36966 3.48389 2.28099 4.34251C2.14952 5.6156 2 7.95305 2 12C2 16.0469 2.14952 18.3844 2.28099 19.6575Z" fill="#637381" />
    <path d="M13.9382 13.8559C15.263 13.1583 16.1663 11.7679 16.1663 10.1666C16.1663 7.8655 14.3008 6 11.9996 6C9.69841 6 7.83291 7.8655 7.83291 10.1666C7.83291 11.768 8.73626 13.1584 10.0612 13.856C8.28691 14.532 6.93216 16.1092 6.51251 18.0529C6.45446 18.3219 6.60246 18.5981 6.87341 18.6471C7.84581 18.8231 9.45616 19 12.0006 19C14.545 19 16.1554 18.8231 17.1278 18.6471C17.3977 18.5983 17.5454 18.3231 17.4876 18.0551C17.0685 16.1103 15.7133 14.5321 13.9382 13.8559Z" fill="#637381" />
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
    <path fill="currentColor" d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" opacity="0.4" />
    <path fill="currentColor" d="M13.5 15a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1.401A2.999 2.999 0 0 1 12 8a3 3 0 0 1 1.5 5.599z" />
  </svg>
);

const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m20.83 10.715l-.518 1.932c-.605 2.255-.907 3.383-1.592 4.114a4 4 0 0 1-2.01 1.161q-.145.034-.295.052c-.915.113-2.032-.186-4.064-.73c-2.255-.605-3.383-.907-4.114-1.592a4 4 0 0 1-1.161-2.011c-.228-.976.074-2.103.679-4.358l.517-1.932l.244-.905c.455-1.666.761-2.583 1.348-3.21a4 4 0 0 1 2.01-1.16c.976-.228 2.104.074 4.36.679c2.254.604 3.382.906 4.113 1.59a4 4 0 0 1 1.161 2.012c.228.976-.075 2.103-.679 4.358m-9.778-.91a.75.75 0 0 1 .919-.53l4.83 1.295a.75.75 0 1 1-.389 1.448l-4.83-1.294a.75.75 0 0 1-.53-.918m-.776 2.898a.75.75 0 0 1 .918-.53l2.898.777a.75.75 0 1 1-.388 1.448l-2.898-.776a.75.75 0 0 1-.53-.919"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M16.415 17.975a4 4 0 0 1-1.068 1.677c-.731.685-1.859.987-4.114 1.591s-3.383.907-4.358.679a4 4 0 0 1-2.011-1.161c-.685-.731-.988-1.859-1.592-4.114l-.517-1.932c-.605-2.255-.907-3.383-.68-4.358a4 4 0 0 1 1.162-2.011c.731-.685 1.859-.987 4.114-1.592q.638-.172 1.165-.309l-.244.906l-.517 1.932c-.605 2.255-.907 3.382-.68 4.358a4 4 0 0 0 1.162 2.011c.731.685 1.859.987 4.114 1.592c2.032.544 3.149.843 4.064.73"
      opacity="0.4"
    />
  </svg>
)

// Composant pour les informations utilisateur dans le popover
const UserInfo = ({ user }) => (
  <Box sx={{ p: 2, pb: 1.5 }}>
    <p className="fw-bold">
      {user?.namefull || "Nom indisponible"}
    </p>
    <p>
      {user?.email || "Email non disponible"}
    </p>
  </Box>
);

// Composant pour un élément de menu
const MenuItemComponent = ({ onClick, icon: Icon, text }) => (
  <MenuItem onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon />
    </span>
    <p>{text}</p>
  </MenuItem>
);

// Composant pour l'avatar utilisateur
const UserAvatar = ({ user, onOpenPopover }) => {
  const userInitial = useMemo(() =>
    user?.namefull?.charAt(0).toUpperCase() || "?",
    [user?.namefull]
  );

  return (
    <IconButton onClick={onOpenPopover} sx={AVATAR_BUTTON_STYLES}>
      <Avatar sx={{ width: 1, height: 1, bgcolor: "#fbc02d" }}>
        {userInitial}
      </Avatar>
      <ArrowDropDownIcon
        className="rounded-circle border"
        sx={{
          position: 'absolute',
          top: '24px',
          right: '0px',
          width: '16px',
          height: '16px',
          backgroundColor: "#fff"
        }}
      />
    </IconButton>
  );
};

// Composant principal du popover utilisateur
const UserPopover = ({
  openPopover,
  onClosePopover,
  user,
  onOpenProfile,
  onOpenSecurity,
  onLogout
}) => (
  <Popover
    open={!!openPopover}
    anchorEl={openPopover}
    onClose={onClosePopover}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    PaperProps={{ sx: POPOVER_STYLES.paper }}
  >
    <UserInfo user={user} />

    <Divider sx={{ borderStyle: 'dashed' }} />

    <MenuList disablePadding sx={POPOVER_STYLES.menuList}>
      <MenuItemComponent
        onClick={onOpenProfile}
        icon={ProfileIcon}
        text="Profil"
      />
      <MenuItemComponent
        onClick={onOpenSecurity}
        icon={SecurityIcon}
        text="Sécurité"
      />
    </MenuList>

    <Divider sx={{ borderStyle: 'dashed' }} />

    <Box sx={{ p: 1 }}>
      <CustomButton
        fullWidth
        color="danger"
        size="medium"
        variant="text"
        onClick={onLogout}
      >
        Déconnexion
      </CustomButton>
    </Box>
  </Popover>
);

// Hook personnalisé pour la gestion des modales
const useModals = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openSecuriteModal, setOpenSecuriteModal] = useState(false);

  const openProfile = useCallback(() => setOpenProfileModal(true), []);
  const closeProfile = useCallback(() => setOpenProfileModal(false), []);
  const openSecurity = useCallback(() => setOpenSecuriteModal(true), []);
  const closeSecurity = useCallback(() => setOpenSecuriteModal(false), []);

  return {
    openProfileModal,
    openSecuriteModal,
    openProfile,
    closeProfile,
    openSecurity,
    closeSecurity
  };
};

// Hook personnalisé pour la gestion du popover
const usePopover = () => {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return {
    openPopover,
    handleOpenPopover,
    handleClosePopover
  };
};

// Hook personnalisé pour les actions utilisateur
const useUserActions = (handleClosePopover) => {
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const {
    openProfileModal,
    openSecuriteModal,
    openProfile,
    closeProfile,
    openSecurity,
    closeSecurity
  } = useModals();

  const handleOpenProfile = useCallback(() => {
    openProfile();
    handleClosePopover();
  }, [openProfile, handleClosePopover]);

  const handleOpenSecurity = useCallback(() => {
    openSecurity();
    handleClosePopover();
  }, [openSecurity, handleClosePopover]);

  const handleLogout = useCallback(async () => {
    await logout();
    handleClosePopover();
    navigate('/auth/login');
  }, [logout, handleClosePopover, navigate]);

  return {
    openProfileModal,
    openSecuriteModal,
    closeProfile,
    closeSecurity,
    handleOpenProfile,
    handleOpenSecurity,
    handleLogout
  };
};

function AppHeader({ scrolled }) {
  const { fetchUser, user } = useUserStore();
  const { openPopover, handleOpenPopover, handleClosePopover } = usePopover();
  const {
    openProfileModal,
    openSecuriteModal,
    closeProfile,
    closeSecurity,
    handleOpenProfile,
    handleOpenSecurity,
    handleLogout
  } = useUserActions(handleClosePopover);

  useEffect(() => {
    // Ne fetch les informations utilisateur qu'une seule fois si elles ne sont pas déjà présentes
    if (!user) {
      fetchUser();
    }
    console.log("Informations de l'utilisateur connecté :", user);
  }, [user, fetchUser]);

  return (
    <>
      <AppBar
        elevation={scrolled ? 4 : 0}
        className="z-1"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.85)",
          color: "#000",
          transition: "all 0.3s ease",
          position: "fixed",
          boxShadow: scrolled ? "0 4px 32px 0 rgba(145, 158, 171, 0.16)" : "none",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: "flex",
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

          <Box display="flex" gap={2} alignItems="center">
            <CustomButton
              variant="outlined"
              color="secondary"
              startIcon={<DashboardIcon />}
              onClick={() => {
                if (user?.role === "super") {
                  window.location.href = "/users";
                } else {
                  window.location.href = "/annuaire";
                }
              }}
              sx={{ fontSize: "12px" }}
            >
              Espace de gestion
            </CustomButton>

            <UserAvatar user={user} onOpenPopover={handleOpenPopover} />
            <UserPopover
              openPopover={openPopover}
              onClosePopover={handleClosePopover}
              user={user}
              onOpenProfile={handleOpenProfile}
              onOpenSecurity={handleOpenSecurity}
              onLogout={handleLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <ProfileModal isOpen={openProfileModal} onClose={closeProfile} />
      <SecuriteModal isOpen={openSecuriteModal} onClose={closeSecurity} />
    </>
  );
}

AppHeader.propTypes = {
  scrolled: PropTypes.bool.isRequired,
};

export default AppHeader;