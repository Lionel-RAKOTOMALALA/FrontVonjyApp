import { useState, useEffect } from 'react';
import { Box, Avatar } from '@mui/material'; 
import SnackbarAlert from '../../../components/ui/SnackbarAlert';
import TableView from '../../../components/ui-table/TableView'; 
import ChauffeurEdit from './UserEdit';  
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ChauffeurCreate from './UserCreate';
import useSimpleUsersStore from '../../../store/simpleUsersStore';
import { getProfileImageUrl, getInitials, handleImageError } from '../../../utils/imageUtils';

function UserViews() {
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chauffeurToDelete, setChauffeurToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Utiliser le store pour les utilisateurs simples
  const {
    users,
    loading,
    error,
    fetchSimpleUsers,
    createSimpleUser,
    deleteSimpleUser,
    clearError,
    updateSimpleUser
  } = useSimpleUsersStore();

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchSimpleUsers();
  }, []);

  // Afficher les erreurs du store dans le snackbar
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      clearError();
    }
  }, [error, clearError]);

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    // { id: 'uid', label: 'ID' }, // Masqué
    { 
      id: 'photo_profil', 
      label: 'Avatar',
      render: (row) => (
        <Avatar
          src={getProfileImageUrl(row.photo_profil)}
          alt={row.namefull}
          sx={{ 
            width: 40, 
            height: 40,
            fontSize: '0.875rem',
            bgcolor: row.photo_profil ? 'transparent' : '#1976d2'
          }}
          onError={handleImageError}
        >
          {!row.photo_profil && getInitials(row.namefull)}
        </Avatar>
      )
    },
    { id: 'namefull', label: 'Nom et prénoms', render: (row) => row.namefull }, 
    { id: 'email', label: 'Email', render: (row) => row.email },
  ];

  // Ouvre le modal de création d'utilisateur
  const handleCreate = () => {
    setSelectedChauffeur(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'un nouvel utilisateur
  const handleSaveCreate = async (userData) => {
    // Ne rien faire ici, la création est déjà gérée dans UserCreate
    setOpenCreateModal(false);
    setOpenSnackbar(true);
    setSnackbarMessage('Utilisateur créé avec succès!');
    setSnackbarSeverity('success');
  };

  // Ouvre le modal d'édition avec les infos de l'utilisateur sélectionné
  const handleEdit = (row) => {
    setSelectedChauffeur(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications d'un utilisateur
  const handleSaveEdit = async (updatedUser) => {
    try {
      const result = await updateSimpleUser(updatedUser.uid, updatedUser);
      if (result.success) {
        setOpenEditModal(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Utilisateur modifié avec succès!');
        setSnackbarSeverity('success');
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage(`Erreur: ${result.error}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la modification. Veuillez réessayer.');
      setSnackbarSeverity('error');
    }
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setChauffeurToDelete(row);
    setOpenDialog(true);
  };

  // Confirme la suppression d'un utilisateur
  const confirmDelete = async () => {
    try {
      const result = await deleteSimpleUser(chauffeurToDelete.uid);
      if (result.success) {
        setOpenDialog(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Utilisateur supprimé avec succès!');
        setSnackbarSeverity('success');
      } else {
        setOpenDialog(false);
        setOpenSnackbar(true);
        setSnackbarMessage(`Erreur: ${result.error}`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la suppression de l\'utilisateur.');
      setSnackbarSeverity('error');
    }
  };

  return (
    <>
      {/* Notification avec SnackbarAlert */}
      <SnackbarAlert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />

      {/* Fil d'Ariane avec bouton de création */}
      <Breadcrumb 
        mainText="Listes" 
        subText="Utilisateurs" 
        showCreateButton={true} 
        onCreate={handleCreate} 
      /> 

      {/* Tableau principal affichant les utilisateurs */}
      <Box className="card">   
        <TableView 
          data={users}
          columns={columns} 
          rowsPerPage={5}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showCheckboxes={false}
          loading={loading}
        /> 
      </Box> 
       
      {/* Modal de création */}
      <ChauffeurCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)} 
      /> 

      {/* Modal d'édition */}
      <ChauffeurEdit
        isOpen={openEditModal}
        chauffeur={selectedChauffeur}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)} 
      />

      {/* Dialogue de confirmation pour la suppression */}
      <ConfirmationDialog
        open={openDialog}
        title="Confirmer la suppression"
        content={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${chauffeurToDelete?.namefull}" ?`}
        onConfirm={confirmDelete}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}

export default UserViews;