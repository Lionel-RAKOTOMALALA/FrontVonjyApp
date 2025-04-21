"use client"

import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography } from "@mui/material"
import { H4 } from "../../../../components/ui/TypographyVariants"
import { motion } from "framer-motion"
import CollapsibleTable from "../../../../components/ui-table/CollapsibleTable"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import SchoolIcon from "@mui/icons-material/School"
import WorkIcon from "@mui/icons-material/Work"
import LocationCityIcon from "@mui/icons-material/LocationCity"
import PeopleIcon from "@mui/icons-material/People"

const getServiceIcon = (serviceName) => {
  if (serviceName.toLowerCase().includes("santé")) return <LocalHospitalIcon color="primary" />
  if (serviceName.toLowerCase().includes("éduc")) return <SchoolIcon color="primary" />
  if (serviceName.toLowerCase().includes("sécurité")) return <WorkIcon color="primary" />
  if (serviceName.toLowerCase().includes("agricole")) return <LocationCityIcon color="primary" />
  return <PeopleIcon color="primary" />
}

const CommuneDetailsCard = ({ selectedCommune }) => {
  console.log(selectedCommune)
  const [communeDetails, setCommuneDetails] = useState(null)

  useEffect(() => {
    if (selectedCommune && Array.isArray(selectedCommune.fokotanys)) {
      // Mise en forme directe de selectedCommune en respectant le format attendu
      setCommuneDetails({
        id: selectedCommune.id,
        nomCommune: selectedCommune.nomCommune,
        fokotanys: selectedCommune.fokotanys.map((fokotany) => ({
          id: fokotany.id,
          nomFokotany: fokotany.nomFokotany,
          responsables: fokotany.responsables,
          responsables_count: fokotany.responsables_count,
          services: fokotany.services,
          services_count: fokotany.services_count,
        })),
      })
    } else {
      setCommuneDetails(null) // Si selectedCommune ou fokotanys est invalide
    }
  }, [selectedCommune])

  if (!selectedCommune) return null

  const fokotanyColumns = [
    { field: "nomFokotany", label: "Nom du Fokotany" },
    { field: "responsables_count", label: "Responsables", align: "center" },
    { field: "services_count", label: "Services", align: "center" },
  ]

  const responsableColumns = [
    { field: "classe_responsable", label: "Rôle" },
    { field: "nom_responsable", label: "Nom" },
    { field: "prenom_responsable", label: "Prénom" },
    { field: "fonction", label: "Fonction" },
    { field: "contact_responsable", label: "Contact" },
  ]

  const serviceColumns = [
    { field: "nomService", label: "Service" },
    { field: "description", label: "Description" },
    { field: "offre", label: "Offre" },
    { field: "membre", label: "Membres" },
    { field: "nombre_membre", label: "Nombre", align: "center" },
  ]

  const detailTables = [
    {
      title: "Responsables du Fokotany",
      columns: responsableColumns,
      getData: (row) => row.responsables || [],
    },
    {
      title: "Services disponibles",
      columns: serviceColumns,
      getData: (row) => row.services || [],
    },
  ]

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  }

  // Animation variants for the content
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={cardVariants}>
      <Box className="row mt-4">
        <Box className="col-12">
          <Card
            elevation={3}
            sx={{ borderRadius: 5, overflow: "hidden", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent>
              {!communeDetails ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Les données détaillées pour cette commune ne sont pas encore disponibles.
                  </Typography>
                </Box>
              ) : (
                <motion.div variants={contentVariants}>
                  <Box sx={{ mt: 3 }}>
                    <H4 sx={{ mb: 2 }}>Fokotany de {communeDetails.nomCommune}</H4>
                    <CollapsibleTable
                      columns={fokotanyColumns}
                      rows={communeDetails.fokotanys}
                      detailTables={detailTables}
                      arrowPosition="left"
                    />
                  </Box>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  )
}

export default CommuneDetailsCard
