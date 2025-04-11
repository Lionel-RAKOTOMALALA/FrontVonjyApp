export const calculateBBox = (geoJsonData) => {
  if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  // Function to process coordinates
  const processCoords = (coords) => {
    // For points [lng, lat]
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    } 
    // For arrays of coordinates
    else {
      coords.forEach(coord => processCoords(coord));
    }
  };

  // Process each feature
  geoJsonData.features.forEach(feature => {
    const geometry = feature.geometry;
    if (geometry && geometry.coordinates) {
      processCoords(geometry.coordinates);
    }
  });

  // Return bounds in format expected by Leaflet
  return [
    [minLat, minLng], // Southwest corner
    [maxLat, maxLng]  // Northeast corner
  ];
};