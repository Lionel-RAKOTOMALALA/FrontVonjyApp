import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VonjyLogo from '../../assets/VonjyLogo.svg';

function AppHeader({ scrolled }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      elevation={scrolled ? 4 : 0}
      sx={{
        bgcolor: '#fff',
        color: '#000',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        position: 'fixed', 
        boxShadow:'none',
        zIndex:5000
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <img
            src={VonjyLogo}
            alt="Centre Vonjy Logo"
            style={{ height: 60, marginRight: 10, position: 'absolute', top: '10px' }}
          />
        </Box>

        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
            bryan@gmail.com
          </Typography>
          <IconButton
            onClick={handleMenuClick}
            aria-label="User menu"
            aria-controls="user-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ bgcolor: '#fbc02d' }}>B</Avatar>
            <ArrowDropDownIcon />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            MenuListProps={{
              'aria-labelledby': 'user-menu',
            }}
          >
            <MenuItem onClick={handleClose}>Paramètres</MenuItem>
            <MenuItem onClick={handleClose}>Voir profil</MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>Déconnexion</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

AppHeader.propTypes = {
  scrolled: PropTypes.bool.isRequired
};

export default AppHeader;