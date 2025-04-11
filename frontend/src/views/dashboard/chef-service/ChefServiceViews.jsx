import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material'; 
import TableView from '../../../components/ui-table/TableView'; 
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ChefServiceEdit from './ChefServiceEdit';  
import ChefServiceCreate from './ChefServiceCreate';

function ChefServiceViews() {
  const [selectedChefService, setSelectedChefService] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chauffeurToDelete, setChefServiceToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  


  // Données fictives des chauffeurs
  const data = [
    { id: 1,service:'Informatique', nom: 'Rasoanaivo', prenom: 'Hery', permis_conduire: ['B'], experience: 5, status: 'Disponible', contact:'234565342' , adresse:'Betania' , sexe:'Femme' },
    { id: 2,service:'', nom: 'Rakotoarivelo', prenom: 'Naina', permis_conduire: ['C'], experience: 3, status: 'EnMission', contact:'23342456' , adresse:'Ampasikibo' , sexe:'Homme' },
    { id: 3,service:'', nom: 'Andrianarivo', prenom: 'Mamy', permis_conduire: ['D'], experience: 8, status: 'Disponible', contact:'2342356' , adresse:'Bazar' , sexe:'Femme' },
    { id: 4,service:'', nom: 'Ravelojaona', prenom: 'Lova', permis_conduire: ['B'], experience: 10, status: 'EnMission', contact:'234234256' , adresse:'Andakoro' , sexe:'Homme' },
    { id: 5,service:'', nom: 'Mihobisoa', prenom: 'Antsa Sarobidy Hardiot', permis_conduire: ['E', 'B'], experience: 2, status: 'Disponible', contact:'234562424' , adresse:'Andaboly' , sexe:'Femme' },
    { id: 6,service:'', nom: 'Andriantsitohaina', prenom: 'Tiana', permis_conduire: ['E'], experience: 2, status: 'Disponible', contact:'23456452452' , adresse:'Mahavatsy' , sexe:'Homme' },
  ];
  

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'service', label: 'Service', render: (row) => row.service },
    { id: 'nom', label: 'Nom', render: (row) => row.nom },
    { id: 'prenom', label: 'Prénom', render: (row) => row.prenom },   
    { id: 'contact', label: 'Contact', render: (row) => row.contact },  
    { id: 'adresse', label: 'Adresse', render: (row) => row.adresse },
    { id: 'sexe', label: 'Sexe', render: (row) => row.sexe } 
  ];
 
  const handleCreate = () => {
    setSelectedChefService(null);
    setOpenCreateModal(true);
  };
 
  const handleSaveCreate = (chefService) => {
    console.log('Created:', chefService);
    setOpenSnackbar(true);  
    setOpenCreateModal(false); // Ferme le modal après la sauvegarde
  };
 
  const handleEdit = (row) => {
    setSelectedChefService(row);
    setOpenEditModal(true);
  }; 

  const handleSaveEdit = (updatedChefService) => {  
    console.log('Edited:', updatedChefService);
    setOpenEditModal(false);
    setOpenSnackbar(true);
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setChefServiceToDelete(row);
    setOpenDialog(true);
  };

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
        subText="Chef de service" 
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
      <ChefServiceCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)} 
      /> 

      {/* Modal d’édition */}
      <ChefServiceEdit
        isOpen={openEditModal}
        chefService={selectedChefService}
        onChange={(updatedChefService) => setSelectedChefService(updatedChefService)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)} 
      />
      
      {/* Boîte de dialogue de confirmation pour la suppression */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce chefService?"
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

export default ChefServiceViews;