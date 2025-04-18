"use client"

import { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { H3 } from "../../components/ui/TypographyVariants"
import AmpanihyData from "./Ampanihy.json"
import AppHeader from "./AppHeader"
import Navbar from "../../layouts/Navbar"
import MapCard from "./MapCard"
import StatistiqueGlobal from "./StatistiqueGlobal"
import BackToOverviewButton from "./BackToOverviewButton"
import CommuneDetailsCard from "./CommuneDetailsCard"
import { motion, AnimatePresence } from "framer-motion"
import useCommuneStore from '../../store/communeStore';


function MapViews() {
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  const [communeCount, setCommuneCount] = useState(0)
  const [fokotanyCount, setFokotanyCount] = useState(0)
  const {
    fetchDetailCommune,
    communedetail
    } = useCommuneStore();


  // State for selected commune info
  const [selectedCommune, setSelectedCommune] = useState(null)

  // State for controlling view reset
  const [resetView, setResetView] = useState(false)

  // State for animation control
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle scroll for app bar effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Load and process map data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Validate GeoJSON data structure
        if (!AmpanihyData || !AmpanihyData.features) {
          throw new Error("Invalid GeoJSON data structure")
        }

        // Calculate statistics dynamically
        const communes = new Set(AmpanihyData.features.map((feature) => feature.properties.District_N))
        setCommuneCount(communes.size)

        // Calculate fokotany count
        let fokontany = 0
        AmpanihyData.features.forEach((feature) => {
          if (feature.properties.fokotany) {
            fokontany += feature.properties.fokotany
          } else {
            fokontany = AmpanihyData.features.length
          }
        })
        setFokotanyCount(fokontany)

        setLoading(false)
      } catch (error) {
        setMapError(error.message)
        setLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle commune click on map - maintenant avec ID
  const handleCommuneClick = (communeId) => {
    setIsAnimating(true)
    setResetView(false)
    console.log(`Commune ID: ${communeId}`);
    
    // Charger les détails de la commune par ID
    fetchDetailCommune(communeId);
    
    // Find complete commune data from GeoJSON
    const communeData = AmpanihyData.features.find((feature) => feature.properties.id === communeId)

    if (communeData) {
      setSelectedCommune({
        id: communeId,
        nom: communeData.properties.District_N,
        population: communeData.properties.population || "Non disponible",
        superficie: communeData.properties.superficie || "Non disponible",
        fokotany: communeData.properties.fokotany || "Non disponible",
      })
    }

    // Reset animation flag after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }
  
  // Mettre à jour selectedCommune quand les détails sont chargés du store
  useEffect(() => {
    if (communedetail && selectedCommune) {
      console.log("Détails de la commune:", communedetail);
      // Mettre à jour les informations de la commune sélectionnée avec les données du store
      setSelectedCommune(prevState => ({
        ...prevState,
        population: communedetail.population || prevState.population,
        superficie: communedetail.superficie || prevState.superficie,
        fokotany: communedetail.fokotany_count || prevState.fokotany
      }));
    }
  }, [communedetail]);

  // Handle back to overview
  const handleBackToOverview = () => {
    setIsAnimating(true)

    // Use animation timing to coordinate the state changes
    setTimeout(() => {
      setSelectedCommune(null)
      setResetView(true)

      // Reset animation flag after animation completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 800)
    }, 100)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#f9f9f980",
        minHeight: "100vh",
        backgroundImage:
          "url(../../assets/img/backgrounds/main-bg1.svg ),url(../../assets/img/backgrounds/main-bg2.svg )",
        backgroundSize: "50%, 50%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top right, left bottom",
        backgroundColor: "rgb(255, 255, 255)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        paddingTop: 2,
      }}
    >
      {/* App Header Component */}
      <AppHeader scrolled={scrolled} />

      {/* Main Content */}
      <Box className="container" sx={{ paddingBottom: 4, mt: 5 }}>
        <div
          className="z-2"
          style={{
            position: "sticky",
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <AnimatePresence mode="wait">
            {selectedCommune && (
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
            )}

            {!selectedCommune && (
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

        <Box className="row mt-2 justify-content-center">
          {/* District Map */}
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
            {/* Statistique Globale avec animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCommune ? "selected-stats" : "global-stats"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}  
              >
                <StatistiqueGlobal selectedCommune={selectedCommune} />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Commune Details Component avec animation */}
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
    </Box>
  )
}

export default MapViews