import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SnackbarAlert from '../../../components/ui/SnackbarAlert';
import TableView from '../../../components/ui-table/TableView'; 
import CommuneEdit from './CommuneEdit';  
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import CommuneCreate from './CommuneCreate';
import useCommuneStore from '../../../store/communeStore';

function CommuneViews() {
  const {
    communes,
    loading,
    error,
    fetchCommunes,
    createCommune,
    updateCommune,
    deleteCommune
  } = useCommuneStore();

  const [selectedCommune, setSelectedCommune] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [communeToDelete, setCommuneToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Charger les communes au montage du composant
  useEffect(() => {
    fetchCommunes();
  }, [fetchCommunes]);

  // Colonnes du tableau
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'nomCommune', label: 'Nom', render: (row) => row.nomCommune }, 
  ];

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
    }
  }, [error]);

  // Ouvre le modal de création
  const handleCreate = () => {
    setSelectedCommune(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'une nouvelle commune
  const handleSaveCreate = async (commune) => {
    try {
      await createCommune(commune);
      setOpenSnackbar(true);  
      setOpenCreateModal(false);
      setSnackbarMessage('Commune créée avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage(error.message || 'Erreur lors de la création de la commune');
      setSnackbarSeverity('error');
    }
  };

  // Ouvre le modal d'édition
  const handleEdit = (row) => {
    setSelectedCommune(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications
  const handleSaveEdit = async (updatedCommune) => {  
    try {
      await updateCommune(updatedCommune.id, updatedCommune);
      setOpenEditModal(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Commune modifiée avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage(error.message || 'Erreur lors de la modification de la commune');
      setSnackbarSeverity('error');
    }
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setCommuneToDelete(row);
    setOpenDialog(true);
  };

  // Confirme la suppression
  const confirmDelete = async () => {
    try {
      await deleteCommune(communeToDelete.id);
      setOpenDialog(false);
      setOpenSnackbar(true);  
      setSnackbarMessage('Commune supprimée avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage(error.message || 'Erreur lors de la suppression de la commune');
      setSnackbarSeverity('error');
    }
  };

  return (
    <>
      <SnackbarAlert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
        anchorOrigin={{vertical:'top', horizontal:'right'}}
      />
      
      <Breadcrumb 
        mainText="Listes" 
        subText="Commune" 
        showCreateButton={true} 
        onCreate={handleCreate} 
      /> 

      <Box className="card">   
        <TableView 
          data={communes}
          columns={columns} 
          rowsPerPage={5}
          onEdit={handleEdit} 
          onDelete={handleDelete}
          showCheckboxes={false} 
          showDeleteIcon={true}
          loading={loading}
        /> 
      </Box> 
       
      <CommuneCreate
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={(message, severity = 'success') => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setOpenSnackbar(true);
          fetchCommunes(); // Rafraîchir la liste
        }}
      />

      <CommuneEdit
        isOpen={openEditModal}
        commune={selectedCommune}
        onClose={() => setOpenEditModal(false)}
        onSuccess={(message, severity = 'success') => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setOpenSnackbar(true);
          fetchCommunes(); // Rafraîchir la liste
        }}
        key={selectedCommune?.id || 'new-edit-modal'} // Ajout de la clé pour forcer le re-render
      />
      
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer cette commune?"
      />
    </>
  );
}

export default CommuneViews;