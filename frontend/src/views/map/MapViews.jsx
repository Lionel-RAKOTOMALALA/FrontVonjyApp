import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import 'leaflet/dist/leaflet.css';

const center = [-23.6, 44.4];

function MapViews() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: '#ffffff', color: '#000', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <img src="/logo.png" alt="Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" fontWeight="bold">
              Centre Vonjy
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ marginRight: 1 }}>
              bryan@gmail.com
            </Typography>
            <IconButton onClick={handleMenuClick}>
              <Avatar sx={{ bgcolor: '#fbc02d' }}>B</Avatar>
              <ArrowDropDownIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>Paramètres</MenuItem>
              <MenuItem onClick={handleClose}>Voir profil</MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>Déconnexion</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={4}>
          District d’Ampanihy
        </Typography>

        <Grid container spacing={4}>
          {/* Carte du District */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Carte du District d’Ampanihy
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Cliquez sur une commune pour voir ses détails
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    height: 350,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                  }}
                >
                  <MapContainer
                    center={center}
                    zoom={10}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </MapContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistiques Globales */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Statistiques Globales
                </Typography>
                <Typography variant="body2">
                  Infrastructure dans tout le district
                </Typography>
                {/* Tu peux ajouter ici des stats, graphiques, icônes etc. */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MapViews;
