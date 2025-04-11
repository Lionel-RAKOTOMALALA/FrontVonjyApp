import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { H3 } from '../../components/ui/TypographyVariants';
import AmpanihyData from './Ampanihy.json'; 
import AppHeader from './AppHeader';
import MapCard from './MapCard';
import StatistiqueGlobal from './StatistiqueGlobal';
import BackToOverviewButton from './BackToOverviewButton';
import CommuneDetailsCard from './CommuneDetailsCard';
import { motion, AnimatePresence } from "framer-motion";

function MapViews() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [communeCount, setCommuneCount] = useState(0);
  const [fokotanyCount, setFokotanyCount] = useState(0);

  // State for selected commune info
  const [selectedCommune, setSelectedCommune] = useState(null);

  // State for controlling view reset
  const [resetView, setResetView] = useState(false);

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

        // Calculate fokotany count
        let fokontany = 0;
        AmpanihyData.features.forEach(feature => {
          if (feature.properties.fokotany) {
            fokontany += feature.properties.fokotany;
          } else {
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

  // Handle commune click on map
  const handleCommuneClick = (communeName) => {
    setResetView(false);

    // Find complete commune data
    const communeData = AmpanihyData.features.find(
      feature => feature.properties.District_N === communeName
    );

    if (communeData) {
      setSelectedCommune({
        nom: communeName,
        population: communeData.properties.population || 'Non disponible',
        superficie: communeData.properties.superficie || 'Non disponible',
        fokotany: communeData.properties.fokotany || 'Non disponible',
      });
    }
  };

  // Handle back to overview
  const handleBackToOverview = () => {
    setSelectedCommune(null);
    setResetView(true);
  };

  return (
    <Box sx={{
      flexGrow: 1,
      bgcolor: '#f9f9f980',
      minHeight: '100vh',
      backgroundImage: 'url(../../assets/img/backgrounds/main-bg1.svg ),url(../../assets/img/backgrounds/main-bg2.svg )',
      backgroundSize: '50%, 50%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top right, left bottom',
      backgroundColor: 'rgb(255, 255, 255)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingTop: 2,
    }}>
      {/* App Header Component */}
      <AppHeader scrolled={scrolled} />

      {/* Main Content */}
      <Box className="container" sx={{ paddingBottom: 4, mt: 5 }}>
        <div
          style={{
            position: 'sticky',
            top: 0, 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',  
          }}
        >
          <AnimatePresence mode="wait">
            {selectedCommune && (
              <>
                <motion.div
                  key="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BackToOverviewButton onClick={handleBackToOverview} />
                </motion.div>

                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{ margin: 0 }}
                >
                 <H3 className="my-3">{selectedCommune.nom}</H3>
                </motion.div>
              </>
            )}

            {!selectedCommune && (
              <motion.div
                key="default-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ margin: 0 }}
              >
                <H3 className="my-3">{"District d'Ampanihy"}</H3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Box className="row mt-2 justify-content-center">
          {/* District Map */}
          <Box className='col-12 col-md-8'>
            <MapCard
              loading={loading}
              mapError={mapError}
              selectedCommune={selectedCommune}
              resetView={resetView}
              onCommuneClick={handleCommuneClick}
            />
          </Box>
          <Box className="col-md-4 mt-4">
            {/* Passer la commune sélectionnée au composant StatistiqueGlobal */}
            <StatistiqueGlobal selectedCommune={selectedCommune} />
          </Box>
        </Box>

        {/* Commune Details Component */}
        {selectedCommune && (
          <CommuneDetailsCard selectedCommune={selectedCommune} />
        )}
      </Box>
    </Box>
  );
}

export default MapViews;