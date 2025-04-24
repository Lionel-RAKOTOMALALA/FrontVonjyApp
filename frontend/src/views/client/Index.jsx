"use client"

import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import AppHeader from "./AppHeader"
import AmpanihyData from "./maps/data/Ampanihy.json"
import useCommuneStore from '../../store/communeStore'
import MapMainContent from "./maps/Index"
import jwtDecode from "jwt-decode"

function MapViews() {
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  const [communeCount, setCommuneCount] = useState(0)
  const [fokotanyCount, setFokotanyCount] = useState(0)
  const { fetchDetailCommune, fetchTotals, totals, communedetail } = useCommuneStore()

  const [selectedCommune, setSelectedCommune] = useState(null)
  const [resetView, setResetView] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 70)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // ou sessionStorage selon ton cas

    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      console.log("Rôle :", decoded.role);
    
      // Tu peux aussi gérer des conditions selon le rôle
      if (decoded.role === "admin") {
        // Afficher des éléments réservés à l'admin
      } else {
        // Accès utilisateur classique
      }
    }
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

  // Appel à fetchTotals pour récupérer les totaux au montage du composant
  useEffect(() => {
    fetchTotals()
  }, [fetchTotals])

  const handleCommuneClick = (communeId) => {
    setIsAnimating(true)
    setResetView(false)
    fetchDetailCommune(communeId)
    console.log("Fetching commune detail...")

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
      console.log("Commune detail:", communedetail)

      setSelectedCommune(prev => ({
        ...prev,
        id: communedetail.id || prev.id,
        nomCommune: communedetail.nomCommune || prev.nomCommune,
        total_fokotanys: communedetail.total_fokotanys || prev.total_fokotanys,
        total_services: communedetail.total_services || prev.total_services,
        fokotanys: Array.isArray(communedetail.fokotanys)
          ? communedetail.fokotanys.map(fokotany => ({
              id: fokotany.id,
              nomFokotany: fokotany.nomFokotany,
              responsables_count: fokotany.responsables_count,
              services_count: fokotany.services_count,
              responsables: fokotany.responsables || [],
              services: fokotany.services || []
            }))
          : [] // Si fokotanys n'est pas un tableau, utilisez un tableau vide
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
        position: "relative",
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
        totals={totals} // Passage des totaux à MapMainContent
      />

      {/* Copyright footer */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "text.secondary",
          zIndex: 10,
          fontSize: "0.75rem",
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} EducTech Toliara. Tous droits réservés.
      </Typography>
    </Box>
  )
}

export default MapViews