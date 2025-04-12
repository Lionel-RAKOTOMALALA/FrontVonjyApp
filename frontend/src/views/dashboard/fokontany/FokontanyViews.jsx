import React, { useState } from 'react';
import { Box } from '@mui/material';
import SnackbarAlert from '../../../components/ui/SnackbarAlert';
import TableView from '../../../components/ui-table/TableView';
import FokotanyCreate from './FokotanyCreate';
import FokotanyEdit from './FokotanyEdit';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';

function FokotanyViews() {
  const [fokotanyList, setFokotanyList] = useState([
    { id: 1, commune: 'Antananarivo', nomFokotany: 'Anosibe' },
    { id: 2, commune: 'Antsirabe', nomFokotany: 'Ambohimena' },
    { id: 3, commune: 'Fianarantsoa', nomFokotany: 'Tsianolondroa' },
  ]);

  const [selectedFokotany, setSelectedFokotany] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [fokotanyToDelete, setFokotanyToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'commune', label: 'Commune' },
    { id: 'nomFokotany', label: 'Fokotany' },
  ];

  const handleCreate = () => {
    setSelectedFokotany(null);
    setOpenCreateModal(true);
  };
  const handleEdit = (row) => {
    setSelectedFokotany(row);
    setOpenEditModal(true);
  };

  const handleFokotanyChange = (updatedFokotany) => {
    setSelectedFokotany(updatedFokotany);
};

  const handleSaveCreate = async (fokotany) => {
    try {
      const newFokotany = { ...fokotany, id: fokotanyList.length + 1 };
      setFokotanyList(prev => [...prev, newFokotany]);
      setOpenCreateModal(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Fokotany créé avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erreur lors de la création du fokotany:', error);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la création du fokotany.');
      setSnackbarSeverity('error');
    }
  };

  // Fonction de sauvegarde des modifs
  const handleSaveEdit = async (updatedFokotany) => {
    try {
      console.log('Edited:', updatedFokotany);
      setOpenEditModal(false);
      setSnackbarMessage('Fokontany modifié avec succès!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erreur lors de la modification :', error);
      setSnackbarMessage('Erreur lors de la modification. Veuillez réessayer.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleDelete = (row) => {
    setFokotanyToDelete(row);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setFokotanyList(prev => prev.filter(item => item.id !== fokotanyToDelete.id));
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Fokotany supprimé avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la suppression du fokotany.');
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />

      <Breadcrumb
        mainText="Listes"
        subText="Fokotany"
        showCreateButton={true}
        onCreate={handleCreate}
      />

      <Box className="card">
        <TableView
          data={fokotanyList}
          columns={columns}
          rowsPerPage={5}
          onEdit={handleEdit}
          showCheckboxes={true}
          showDeleteIcon={true}
          onDelete={handleDelete}
        />
      </Box>

      <FokotanyCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)}
      />

      <FokotanyEdit
        isOpen={openEditModal}
        fokotany={selectedFokotany}
        onChange={handleFokotanyChange}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)}
      />

      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce fokotany ?"
      />
    </>
  );
}

export default FokotanyViews;
