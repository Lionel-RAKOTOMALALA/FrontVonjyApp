import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import AmpanihyData from './Ampanihy.json';

function CustomMapEvents({ onCommuneClick }) {
  const map = useMap();
  
  useEffect(() => {
    // Add invisible GeoJSON to handle clicks
    const interactiveLayer = L.geoJSON(AmpanihyData, {
      style: { opacity: 0, fillOpacity: 0 }, // Invisible
      onEachFeature: (feature, layer) => {
        const nomCommune = feature.properties.District_N;
        layer.on('click', () => {
          onCommuneClick(nomCommune);
        });
      }
    }).addTo(map);
    
    return () => {
      map.removeLayer(interactiveLayer);
    };
  }, [map, onCommuneClick]);
  
  return null;
}

CustomMapEvents.propTypes = {
  onCommuneClick: PropTypes.func.isRequired
};

export default CustomMapEvents