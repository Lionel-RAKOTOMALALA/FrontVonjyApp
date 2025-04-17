"use client"

import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useMap } from "react-leaflet"
import L from "leaflet"
import AmpanihyData from "./Ampanihy.json"
import { calculateBBox } from "./MapUtils"

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

function MapController({ selectedCommuneName, resetView, onCommuneClick, resetViewToDefault }) {
  const map = useMap()
  const geoJsonLayerRef = useRef(null)
  const [isInitialized, setIsInitialized] = useState(false)

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
            if (onCommuneClick) {
              onCommuneClick(nomCommune)
            }
          }
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

    // Nettoyer lors du démontage
    return () => {
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current)
      }
    }
  }, [map]) // Dépendance uniquement à map pour s'assurer que cela ne se réexécute pas inutilement

  // Mise à jour des styles quand une commune est sélectionnée
  useEffect(() => {
    if (!geoJsonLayerRef.current || !isInitialized) return

    geoJsonLayerRef.current.eachLayer((layer) => {
      const nomCommune = layer.feature.properties.District_N

      // Appliquer le style approprié en fonction de la sélection
      if (selectedCommuneName) {
        if (nomCommune === selectedCommuneName) {
          applyStyleWithTransition(layer, selectedStyle)

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
            .find((l) => l.feature.properties.District_N === selectedCommuneName)

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
      }
    })

    // Réinitialiser la vue si nécessaire
    if (resetView && !selectedCommuneName) {
      const bounds = calculateBBox(AmpanihyData)
      if (bounds) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          duration: 0.5,
        })
      }
    }
  }, [map, selectedCommuneName, resetView, isInitialized])

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
  }, [resetViewToDefault, isInitialized])

  return null
}

MapController.propTypes = {
  selectedCommuneName: PropTypes.string,
  resetView: PropTypes.bool,
  onCommuneClick: PropTypes.func,
  resetViewToDefault: PropTypes.bool,
}

export default MapController