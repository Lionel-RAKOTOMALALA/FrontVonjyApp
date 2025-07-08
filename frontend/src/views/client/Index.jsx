"use client"

import { useState, useEffect, useCallback } from "react"
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
  const [, setCommuneCount] = useState(0)
  const [, setFokotanyCount] = useState(0)
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

  const handleCommuneClick = useCallback((communeId) => {
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
  }, [fetchDetailCommune])

  // Solution 1 : Retirer selectedCommune de la condition et utiliser une fonction de callback
  useEffect(() => {
    if (communedetail) {
      setSelectedCommune(prev => {
        // Vérifier si prev existe avant de faire la mise à jour
        if (!prev) return null
        
        return {
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
                chef_service: fokotany.chef_service || [],
                services: fokotany.services || []
              }))
            : [] // Si fokotanys n'est pas un tableau, utilisez un tableau vide
        }
      })
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
          my: 3, 
          mt: 0,
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