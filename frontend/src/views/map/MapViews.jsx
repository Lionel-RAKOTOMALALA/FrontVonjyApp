import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Snackbar, AccordionActions, Typography } from '@mui/material'; 
import L from 'leaflet';
import ImplementationMap from './ImplementationMap';

function MapViews() { 
  const [center, setCenter] = useState([ -23.33162, 43.66559]); // Paris coordinates
  const [selectedCity, setSelectedCity] = useState(null);
  const ZOOM_LEVEL = 7;
  const mapRef = useRef();  
  const [markers, setMarkers] = useState([]);
  const ICON_URL = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";
  const customIcon = new L.Icon({
    iconUrl: `${ICON_URL}marker-icon.png`,
    iconRetinaUrl: `${ICON_URL}marker-icon-2x.png`,
    shadowUrl: `${ICON_URL}marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState(null);
  const [allMarkers, setAllMarkers] = useState([]); 
  const [isAnyAccordionExpanded, setIsAnyAccordionExpanded] = useState(false);
  const [centers, setCenters] = useState([]);
 
 
  return (
    <> 
      <Box className="row">
        <Box className="col-xl-6 col-md-6 col-12"> 
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6">Contenu</Typography> 
            <Typography variant="h6">Contenu</Typography> 
            <Typography variant="h6">Contenu</Typography> 
            <Typography variant="h6">Contenu</Typography> 
          </Box> 
        </Box>
        <Box style={{height:'500px'}} className="col-xl-6 col-md-6 col-12 mb-md-0 mb-6 bg-label-secondary rounded"> 
        <ImplementationMap 
            center={center}
            zoom={ZOOM_LEVEL}
            allMarkers={isAnyAccordionExpanded ? [] : allMarkers}
            selectedRoute={selectedRoute}
            ref={mapRef}
          />
        </Box>
      </Box>    
    </>
  );
}

export default MapViews