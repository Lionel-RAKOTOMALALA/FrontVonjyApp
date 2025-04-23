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
import CustomButton from "../../../../components/ui/CustomButton"
import CommunePDFExporter from "./CommunePDFExporter"

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

  // Fonction pour exporter les données en PDF
  const handleExportPDF = async () => {
    if (communeDetails) {
      await CommunePDFExporter.exportCommune(communeDetails)
    }
  }

  // Fonction pour exporter un fokotany spécifique
  const handleExportFokotany = async (fokotany) => {
    if (fokotany && communeDetails) {
      await CommunePDFExporter.exportFokotany(fokotany, communeDetails.nomCommune, communeDetails.id)
    }
  }

  // Options additionnelles pour CollapsibleTable
  const tableActions = {
    label: "Actions",
    actions: [
      {
        label: "Exporter Fokotany",
        onClick: (row) => handleExportFokotany(row),
        icon: "PictureAsPdf", // Si vous avez une gestion d'icônes dans CollapsibleTable
      },
    ],
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={cardVariants}>
      <Box className="row mt-4">
        <Box className="col-12">
          <Card
            elevation={3}
            sx={{ borderRadius: 5, overflow: "hidden", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent className="pt-0">
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
                  <Box sx={{ mt: 3, p: 0 }}>
                    <Box className="d-flex justify-content-between align-items-center mb-4">
                      <H4 sx={{ m: 0 }}>Fokotany de {communeDetails.nomCommune}</H4>
                      <CustomButton color="warning" onClick={handleExportPDF}>
                        Exporter PDF
                      </CustomButton>
                    </Box>
                    <CollapsibleTable
                      columns={fokotanyColumns}
                      rows={communeDetails.fokotanys}
                      detailTables={detailTables}
                      arrowPosition="left"
                      accordion={true}
                      actions={tableActions} // Si votre CollapsibleTable supporte cette prop
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
