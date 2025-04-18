"use client"
import PropTypes from "prop-types"
import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material"
import { MapContainer, TileLayer } from "react-leaflet"
import { H4, Paragraphe } from "../../../../components/ui/TypographyVariants"
import MapController from "./MapController"
import CustomMapEvents from "./CustomMapEvents"
import { motion, AnimatePresence } from "framer-motion"
import "leaflet/dist/leaflet.css"
import MenuPopup from "../../../../components/ui/MenuPopup"
import AmpanihyData from "../data/Ampanihy.json"

// Default center coordinates (will be overridden if bbox is calculated)
const defaultCenter = [-24.6833, 44.75]
const defaultZoom = 8

// Préparation des éléments de menu avec ID et nom
const prepareMenuItems = () => {
  if (!AmpanihyData || !AmpanihyData.features) return [];
  
  return AmpanihyData.features.map(feature => ({
    id: feature.properties.id,
    name: feature.properties.District_N
  }));
};

const menuItems = prepareMenuItems();

function MapCard({ loading, mapError, selectedCommune, resetView, onCommuneClick }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card
        sx={{
          borderRadius: 4,
          height: "100%",
          boxShadow: "0 0 2px 0 rgba(145 158 171 / 0.2),0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <div className="d-flex justify-content-between">
              <motion.div
                key={selectedCommune ? "selected-title" : "default-title"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <H4 mb={0} ml={3} mt={3} fontWeight="bold">
                  Carte
                </H4>
                <Paragraphe style={{ marginTop: 4 }} mb={2} ml={3}>
                  Cliquez sur une commune pour voir ses détails
                </Paragraphe>
              </motion.div>
              <div className="d-flex flex-column justify-content-center mx-4">
                <MenuPopup
                  buttonLabel='Communes'
                  menuItems={menuItems}
                  selectedItemId={selectedCommune?.id}
                  onSelect={onCommuneClick}  
                />
              </div>
            </div>
          </AnimatePresence>

          <Box
            sx={{
              height: 400,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #ddd",
              m: 3,
              mt: 0,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : mapError ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "error.main",
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography>Erreur de chargement de la carte: {mapError}</Typography>
              </Box>
            ) : (
              <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ width: "100%", height: "100%", zIndex: 0 }}
                aria-label="Carte du district d'Ampanihy"
                zoomControl={true}
                dragging={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                  selectedCommuneId={selectedCommune?.id} 
                  resetView={resetView}
                  onCommuneClick={onCommuneClick}
                />

                <CustomMapEvents onCommuneClick={onCommuneClick} />
              </MapContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

MapCard.propTypes = {
  loading: PropTypes.bool.isRequired,
  mapError: PropTypes.string,
  selectedCommune: PropTypes.object,
  resetView: PropTypes.bool.isRequired,
  onCommuneClick: PropTypes.func.isRequired,
}

export default MapCard