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
  Divider,
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const center = [-23.6, 44.4];

const MapViewsDetail = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const services = [
    { type: 'Ecole', nombre: 20, details: 'Couverture éducative faible' },
    { type: 'CSB2', nombre: 10, details: 'Couverture santé faible' },
    { type: 'Police', nombre: 1, details: 'Sécurité' },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Barre du haut */}
      <AppBar position="static" sx={{  bgcolor: '#ffffff', color: '#000', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'  }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: 40, marginRight: 10 }}
            />
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

      {/* En-tête avec bouton retour et Export PDF */}
      <Box
        sx={{
            padding: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
        }}
        >
        {/* Bouton retour */}
        <Box display="flex" alignItems="center" flex="1">
            <IconButton onClick={() => navigate("/map")}>
            <ArrowBackIosIcon />
            </IconButton>
        </Box>

        {/* Titre centré */}
        <Box
            sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            }}
        >
            <Typography variant="h5" fontWeight="bold">
            District d’Ampanihy
            </Typography>
        </Box>

        {/* Bouton PDF à droite */}
        <Box flex="1" display="flex" justifyContent="flex-end">
            <Button
            variant="contained"
            sx={{ bgcolor: '#fbc02d', color: '#000', fontWeight: 'bold' }}
            >
            Exporter PDF
            </Button>
        </Box>
        </Box>


      {/* Cartes géographiques */}
      <Grid container spacing={4} px={3}>
        <Grid item xs={12} md={6}>
          <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
              }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" fontWeight="bold">
                Carte d’Androka Vao
              </Typography>
              <Typography variant="body2" textAlign="center">
                vue géographique détaillée
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

        <Grid item xs={12} md={6}>
          <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
              }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center" fontWeight="bold" gutterBottom>
                Statistiques
              </Typography>
              <Typography variant="body2" textAlign="center">
                Infrastructures et services
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Détails des services */}
      <Box px={3} py={4}>
        <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
              }}
        >
          <CardContent>
            <Typography variant="h6" textAlign="center" fontWeight="bold" gutterBottom>
              Détails des Services
            </Typography>
            <Typography variant="body2" textAlign="center" gutterBottom>
              Analyse détaillée des infrastructures
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
              }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Détails</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MapViewsDetail;
