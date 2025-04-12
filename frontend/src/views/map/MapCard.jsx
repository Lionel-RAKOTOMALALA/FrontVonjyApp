import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import { H4, Paragraphe } from '../../components/ui/TypographyVariants';
import MapController from './MapController';
import CustomMapEvents from './CustomMapEvents';
import 'leaflet/dist/leaflet.css';

// Default center coordinates (will be overridden if bbox is calculated)
const defaultCenter = [-24.6833, 44.75];
const defaultZoom = 8;

function MapCard({ loading, mapError, selectedCommune, resetView, onCommuneClick }) {
  return (
    <Card sx={{
      borderRadius: 4,
      height: '100%', 
      boxShadow: '0 0 2px 0 rgba(145 158 171 / 0.2),0 12px 24px -4px rgba(145 158 171 / 0.12)'
    }}>
      <CardContent className='p-0'>
        <H4 mb={0} ml={3} mt={3} fontWeight="bold">
          Carte
        </H4>
        <Paragraphe style={{ marginTop: 4 }} mb={2} ml={3}>
          {selectedCommune ? 
            `` : 
            "Cliquez sur une commune pour voir ses détails"}
        </Paragraphe>

        <Box
          sx={{
            height: 400,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #ddd',
            m: 3, mt: 0
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
              
              <MapController 
                selectedCommuneName={selectedCommune?.nom} 
                resetView={resetView} 
              />
              
              <CustomMapEvents onCommuneClick={onCommuneClick} />
            </MapContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

MapCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  mapError: PropTypes.string,
  selectedCommune: PropTypes.object,
  resetView: PropTypes.bool.isRequired,
  onCommuneClick: PropTypes.func.isRequired
};

export default MapCard;