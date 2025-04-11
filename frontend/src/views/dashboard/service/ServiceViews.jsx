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
    { id: 1,fokontany:'Ampanihy', nom: 'Service 1', description: 'Description du service 1', offre: 'Offre standard', nombreMembre: 5 },
    { id: 2,fokontany:'Androka', nom: 'Service 2', description: 'Description du service 2', offre: 'Offre premium', nombreMembre: 3 },
    { id: 3,fokontany:'Ejeda', nom: 'Service 3', description: 'Description du service 3', offre: 'Offre basic', nombreMembre: 8 },
    { id: 4,fokontany:'Gogogogo', nom: 'Service 4', description: 'Description du service 4', offre: 'Offre standard', nombreMembre: 10 },
  ];
  

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'fokontany', label: 'Fokontany', render: (row) => row.fokontany },
    { id: 'nom', label: 'Nom', render: (row) => row.nom },
    { id: 'description', label: 'Description', render: (row) => row.description },
    { id: 'offre', label: 'Offre',
      render: (row) => (
        <div className="text-center">
          {row.offre}
        </div>
      ) },
    { id: 'nombreMembre', label: 'Nombre de membres', 
      render: (row) => (
        <div className="text-center">
          {row.offre}
        </div>
      ) }  
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

  // Confirme la suppression d'un chauffeur
  const confirmDelete = () => {
    console.log('Deleted:', chauffeurToDelete);
    setOpenDialog(false);
    setOpenSnackbar(true);  
  };

  return (
    <>
      {/* Fil d'Ariane avec bouton de création */}
      <Breadcrumb 
        mainText="Listes" 
        subText="Service" 
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

      {/* Modal d'édition */}
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
        content="Êtes-vous sûr de vouloir supprimer ce service?"
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