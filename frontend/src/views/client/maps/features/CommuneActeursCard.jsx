import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { H4 } from '../../../../components/ui/TypographyVariants'
import { motion } from "framer-motion"
import TableView from '../../../../components/ui-table/TableView'

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

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}
const data = [
  { id: 1, nom: 'Rasoanaivo', prenom: 'Hery', experience: 5, status: 'Disponible' },
  { id: 2, nom: 'Rakotoarivelo', prenom: 'Naina', experience: 3, status: 'EnMission' },
  { id: 3, nom: 'Andrianarivo', prenom: 'Mamy', experience: 8, status: 'Disponible' },
  { id: 4, nom: 'Ravelojaona', prenom: 'Lova', experience: 10, status: 'EnMission' },
  { id: 5, nom: 'Mihobisoa', prenom: 'Antsa Sarobidy Hardiot', experience: 2, status: 'Disponible' },
  { id: 6, nom: 'Andriantsitohaina', prenom: 'Tiana', experience: 2, status: 'Disponible' },
];


// Colonnes du tableau avec formatage personnalisé
const columns = [
  { id: 'id', label: 'Id' },
  { id: 'nom', label: 'Nom', render: (row) => row.nom },
  { id: 'prenom', label: 'Prénom', render: (row) => row.prenom },
  { 
    id: 'experience', 
    label: "Années d'expérience", 
    render: (row) => (
      <div className="text-center">
        {row.experience}
      </div>
    ) 
  }, 
];

function CommuneActeurCard() {
  return (
    <motion.div initial="hidden" className='' animate="visible" exit="exit" variants={cardVariants}>
      <Box className="row mt-4 ">
        <Box className="col-12 my-4">
          <Card
            elevation={3}
            sx={{ borderRadius: 5, overflow: "hidden", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <CardContent className="pt-0">
              {/* {!communeDetails ? (
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
              ) : ( */}
              <motion.div variants={contentVariants}>
                <Box sx={{ mt: 3, p: 0 }}>
                  <H4 sx={{ m: 0, mb:4 }}>Acteurs dans ce commune</H4>
                  <TableView
                    data={data}
                    columns={columns}
                    rowsPerPage={5} 
                    showCheckboxes={false}
                    showDeleteIcon={true} 
                    showActionsColumn={false}
                  />
                </Box>
              </motion.div>
              {/* )} */}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  )
}

export default CommuneActeurCard