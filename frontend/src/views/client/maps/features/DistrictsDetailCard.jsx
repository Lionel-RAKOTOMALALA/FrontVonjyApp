import { Box, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import TableView from '../../../../components/ui-table/TableView';
import useDistrictStore from '../../../../store/useDistrictStore'; // Assure-toi que ce chemin est correct

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
  { id: 'id', label: 'ID' },
  { id: 'acteurs', label: 'Acteurs' },
  { id: 'personne_reference', label: 'Référence' },
  { id: 'contacts', label: 'Contact' },
  { id: 'interventions_actuelles', label: 'Interventions actuelles' },
  { id: 'domaines_intervention_possibles', label: 'Domaines d\'intervention' },
  { id: 'ouverture', label: 'Ouverture' },
];

function DistrictDetailCard() {
  const { districts, fetchDistricts } = useDistrictStore();

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

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
                  <h4 className='m-0 mb-4'>Informations globale</h4> 
                    <TableView
                      data={districts}
                      columns={columns}
                      rowsPerPage={5}
                      showCheckboxes={false}
                      showDeleteIcon={true}
                      showActionsColumn={false}
                    />
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
