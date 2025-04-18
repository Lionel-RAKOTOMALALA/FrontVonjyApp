"use client"

import { useState, useEffect } from "react"
import { Box } from "@mui/material"
import AppHeader from "./AppHeader"
import AmpanihyData from "./maps/data/Ampanihy.json"
import useCommuneStore from '../../store/communeStore'
import MapMainContent from "./maps/Index"

function MapViews() {
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  const [communeCount, setCommuneCount] = useState(0)
  const [fokotanyCount, setFokotanyCount] = useState(0)
  const { fetchDetailCommune, communedetail } = useCommuneStore()

  const [selectedCommune, setSelectedCommune] = useState(null)
  const [resetView, setResetView] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!AmpanihyData || !AmpanihyData.features) {
          throw new Error("Invalid GeoJSON data structure")
        }

        const communes = new Set(AmpanihyData.features.map(f => f.properties.District_N))
        setCommuneCount(communes.size)

        let fokontany = 0
        AmpanihyData.features.forEach((f) => {
          if (f.properties.fokotany) {
            fokontany += f.properties.fokotany
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

  const handleCommuneClick = (communeId) => {
    setIsAnimating(true)
    setResetView(false)
    fetchDetailCommune(communeId)

    const communeData = AmpanihyData.features.find(
      (f) => f.properties.id === communeId
    )

    if (communeData) {
      setSelectedCommune({
        id: communeId,
        nom: communeData.properties.District_N,
        population: communeData.properties.population || "Non disponible",
        superficie: communeData.properties.superficie || "Non disponible",
        fokotany: communeData.properties.fokotany || "Non disponible",
      })
    }

    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    if (communedetail && selectedCommune) {
      setSelectedCommune(prev => ({
        ...prev,
        population: communedetail.population || prev.population,
        superficie: communedetail.superficie || prev.superficie,
        fokotany: communedetail.fokotany_count || prev.fokotany
      }))
    }
  }, [communedetail])

  const handleBackToOverview = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedCommune(null)
      setResetView(true)
      setTimeout(() => setIsAnimating(false), 800)
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
      <AppHeader scrolled={scrolled} />

      <MapMainContent
        selectedCommune={selectedCommune}
        loading={loading}
        mapError={mapError}
        resetView={resetView}
        isAnimating={isAnimating}
        handleCommuneClick={handleCommuneClick}
        handleBackToOverview={handleBackToOverview}
      />
    </Box>
  )
}

export default MapViews
