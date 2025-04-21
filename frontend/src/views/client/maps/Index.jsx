"use client"

import { Box } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { H3 } from "../../../components/ui/TypographyVariants"
import BackToOverviewButton from "./features/BackToOverviewButton"
import MapCard from "./features/MapCard"
import StatistiqueGlobal from "./features/StatistiqueGlobal"
import CommuneDetailsCard from "./features/CommuneDetailsCard"

const MapMainContent = ({
  selectedCommune,
  loading,
  mapError,
  resetView,
  isAnimating,
  handleCommuneClick,
  handleBackToOverview,
  totals,
}) => { 
  return (
    <Box className="container" sx={{ paddingBottom: 4, mt: 5 }}>
      <div
        className="z-2 mx-auto"
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          // maxWidth:'350px'
        }}
      >
        <AnimatePresence mode="wait">
          {selectedCommune ? (
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
                <H3 className="my-3">Commune {selectedCommune.nom}</H3>
              </motion.div>
            </>
          ) : (
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

      <Box className="row mt-2 flex-wrap-reverse justify-content-center">
        <Box className="col-12 col-md-8">
          <MapCard
            loading={loading}
            mapError={mapError}
            selectedCommune={selectedCommune}
            resetView={resetView}
            onCommuneClick={handleCommuneClick}
          />
        </Box>

        <Box className="col-md-4 mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCommune ? "selected-stats" : "global-stats"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StatistiqueGlobal selectedCommune={selectedCommune} totals={totals} />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      <AnimatePresence>
        {selectedCommune && (
          <motion.div
            key="commune-details"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CommuneDetailsCard selectedCommune={selectedCommune} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default MapMainContent
