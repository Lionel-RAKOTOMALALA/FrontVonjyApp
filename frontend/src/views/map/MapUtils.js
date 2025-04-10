import L from 'leaflet';

export const calculateBBox = (geojsonData) => {
  if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
    return null;
  }

  const bounds = new L.LatLngBounds();
  geojsonData.features.forEach(feature => {
    if (feature.geometry && feature.geometry.coordinates) {
      const coordinates = feature.geometry.coordinates;

      function addCoordinatesToBounds(coords) {
        if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
          bounds.extend([coords[1], coords[0]]); // Leaflet uses [lat, lng]
        } else if (Array.isArray(coords)) {
          coords.forEach(addCoordinatesToBounds);
        }
      }

      addCoordinatesToBounds(coordinates);
    }
  });

  return bounds.isValid() ? bounds : null;
};