import { Box, Card, CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { H4 } from '../../../../components/ui/TypographyVariants';
import { motion } from 'framer-motion';
import CollapsibleTable from '../../../../components/ui-table/CollapsibleTable';
import useDistrictStore from '../../../../store/useDistrictStore';

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
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// Colonnes principales du tableau (sans les colonnes qui iront dans le sous-tableau)
const collapsibleColumns = [
  { field: 'id', label: 'ID', align: 'center' },
  { field: 'acteurs', label: 'Acteurs' },
  { field: 'personne_reference', label: 'Référence' },
  { field: 'contacts', label: 'Contact' },
  { field: 'ouverture', label: 'Ouverture' },
];

// Colonnes pour le sous-tableau (détails des interventions)
const detailColumns = [
  { field: 'interventions_actuelles', label: 'Interventions actuelles' },
  { field: 'domaines_intervention_possibles', label: 'Domaines d\'intervention' },
];

function DistrictDetailCard() {
  const { districts, fetchDistricts, loading, error } = useDistrictStore();
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  // Fonction pour récupérer les données détaillées pour chaque district
  const getDetailData = (row) => {
    // Retourne les données du district actuel pour le sous-tableau
    return [
      {
        interventions_actuelles: row.interventions_actuelles || 'Aucune intervention',
        domaines_intervention_possibles: row.domaines_intervention_possibles || 'Aucun domaine spécifié',
      }
    ];
  };

  if (loading) {
    return (
      <motion.div initial="hidden" className="" animate="visible" exit="exit" variants={cardVariants}>
        <Box className="row mt-4">
          <Box className="col-12 my-4">
            <Card elevation={3} sx={{ borderRadius: 5, overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent className="pt-0">
                <Box sx={{ mt: 3, p: 0 }}>
                  <H4 sx={{ m: 0, mb: 4 }}>Informations globale</H4>
                  <p>Chargement des données...</p>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial="hidden" className="" animate="visible" exit="exit" variants={cardVariants}>
        <Box className="row mt-4">
          <Box className="col-12 my-4">
            <Card elevation={3} sx={{ borderRadius: 5, overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent className="pt-0">
                <Box sx={{ mt: 3, p: 0 }}>
                  <H4 sx={{ m: 0, mb: 4 }}>Informations globale</H4>
                  <p>Erreur lors du chargement des données: {error}</p>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" className="" animate="visible" exit="exit" variants={cardVariants}>
      <Box className="row mt-4">
        <Box className="col-12 my-4">
          <Card
            elevation={3}
            sx={{
              borderRadius: 5,
              overflow: 'hidden',
              bgcolor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent className="pt-0">
              <motion.div variants={contentVariants}>
                <Box sx={{ mt: 3, p: 0 }}>
                  <H4 sx={{ m: 0, mb: 4 }}>Informations globale</H4>
                  <Box 
                    sx={{
                      '& .MuiTableHead-root .MuiTableCell-root': {
                        backgroundColor: '#fef3c7 !important',
                        color: '#333 !important',
                        fontWeight: 'bold !important'
                      },
                      '& .MuiTableHead-root .MuiTableCell-head': {
                        backgroundColor: '#fef3c7 !important',
                        color: '#333 !important',
                        fontWeight: 'bold !important'
                      },
                      '& thead th': {
                        backgroundColor: '#fef3c7 !important',
                        color: '#333 !important',
                        fontWeight: 'bold !important'
                      },
                      '& .table-header': {
                        backgroundColor: '#fef3c7 !important',
                        color: '#333 !important',
                        fontWeight: 'bold !important'
                      },
                      '& .collapsible-table-header': {
                        backgroundColor: '#fef3c7 !important',
                        color: '#333 !important',
                        fontWeight: 'bold !important'
                      }
                    }}
                  >
                    <CollapsibleTable
                      columns={collapsibleColumns}
                      rows={districts}
                      detailTables={[
                        {
                          title: "Détails des interventions",
                          columns: detailColumns,
                          getData: getDetailData
                        }
                      ]}
                      arrowPosition="left"
                      expandedRows={expandedRows}
                      onExpandedRowsChange={setExpandedRows}
                      // Props pour enlever les actions
                      showActionsColumn={false}
                      showDeleteIcon={false}
                      showEditIcon={false}
                    />
                  </Box>
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}

export default DistrictDetailCard;