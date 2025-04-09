import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Tooltip, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import madagascarData from './gadm41_MDG_4.json';

function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const ItineraireMap = forwardRef(({ 
    center = [-23.6, 44.4], // Default center on Ampanihy district
    zoom = 10, 
    className = '' 
}, ref) => {
    const [activeFokontany, setActiveFokontany] = useState(null);
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

    // Filter only Ampanihy district fokontany
    const ampanihyFokontanyFeatures = madagascarData.features.filter(
        feature => feature.properties.NAME_3 === "Ampanihy"
    );

    // Log fokontany list without duplicates
    useEffect(() => {
        const fokontanySet = new Set();
        ampanihyFokontanyFeatures.forEach(feature => {
            fokontanySet.add(feature.properties.NAME_4);
        });

        const fokontanyList = [...fokontanySet];
        console.log(`Nombre de fokontany dans le district d'Ampanihy: ${fokontanyList.length}`);
        console.log("Liste des fokontany :");
        fokontanyList.forEach((name, idx) => {
            console.log(`${idx + 1}. ${name}`);
        });
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className={`w-full h-full ${className}`}
            style={{ minHeight: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {ref && <MapRef setRef={ref} />}
            <ChangeView center={center} zoom={zoom} />

            {/* Render Polygon for each fokontany in Ampanihy district */}
            {ampanihyFokontanyFeatures.map((feature, index) => {
                const fokontanyName = feature.properties.NAME_4;
                const communeName = feature.properties.NAME_3;
                const regionName = feature.properties.NAME_2;
                const provinceName = feature.properties.NAME_1;
                const isActive = activeFokontany === fokontanyName;

                // MultiPolygon rendering
                if (feature.geometry.type === "MultiPolygon") {
                    return feature.geometry.coordinates.map((polygonCoords, polyIndex) => {
                        const formattedCoords = polygonCoords[0].map(([lng, lat]) => [lat, lng]);

                        return (
                            <Polygon
                                key={`${index}-${polyIndex}`}
                                positions={formattedCoords}
                                pathOptions={{
                                    fillColor: isActive ? '#BD0026' : '#FD8D3C',
                                    fillOpacity: 0.7,
                                    weight: 2,
                                    opacity: 1,
                                    dashArray: isActive ? "" : "3",
                                    color: 'white'
                                }}
                                eventHandlers={{
                                    mouseover: (e) => {
                                        setActiveFokontany(fokontanyName);
                                        e.target.setStyle({
                                            dashArray: "",
                                            fillColor: "#BD0026",
                                            fillOpacity: 0.7,
                                            weight: 2,
                                            opacity: 1,
                                            color: "white",
                                        });
                                    },
                                    mouseout: (e) => {
                                        setActiveFokontany(null);
                                        e.target.setStyle({
                                            fillOpacity: 0.7,
                                            weight: 2,
                                            dashArray: "3",
                                            color: 'white',
                                            fillColor: '#FD8D3C'
                                        });
                                    },
                                }}
                            >
                                <Tooltip sticky>{fokontanyName}</Tooltip>
                                <Popup>
                                    <div className="text-sm">
                                        <h3 className="font-bold text-lg">{fokontanyName}</h3>
                                        <p>Fokontany</p>
                                        <p>Commune : {communeName}</p>
                                        <p>District : Ampanihy</p>
                                        <p>Région : {regionName}</p>
                                        <p>Province : {provinceName}</p>
                                    </div>
                                </Popup>
                            </Polygon>
                        );
                    });
                }
                return null;
            })}

            {/* Optional marker for current position */}
            <Marker position={center} icon={customIcon}>
                <Popup>
                    Vous êtes ici !
                </Popup>
            </Marker>
        </MapContainer>
    );
});

ItineraireMap.displayName = 'ItineraireMap';

export default ItineraireMap;