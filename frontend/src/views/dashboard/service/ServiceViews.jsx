import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material'; 
import TableView from '../../../components/ui-table/TableView'; 
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ServiceEdit from './ServiceEdit';  
import ServiceCreate from './ServiceCreate';

function ServiceViews() {
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chauffeurToDelete, setChauffeurToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  


  // Données fictives des chauffeurs
  const data = [
    { id: 1, nom: 'Rasoanaivo', prenom: 'Hery', permis_conduire: ['B'], experience: 5, status: 'Disponible' },
    { id: 2, nom: 'Rakotoarivelo', prenom: 'Naina', permis_conduire: ['C'], experience: 3, status: 'EnMission' },
    { id: 3, nom: 'Andrianarivo', prenom: 'Mamy', permis_conduire: ['D'], experience: 8, status: 'Disponible' },
    { id: 4, nom: 'Ravelojaona', prenom: 'Lova', permis_conduire: ['B'], experience: 10, status: 'EnMission' },
    { id: 5, nom: 'Mihobisoa', prenom: 'Antsa Sarobidy Hardiot', permis_conduire: ['E', 'B'], experience: 2, status: 'Disponible' },
    { id: 6, nom: 'Andriantsitohaina', prenom: 'Tiana', permis_conduire: ['E'], experience: 2, status: 'Disponible' },
  ];
  

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'nom', label: 'Nom', render: (row) => row.nom },
    { id: 'prenom', label: 'Prénom', render: (row) => row.prenom },   
  ];

  // Ouvre le modal de création de chauffeur
  const handleCreate = () => {
    setSelectedChauffeur(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'un nouveau chauffeur
  const handleSaveCreate = (chauffeur) => {
    console.log('Created:', chauffeur);
    setOpenSnackbar(true);  
    setOpenCreateModal(false); // Ferme le modal après la sauvegarde
  };

  // Ouvre le modal d'édition avec les infos du chauffeur sélectionné
  const handleEdit = (row) => {
    setSelectedChauffeur(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications d'un chauffeur
  const handleSaveEdit = (updatedChauffeur) => {  
    console.log('Edited:', updatedChauffeur);
    setOpenEditModal(false);
    setOpenSnackbar(true);
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setChauffeurToDelete(row);
    setOpenDialog(true);
  };

  // Confirme la suppression d’un chauffeur
  const confirmDelete = () => {
    console.log('Deleted:', chauffeurToDelete);
    setOpenDialog(false);
    setOpenSnackbar(true);  
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
      <ServiceCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)} 
      /> 

      {/* Modal d’édition */}
      <ServiceEdit
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

      {/* Notification (snackbar) après une action réussie */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Opération réalisée avec succès!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ServiceViews;