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
      className='z-1'
      sx={{
        bgcolor: '#fff',
        color: '#000',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        position: 'fixed',
        boxShadow: 'none',
        // zIndex: 4000
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <img
            src={VonjyLogo}
            alt="Centre Vonjy Logo"
            style={{ height: '4em', marginRight: 10 }}
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
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '10px',
                boxShadow: 'rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px;',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                overflow: 'visible',
                position: 'relative',
                maxWidth: '200px',
              },
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            MenuListProps={{
              'aria-labelledby': 'user-menu',
            }}
          >
            <MenuItem 
              className='mx-2 my-1'
              sx={{ borderRadius: '10px' }}
              onClick={handleClose}>Paramètres</MenuItem>
            <MenuItem 
              className='mx-2 my-1'
              sx={{ borderRadius: '10px' }}
               onClick={handleClose}>Voir profil</MenuItem>
            <Divider />
            <MenuItem 
              className='mx-2 my-1'
              sx={{ borderRadius: '10px' }}
               onClick={handleClose}>Déconnexion</MenuItem>
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