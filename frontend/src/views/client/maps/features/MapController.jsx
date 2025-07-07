"use client"

import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useMap } from "react-leaflet"
import L from "leaflet"
import AmpanihyData from "../data/Ampanihy.json"
import { calculateBBox } from "../../../../utils/maps"

// Style par défaut
const featureStyle = {
  fillColor: "#555555",
  weight: 2,
  opacity: 1,
  color: "white",
  dashArray: "3",
  fillOpacity: 0.7,
}

// Style de sélection
const selectedStyle = {
  weight: 3,
  color: "#666",
  dashArray: "",
  fillOpacity: 0.9,
  fillColor: "#3388ff",
}

// Style pour les éléments non sélectionnés (presque invisible)
const inactiveStyle = {
  weight: 1,
  color: "#ffffff",
  dashArray: "3",
  fillOpacity: 0.2,
  fillColor: "#dddddd",
}

// Style pour l'export PDF (contours plus visibles)
const exportStyle = {
  weight: 4,
  color: "#000000",
  dashArray: "",
  fillOpacity: 0.5,
  fillColor: "#3388ff",
}

function MapController({ selectedCommuneId, resetView, onCommuneClick, resetViewToDefault }) {
  const map = useMap()
  const geoJsonLayerRef = useRef(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const selectedLayerRef = useRef(null)
  
  // Utiliser une ref pour stocker la fonction onCommuneClick
  const onCommuneClickRef = useRef(onCommuneClick)

  // Mettre à jour la ref quand onCommuneClick change
  useEffect(() => {
    onCommuneClickRef.current = onCommuneClick
  }, [onCommuneClick])

  // Fonction pour appliquer une transition CSS aux styles de la couche
  const applyStyleWithTransition = (layer, style, duration = 0.5) => {
    if (!layer || !layer._path) return

    // Ajouter une transition CSS pour les propriétés de style
    layer._path.style.transition = `fill-opacity ${duration}s ease, stroke-opacity ${duration}s ease, fill ${duration}s ease, stroke ${duration}s ease, stroke-width ${duration}s ease`
    layer.setStyle(style)
  }

  // Initialisation de la couche GeoJSON une seule fois
  useEffect(() => {
    // Nettoyer les couches existantes si nécessaire
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current)
    }

    // Créer une nouvelle couche GeoJSON avec les styles et événements
    const geoJsonLayer = L.geoJSON(AmpanihyData, {
      style: () => featureStyle,
      onEachFeature: (feature, layer) => {
        const communeId = feature.properties.id
        const nomCommune = feature.properties.District_N

        // Tooltip
        layer.bindTooltip(nomCommune, {
          sticky: true,
          direction: "top",
          opacity: 0.9,
        })

        // Attacher uniquement l'événement de clic
        layer.on({
          click: () => {
            // Utiliser la ref pour accéder à la fonction actuelle
            if (onCommuneClickRef.current) {
              onCommuneClickRef.current(communeId)
            }
          },
        })
      },
    }).addTo(map)

    // Stocker la référence à la couche
    geoJsonLayerRef.current = geoJsonLayer

    // Ajuster la vue initiale
    const bounds = calculateBBox(AmpanihyData)
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    setIsInitialized(true)

    // Exposer une méthode pour préparer la carte pour l'export PDF
    window.prepareMapForExport = (communeId) => {
      return prepareMapForExport(communeId)
    }

    // Nettoyer lors du démontage
    return () => {
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current)
      }
      delete window.prepareMapForExport
    }
  }, [map]) // Maintenant on n'a plus besoin d'inclure onCommuneClick

  // Fonction pour préparer la carte pour l'export PDF
  const prepareMapForExport = (communeId) => {
    if (!geoJsonLayerRef.current) return null

    // Trouver la couche de la commune sélectionnée
    let selectedLayer = null
    geoJsonLayerRef.current.eachLayer((layer) => {
      if (layer.feature.properties.id === communeId) {
        selectedLayer = layer
      }
    })

    if (!selectedLayer) return null

    // Créer une nouvelle carte temporaire pour l'export avec un fond blanc
    const exportContainer = document.createElement("div")
    exportContainer.style.width = "800px" // Plus large pour un meilleur rendu
    exportContainer.style.height = "600px" // Plus haut pour un meilleur rendu
    exportContainer.style.position = "absolute"
    exportContainer.style.left = "-9999px"
    exportContainer.style.backgroundColor = "#ffffff" // Fond blanc
    document.body.appendChild(exportContainer)

    const exportMap = L.map(exportContainer, {
      attributionControl: false,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    })

    // Ne pas ajouter de fond de carte OpenStreetMap
    // Ajouter un fond blanc en CSS
    const mapContainer = exportMap.getContainer()
    mapContainer.style.backgroundColor = "#ffffff"

    // Créer une copie du GeoJSON pour la commune sélectionnée uniquement
    const selectedFeature = JSON.parse(JSON.stringify(selectedLayer.feature))
    const exportGeoJson = L.geoJSON(selectedFeature, {
      style: exportStyle,
    }).addTo(exportMap)

    // Ajuster la vue sur la commune avec un padding plus important pour dézoomer
    const bounds = exportGeoJson.getBounds()
    exportMap.fitBounds(bounds, {
      padding: [80, 80], // Padding plus important pour dézoomer
      maxZoom: 10, // Limiter le niveau de zoom pour s'assurer que tout est visible
    })

    return {
      map: exportMap,
      container: exportContainer,
      cleanup: () => {
        exportMap.remove()
        document.body.removeChild(exportContainer)
      },
    }
  }

  // Mise à jour des styles quand une commune est sélectionnée
  useEffect(() => {
    if (!geoJsonLayerRef.current || !isInitialized) return

    geoJsonLayerRef.current.eachLayer((layer) => {
      const communeId = layer.feature.properties.id

      // Appliquer le style approprié en fonction de la sélection
      if (selectedCommuneId) {
        if (communeId === selectedCommuneId) {
          applyStyleWithTransition(layer, selectedStyle)
          selectedLayerRef.current = layer

          // Zoom sur la commune sélectionnée
          const bounds = layer.getBounds()
          map.fitBounds(bounds, {
            padding: [50, 50],
            duration: 0.5,
          })

          // Amener au premier plan
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront()
          }
        } else {
          // Animer les autres communes pour qu'elles deviennent presque invisibles
          // avec un délai progressif basé sur la distance
          const selectedLayer = geoJsonLayerRef.current
            .getLayers()
            .find((l) => l.feature.properties.id === selectedCommuneId)

          if (selectedLayer) {
            const selectedCenter = selectedLayer.getBounds().getCenter()
            const currentCenter = layer.getBounds().getCenter()
            const distance = selectedCenter.distanceTo(currentCenter)
            const maxDistance = 100000 // distance maximale estimée en mètres
            const normalizedDelay = Math.min(distance / maxDistance, 1) * 300 // délai max de 300ms

            setTimeout(() => {
              applyStyleWithTransition(layer, inactiveStyle)
            }, normalizedDelay)
          } else {
            applyStyleWithTransition(layer, inactiveStyle)
          }
        }
      } else {
        // Si aucune commune n'est sélectionnée, réinitialiser tous les styles
        applyStyleWithTransition(layer, featureStyle)
        selectedLayerRef.current = null
      }
    })

    // Réinitialiser la vue si nécessaire
    if (resetView && !selectedCommuneId) {
      const bounds = calculateBBox(AmpanihyData)
      if (bounds) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          duration: 0.5,
        })
      }
    }
  }, [map, selectedCommuneId, resetView, isInitialized])

  // Remise à zéro à la vue par défaut
  useEffect(() => {
    if (!isInitialized) return

    if (resetViewToDefault) {
      const bounds = calculateBBox(AmpanihyData)
      if (bounds) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          duration: 0.5,
        })
      }
    }
  }, [resetViewToDefault, isInitialized, map])

  return null
}

MapController.propTypes = {
  selectedCommuneId: PropTypes.number,
  resetView: PropTypes.bool,
  onCommuneClick: PropTypes.func,
  resetViewToDefault: PropTypes.bool,
}

export default MapController