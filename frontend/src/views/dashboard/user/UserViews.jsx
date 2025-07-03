import React, { useState } from 'react';
import { Box, Avatar } from '@mui/material'; 
import SnackbarAlert from '../../../components/ui/SnackbarAlert';
import TableView from '../../../components/ui-table/TableView'; 
import ChauffeurEdit from './UserEdit';  
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ChauffeurCreate from './UserCreate';

function UserViews() {
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chauffeurToDelete, setChauffeurToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Données fictives des chauffeurs avec avatars
  const data = [
    { 
      id: 1, 
      nameFull: 'Rasoanaivo Hery', 
      email: 'test@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 2, 
      nameFull: 'Rakotoarivelo Naina', 
      email: 'test@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a2?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 3, 
      nameFull: 'Andrianarivo Mamy', 
      email: 'test@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 4, 
      nameFull: 'Ravelojaona Lova', 
      email: 'test@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: 5, 
      nameFull: 'Mihobisoa Antsa', 
      email: 'test@gmail.com',
      avatar: null // Pas d'avatar pour tester le fallback
    },
    { 
      id: 6, 
      nameFull: 'Andriantsitohaina Tiana', 
      email: 'test@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
  ];

  // Fonction pour générer les initiales à partir du nom complet
  const getInitials = (nameFull) => {
    if (!nameFull) return '';
    const names = nameFull.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
    return initials.substring(0, 2); // Prendre seulement les 2 premières initiales
  };

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    { id: 'id', label: 'Id' },
    { 
      id: 'avatar', 
      label: 'Avatar',
      render: (row) => (
        <Avatar
          src={row.avatar}
          alt={row.nameFull}
          sx={{ 
            width: 40, 
            height: 40,
            fontSize: '0.875rem',
            bgcolor: row.avatar ? 'transparent' : '#1976d2'
          }}
        >
          {!row.avatar && getInitials(row.nameFull)}
        </Avatar>
      )
    },
    { id: 'namefull', label: 'Nom et prenom', render: (row) => row.nameFull }, 
    { id: 'email', label: 'Email', render: (row) => row.email }, 
  ];

  // Ouvre le modal de création de chauffeur
  const handleCreate = () => {
    setSelectedChauffeur(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'un nouveau chauffeur
  const handleSaveCreate = async (chauffeur) => {
    try {
      console.log('Created:', chauffeur);
      setOpenCreateModal(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Utilisateur créé avec succès!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la création de l\'utilisateur.');
      setSnackbarSeverity('error');
    }
  };

  // Ouvre le modal d'édition avec les infos du chauffeur sélectionné
  const handleEdit = (row) => {
    setSelectedChauffeur(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications d'un chauffeur
  const handleSaveEdit = async (updatedChauffeur) => {
    try {
      console.log('Edited:', updatedChauffeur);
      setOpenEditModal(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Utilisateur modifié avec succès!');
      setSnackbarSeverity('success');
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

  // Confirme la suppression d'un chauffeur
  const confirmDelete = async () => {
    try {
      console.log('Deleted:', chauffeurToDelete);
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Utilisateur supprimé avec succès!');
      setSnackbarSeverity('success');
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
        subText="Chauffeur" 
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
          onDelete={handleDelete}
          showCheckboxes={false} 
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
        onChange={(updatedChauffeur) => setSelectedChauffeur(updatedChauffeur)}
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
    </>
  );
}

export default UserViews;