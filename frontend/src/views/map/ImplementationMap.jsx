import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const ItineraireMap = forwardRef(({ center, zoom, allMarkers = [], selectedRoute = null, className = '' }, ref) => {
    const [route, setRoute] = useState(null);
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

    const MapRef = ({ setRef }) => {
        const map = useMap();
        useImperativeHandle(ref, () => ({
            fitBounds: (bounds) => {
                map.fitBounds(bounds);
            }
        }));
        return null;
    };

    useEffect(() => {
        const fetchRoute = async () => {
          if (selectedRoute?.stops && Array.isArray(selectedRoute.stops) && selectedRoute.stops.length >= 2) {
            try {
              if (selectedRoute.geometry) {
                setRoute(selectedRoute.geometry.coordinates);
              } else {
                const coordinates = selectedRoute.stops
                  .map(stop => stop.coordinates)
                  .map(coords => `${coords[1]},${coords[0]}`)
                  .join(';');
                const response = await fetch(
                  `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                
                if (data.routes && data.routes.length > 0) {
                  setRoute(data.routes[0].geometry.coordinates);
                }
              }
            } catch (error) {
              console.error("Erreur lors de la récupération de l'itinéraire:", error);
            }
          } else {
            setRoute(null);
          }
        };
    
        fetchRoute();
      }, [selectedRoute]);
      
  const markersToShow = (selectedRoute?.stops && Array.isArray(selectedRoute.stops)) 
  ? selectedRoute.stops 
  : (Array.isArray(allMarkers) ? allMarkers : []);
  
    return (
        <MapContainer 
            center={center} 
            zoom={zoom} 
            className={`w-full h-full ${className}`}
            style={{ minHeight: '100%' }}
        >
            <MapRef setRef={ref} />
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markersToShow.map((marker, index) => (
                <Marker 
                    key={index} 
                    position={marker.coordinates || marker.position}
                    icon={customIcon}
                >
                    <Popup>
                        <div>
                            <p>{marker.name || marker.popupContent}</p>
                            <p><strong>Coordonnées:</strong> {`Lat: ${marker.coordinates ? marker.coordinates[0] : marker.position[0]}, Lng: ${marker.coordinates ? marker.coordinates[1] : marker.position[1]}`}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            {route && (
                <Polyline
                    positions={route.map(coord => [coord[1], coord[0]])}
                    color="blue"
                    weight={5}
                    opacity={0.7}
                />
            )}
        </MapContainer>
    );
});

ItineraireMap.displayName = 'ItineraireMap';

export default ItineraireMap;

