import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material'; 
import TableView from '../../../components/ui-table/TableView'; 
import CommuneEdit from './CommuneEdit';  
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import CommuneCreate from './CommuneCreate';

function CommuneViews() {
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [communeToDelete, setCommuneToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Données fictives des chauffeurs
  const data = [
    { id: 1, nom: 'Rasoanaivo',  },
    { id: 2, nom: 'Rakotoarivelo', },
    { id: 3, nom: 'Andrianarivo',  },
    { id: 4, nom: 'Ravelojaona', },
    { id: 5, nom: 'Mihobisoa' },
    { id: 6, nom: 'Andriantsitohaina', },
  ];
  

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'nom', label: 'Nom', render: (row) => row.nom }, 
  ];

  // Ouvre le modal de création de chauffeur
  const handleCreate = () => {
    setSelectedCommune(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'un nouveau chauffeur
  const handleSaveCreate = async (commune) => {
    try {
      console.log('Created:', commune);
      setOpenSnackbar(true);  
      setOpenCreateModal(false); // Ferme le modal après la sauvegarde
      setSnackbarMessage('Commune créée avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erreur lors de la création du commune:', error);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la création du commune. Veuillez réessayer.');
      setSnackbarSeverity('error');
    }
  };

  // Ouvre le modal d'édition avec les infos du commune sélectionné
  const handleEdit = (row) => {
    setSelectedCommune(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications d'un commune
  const handleSaveEdit = async (updatedCommune) => {  
    try {
      console.log('Edited:', updatedCommune);
      setOpenEditModal(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Commune modifiée avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erreur lors de l\'édition du commune:', error);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la modification du commune. Veuillez réessayer.');
      setSnackbarSeverity('error');
    }
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setCommuneToDelete(row);
    setOpenDialog(true);
  };

  // Confirme la suppression d’un chauffeur
  const confirmDelete = async () => {
    try {
      console.log('Deleted:', communeToDelete);
      setOpenDialog(false);
      setOpenSnackbar(true);  
      setSnackbarMessage('Commune supprimée avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erreur lors de la suppression du commune:', error);
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la suppression du commune. Veuillez réessayer.');
      setSnackbarSeverity('error');
    }
  };

  return (
    <>
      {/* Fil d’Ariane avec bouton de création */}
      <Breadcrumb 
        mainText="Listes" 
        subText="Commune" 
        showCreateButton={true} 
        onCreate={handleCreate} 
      /> 

      {/* Tableau principal affichant les chauffeurs */}
      <Box className="card">   
        <TableView 
          data={data}
          columns={columns} 
          rowsPerPage={5}
          onEdit={handleEdit} 
          showCheckboxes={true} 
          showDeleteIcon={false} 
        /> 
      </Box> 
       
      {/* Modal de création */}
      <CommuneCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)} 
      /> 

      {/* Modal d’édition */}
      <CommuneEdit
        isOpen={openEditModal}
        commune={selectedCommune}
        onChange={(updatedCommune) => setSelectedCommune(updatedCommune)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)} 
      />
      
      {/* Boîte de dialogue de confirmation pour la suppression */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce chauffeur?"
      />

      {/* Notification (snackbar) après une action réussie */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CommuneViews;
