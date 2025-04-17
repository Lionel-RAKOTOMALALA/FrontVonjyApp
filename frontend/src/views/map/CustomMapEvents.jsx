import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import AmpanihyData from './Ampanihy.json';

function CustomMapEvents({ onCommuneClick }) {
  const map = useMap();
  
  useEffect(() => {
    // Default style (invisible)
    const defaultStyle = {
      weight: 2,
      opacity: 0,
      color: '#3388ff',
      fillOpacity: 0
    };
    
    // Hover style - using colors from MapController
    const hoverStyle = {
      weight: 2,
      color: '#FFF',
      dashArray: '',
      fillOpacity: 0.8,
      fillColor: '#99ccff' // Light blue color from MapController
    };
    
    // Add GeoJSON with hover effects
    const interactiveLayer = L.geoJSON(AmpanihyData, {
      style: defaultStyle,
      onEachFeature: (feature, layer) => {
        const nomCommune = feature.properties.District_N;
        
        // Add click handler
        layer.on('click', () => {
          onCommuneClick(nomCommune);
        });
        
        // Add hover handlers
        layer.on('mouseover', (e) => {
          // Apply hover style
          layer.setStyle(hoverStyle);
          
          // Bring to front to avoid overlap issues
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
          
          // Show tooltip with commune name
          layer.bindTooltip(nomCommune).openTooltip();
        });
        
        layer.on('mouseout', (e) => {
          // Reset to default style when not hovering
          layer.setStyle(defaultStyle);
          
          // Close tooltip
          if (layer.getTooltip()) {
            layer.closeTooltip();
          }
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

export default CustomMapEvents;