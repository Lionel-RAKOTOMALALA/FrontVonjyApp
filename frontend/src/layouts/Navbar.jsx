// Navbar.jsx
import { useState, useCallback, useMemo } from "react";
import { Box, IconButton, Avatar, Popover, Divider, MenuList, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import CustomButton from "../components/ui/CustomButton";
import ProfileModal from "../views/account/profile";
import SecuriteModal from "../views/account/security";

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

// Composant pour le menu burger
const MenuToggle = () => (
  <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
    <a aria-label='toggle for sidebar' className="nav-item nav-link px-0 me-xl-4" href="#">
      <i className="bx bx-menu bx-sm"></i>
    </a>
  </div>
);

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
        text="Profile"
      />
      <MenuItemComponent
        onClick={onOpenSecurity}
        icon={SecurityIcon}
        text="Securité"
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

// Composant principal Navbar
const Navbar = () => {
  const { user } = useUserStore();
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

  const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" color='currentColor' width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path opacity="0.4" d="M12.453 6.22499C12.5805 6.02999 12.726 5.82449 12.888 5.61299L12.912 5.57999C13.31 5.05215 13.7681 4.57242 14.277 4.15049C14.8665 3.67049 15.5805 3.25949 16.3995 3.08549C16.6725 3.02849 16.959 2.99849 17.2545 2.99999C19.281 3.01349 20.8125 4.39499 21.7515 5.55599C21.87 5.70149 21.9765 5.84249 22.0755 5.97749L22.1175 6.03599C22.218 6.17399 22.2975 6.31799 22.3575 6.46349L22.3695 6.49199C22.7655 7.49999 22.227 8.58899 21.3 9.04949C21.2283 9.08554 21.1547 9.11758 21.0795 9.14549L17.7315 10.3725L13.0725 17.0925C11.6655 19.122 8.4915 17.7345 9.027 15.3225L9.495 13.212L4.8375 14.5245C4.44734 14.6345 4.037 14.6527 3.63864 14.5776C3.24029 14.5025 2.86474 14.3361 2.54143 14.0916C2.21813 13.847 1.95585 13.5309 1.77517 13.168C1.59449 12.8052 1.5003 12.4054 1.5 12V7.73999C1.5 5.92499 3.957 5.35949 4.749 6.99449L5.6565 8.86799L10.8045 7.51199C11.4525 7.34249 12.0285 6.86999 12.4545 6.22499H12.453ZM6.516 6.85949L6.666 7.05149L10.4235 6.06149C10.6215 6.01049 10.92 5.82449 11.202 5.39849C11.3516 5.17038 11.5087 4.94726 11.673 4.72949L9.762 3.41999C9.36328 3.14641 8.89106 2.99998 8.4075 2.99999C6.42 2.99999 5.2965 5.28749 6.516 6.85949Z" fill="currentColor" />
      <path d="M2.625 20.25C2.32663 20.25 2.04048 20.3685 1.8295 20.5795C1.61853 20.7905 1.5 21.0766 1.5 21.375C1.5 21.6734 1.61853 21.9595 1.8295 22.1705C2.04048 22.3815 2.32663 22.5 2.625 22.5H21.375C21.6734 22.5 21.9595 22.3815 22.1705 22.1705C22.3815 21.9595 22.5 21.6734 22.5 21.375C22.5 21.0766 22.3815 20.7905 22.1705 20.5795C21.9595 20.3685 21.6734 20.25 21.375 20.25H2.625Z" fill="currentColor" />
    </svg>
  )

  return (
    <>
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <MenuToggle />

        <Box display="flex" alignItems="center" sx={{ marginLeft: "auto", gap: '12px' }}>
          <CustomButton
            variant="outlined"
            color="secondary"
            startIcon={<DashboardIcon />}
            onClick={() => window.location.href = "/map"}
            sx={{ fontSize: "12px" }}
          >
            Voir la carte
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
      </nav>

      <ProfileModal isOpen={openProfileModal} onClose={closeProfile} />
      <SecuriteModal isOpen={openSecuriteModal} onClose={closeSecurity} />
    </>
  );
};

export default Navbar;