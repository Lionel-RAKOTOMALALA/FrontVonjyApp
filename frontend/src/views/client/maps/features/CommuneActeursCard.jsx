import { Box, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import TableView from '../../../../components/ui-table/TableView';
import useActeursCommuneStore from '../../../../store/acteursCommuneStore';

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

// Colonnes du tableau avec formatage personnalisé
const columns = [
  { id: 'id', label: 'Id' },
  { id: 'role_acteurs', label: 'Rôle', render: (row) => row.role_acteurs || 'N/A' },
  { id: 'nom', label: 'Nom', render: (row) => row.nom || 'N/A' },
  { id: 'prenom', label: 'Prénom', render: (row) => row.prenom || 'N/A' },
  {
    id: 'contact',
    label: 'Contact',
    render: (row) => row.contact || 'N/A',
  },
  {
    id: 'interventions_actuelles',
    label: 'Interventions actuelles',
    render: (row) => row.interventions_actuelles || 'N/A',
  },
];

function CommuneActeurCard({ selectedCommune }) { 
  
  const { acteurs, loading, error, fetchActeursById } = useActeursCommuneStore();

  // Récupérer les données des acteurs pour une commune spécifique
  useEffect(() => {
    if (selectedCommune?.id) {
      fetchActeursById(selectedCommune.id); // Appeler le store avec l'ID de la commune
    }
  }, [selectedCommune, fetchActeursById]);

  return (
    <motion.div initial="hidden" className="" animate="visible" exit="exit" variants={cardVariants}>
      <Box className="row mt-4 ">
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
                  <h4 className='m-0 mb-4'>Acteurs dans cette commune</h4>
                  {loading ? (
                    <div>Chargement des données...</div>
                  ) : error ? (
                    <div>Erreur : {error}</div>
                  ) : (
                    <TableView
                      data={acteurs}
                      columns={columns}
                      rowsPerPage={5}
                      showCheckboxes={false}
                      showDeleteIcon={true}
                      showActionsColumn={false}
                    />
                  )}
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}

export default CommuneActeurCard;