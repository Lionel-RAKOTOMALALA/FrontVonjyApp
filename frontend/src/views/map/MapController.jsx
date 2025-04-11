import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import AmpanihyData from './Ampanihy.json';
import { calculateBBox } from './MapUtils';

// Styling functions
const getColor = (d) => {
  return d > 1000 ? '#800026' :
    d > 500 ? '#BD0026' :
      d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
          d > 50 ? '#FD8D3C' :
            d > 20 ? '#FEB24C' :
              d > 10 ? '#FED976' :
                '#FFEDA0';
};

const featureStyle = (feature) => ({
  fillColor: feature.properties.density ? getColor(feature.properties.density) : '#cccccc',
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.7
});

const selectedStyle = {
  weight: 3,
  color: '#666',
  dashArray: '',
  fillOpacity: 0.9,
  fillColor: '#3388ff'
};

function MapController({ selectedCommuneName, resetView }) {
  const map = useMap();
  const geoJsonLayerRef = useRef(null);
  
  // Effect to filter GeoJSON when a commune is selected
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    
    if (selectedCommuneName) {
      // Filter to show only the selected commune
      geoJsonLayerRef.current.clearLayers();
      
      const filteredData = {
        type: "FeatureCollection",
        features: AmpanihyData.features.filter(
          feature => feature.properties.District_N === selectedCommuneName
        )
      };
      
      const selectedLayer = L.geoJSON(filteredData, {
        style: selectedStyle
      }).addTo(geoJsonLayerRef.current);
      
      // Zoom to the selected commune
      const bounds = selectedLayer.getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (resetView) {
      // Show all communes again
      geoJsonLayerRef.current.clearLayers();
      
      L.geoJSON(AmpanihyData, {
        style: featureStyle,
        onEachFeature: (feature, layer) => {
          const nomCommune = feature.properties.District_N;
          layer.bindTooltip(nomCommune);
        }
      }).addTo(geoJsonLayerRef.current);
      
      // Reset to original view
      const bounds = calculateBBox(AmpanihyData);
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, selectedCommuneName, resetView]);

  // Create a ref to the GeoJSON layer
  useEffect(() => {
    geoJsonLayerRef.current = L.layerGroup().addTo(map);
    
    // Initial load of all communes
    L.geoJSON(AmpanihyData, {
      style: featureStyle,
      onEachFeature: (feature, layer) => {
        const nomCommune = feature.properties.District_N;
        layer.bindTooltip(nomCommune);
      }
    }).addTo(geoJsonLayerRef.current);
    
    return () => {
      if (geoJsonLayerRef.current) {
        geoJsonLayerRef.current.clearLayers();
      }
    };
  }, [map]);

  return null;
}

MapController.propTypes = {
  selectedCommuneName: PropTypes.string,
  resetView: PropTypes.bool
};

export default MapController;