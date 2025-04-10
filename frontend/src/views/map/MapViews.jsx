import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import CommuneIcon from '../../assets/icons/commune.svg';
import FokotanyIcon from '../../assets/icons/fokotany.svg';
import ServiceIcon from '../../assets/icons/service.svg';
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
  CircularProgress,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import 'leaflet/dist/leaflet.css';
import { H2, H3, Paragraphe, Subtitle1 } from '../../components/ui/TypographyVariants';
import AmpanihyData from './Ampanihy.json';
import { useNavigate } from 'react-router-dom';
import { calculateBBox } from './MapUtils'; // Assuming you create this utility

// Default center coordinates (will be overridden if bbox is calculated)
const defaultCenter = [-24.6833, 44.75];
const defaultZoom = 9;

// Color scale function (adjust based on your data or remove if not needed)
const getColor = (d) => {
  return d > 1000 ? '#800026' :
         d > 500   ? '#BD0026' :
         d > 200   ? '#E31A1C' :
         d > 100   ? '#FC4E2A' :
         d > 50    ? '#FD8D3C' :
         d > 20    ? '#FEB24C' :
         d > 10    ? '#FED976' :
                      '#FFEDA0';
};

// Style function (adjust based on your data properties)
const featureStyle = (feature) => ({
  fillColor: feature.properties.density ? getColor(feature.properties.density) : '#cccccc', // Default color if density is missing
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.7
});

// FlyToBounds Component (to fit map to the data bounds after loading)
function FlyToBounds({ data }) {
  const map = useMap();
  useEffect(() => {
    if (data && data.features && data.features.length > 0) {
      const bounds = calculateBBox(data);
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [data, map]);

  return null;
}

FlyToBounds.propTypes = {
  data: PropTypes.object,
};

// Statistics Card Component
const StatCard = ({ icon, title, value }) => (
  <Box sx={{
    mt: 2,
    mb: 2,
    p: 2,
    border: '1px solid #ddd',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    width: '60%'
  }}>
    <img
      src={icon}
      width={40}
      height={40}
      alt={title}
      style={{ marginRight: "20px", marginLeft: "25px" }}
      aria-hidden="true"
    />
    <Box>
      <Paragraphe>{title}</Paragraphe>
      <H3>{value}</H3>
    </Box>
  </Box>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function MapViews() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [communeCount, setCommuneCount] = useState(0);
  const [fokotanyCount, setFokotanyCount] = useState(0);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleFeatureClick = useCallback((feature, layer) => {
    const nomCommune = feature.properties.District_N; // Assuming District_N is the identifier
    layer.on({
      click: () => navigate(`/commune/${encodeURIComponent(nomCommune)}`),
    });
    layer.bindTooltip(nomCommune);
  }, [navigate]);

  // Handle scroll for app bar effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load and process map data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Validate GeoJSON data structure
        if (!AmpanihyData || !AmpanihyData.features) {
          throw new Error('Invalid GeoJSON data structure');
        }

        // Calculate statistics dynamically
        const communes = new Set(AmpanihyData.features.map(feature => feature.properties.District_N));
        setCommuneCount(communes.size);

        // You'll need more specific logic to count Fokotany if that information is within the features
        // This is a placeholder - adjust based on your actual data structure
        let fokontany = 0;
        AmpanihyData.features.forEach(feature => {
          if (feature.properties.fokotany) { // Adjust property name if needed
            fokontany += feature.properties.fokotany;
          } else {
            // If fokotany isn't a direct property, you might need to iterate over coordinates
            // or have a separate dataset. This is highly dependent on your JSON structure.
            // For now, let's assume a simplified count based on features as a fallback.
            fokontany = AmpanihyData.features.length;
          }
        });
        setFokotanyCount(fokontany);

        setLoading(false);
      } catch (error) {
        setMapError(error.message);
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.7)' : '#ffffff',
          color: '#000',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <img
              src="/logo.png"
              alt="Centre Vonjy Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <Typography variant="h5" fontWeight="bold">
              Centre Vonjy
            </Typography>
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

      {/* Main Content */}
      <Box sx={{ paddingBottom: 4 }}>
        <H2 textAlign="center" marginTop="">District d'Ampanihy</H2>

        <Grid container spacing={4}>
          {/* District Map */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 4, height: '100%', marginLeft: "35px" }}>
              <CardContent>
                <Subtitle1 textAlign="center" fontWeight="bold" gutterBottom>
                  Carte du District d'Ampanihy
                </Subtitle1>
                <Paragraphe textAlign="center" gutterBottom>
                  Cliquez sur un district pour voir ses détails
                </Paragraphe>
                <Box
                  sx={{
                    mt: 4,
                    height: 400,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                    position: 'relative',
                  }}
                >
                  {loading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : mapError ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: 'error.main',
                        p: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography>Erreur de chargement de la carte: {mapError}</Typography>
                    </Box>
                  ) : (
                    <MapContainer
                      center={defaultCenter}
                      zoom={defaultZoom}
                      style={{ width: '100%', height: '100%' }}
                      aria-label="Carte du district d'Ampanihy"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <GeoJSON
                        data={AmpanihyData}
                        style={featureStyle}
                        onEachFeature={handleFeatureClick}
                      />
                      <FlyToBounds data={AmpanihyData} />
                    </MapContainer>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Global Statistics */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 4, height: '100%', marginRight: "35px" }}>
              <CardContent>
                <Subtitle1 textAlign="center" fontWeight="bold" gutterBottom>
                  Statistiques Globales
                </Subtitle1>
                <Paragraphe textAlign="center">
                  Infrastructure dans tout le district
                </Paragraphe>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <StatCard
                    icon={CommuneIcon}
                    title="Districts" // Changed to "Districts" based on your JSON
                    value={communeCount}
                  />
                  <StatCard
                    icon={ServiceIcon}
                    title="Services"
                    value={200} // Placeholder - needs dynamic data if available
                  />
                  <StatCard
                    icon={FokotanyIcon}
                    title="Total Fokontany"
                    value={fokotanyCount}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

MapViews.propTypes = {
  // Add any props if needed
};

export default MapViews;