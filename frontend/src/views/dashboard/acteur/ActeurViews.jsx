import React, { useState, useEffect } from 'react';
import { Box, Button, Alert } from '@mui/material';
import StatusTabs from '../../../components/ui-table/StatusTabs'; 
import TableView, { highlightText } from '../../../components/ui-table/TableView';
import FilterBar from '../../../components/ui-table/FilterBar';
import ActeurEdit from './ActeurEdit';  
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ActeurCreate from './ActeurCreate';
import SnackbarAlert from '../../../components/ui/SnackbarAlert';
import useActeursCommuneStore from '../../../store/acteursCommuneStore';

function ActeursView() {
  const {
    acteurs,
    loading,
    error,
    fetchActeurs,
    addActeur,
    updateActeur,
    deleteActeur
  } = useActeursCommuneStore();

  const [tabIndex, setTabIndex] = useState(0);   
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); 
  const [selectedActeur, setSelectedActeur] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [acteurToDelete, setActeurToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch data from backend
  useEffect(() => {
    // Note: vous devrez adapter idCommune selon votre logique
    const idCommune = 1; // ou récupérer depuis les props/context/params
    fetchActeurs(idCommune);
  }, [fetchActeurs]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
    }
  }, [error]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue); 
  };

  const statuses = {
    Actif: { label: "Actif", color: "success" },
    Inactif: { label: "Inactif", color: "error" }, 
  };

  const filterOptions = [
    { value: 'Maire', label: 'Maire' },
    { value: 'Adjoint', label: 'Adjoint au Maire' },
    { value: 'Conseiller', label: 'Conseiller Municipal' },
    { value: 'Responsable', label: 'Responsable Service' },
    { value: 'Directeur', label: 'Directeur' },
  ];
  
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'nom', label: 'Nom', render: (row) => highlightText(row.nom || '', searchQuery) },
    { id: 'prenom', label: 'Prénom', render: (row) => highlightText(row.prenom || '', searchQuery) },
    { 
      id: 'role_acteurs', 
      label: 'Rôle', 
      render: (row) => (
        <div className="text-left">
          {highlightText(row.role_acteurs || '', searchQuery)}
        </div>
      ) 
    },
    { 
      id: 'commune', 
      label: 'Commune', 
      render: (row) => (
        <div className="text-center">
          {row.commune ? highlightText(row.commune.nomCommune || '', searchQuery) : 'N/A'}
        </div>
      ) 
    },
    { 
      id: 'contact', 
      label: 'Contact', 
      render: (row) => (
        <div className="text-center">
          {row.contact || 'N/A'}
        </div>
      ) 
    },
    
  ];

  const handleCreate = () => {
    setSelectedActeur(null);
    setOpenCreateModal(true);
  };

  const handleSaveCreate = async (acteur) => {
    try {
      const result = await addActeur(acteur);
      if (result.success) {
        setOpenCreateModal(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Acteur créé avec succès!');
        setSnackbarSeverity('success');
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage(result.error?.message || 'Erreur lors de la création de l\'acteur');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la création de l\'acteur');
      setSnackbarSeverity('error');
    }
  };

  const handleEdit = (row) => {
    setSelectedActeur(row);
    setOpenEditModal(true);
  };

  const handleSaveEdit = async (updatedActeur) => {  
    try {
      const result = await updateActeur(updatedActeur.id, updatedActeur);
      if (result.success) {
        setOpenEditModal(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Acteur modifié avec succès!');
        setSnackbarSeverity('success');
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage(result.error?.message || 'Erreur lors de la modification de l\'acteur');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la modification de l\'acteur');
      setSnackbarSeverity('error');
    }
  };

  const handleDelete = (row) => {
    setActeurToDelete(row);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteActeur(acteurToDelete.id);
      if (result.success) {
        setOpenDialog(false);
        setOpenSnackbar(true);
        setSnackbarMessage('Acteur supprimé avec succès!');
        setSnackbarSeverity('success');
        setActeurToDelete(null);
      } else {
        setOpenDialog(false);
        setOpenSnackbar(true);
        setSnackbarMessage(result.error?.message || 'Erreur lors de la suppression de l\'acteur');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setOpenDialog(false);
      setOpenSnackbar(true);
      setSnackbarMessage('Erreur lors de la suppression de l\'acteur');
      setSnackbarSeverity('error');
    }
  };

  if (loading && acteurs.length === 0) {
    return (
      <Box className="card p-4">
        <div className="text-center">Chargement des acteurs...</div>
      </Box>
    );
  }

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
        subText="Acteurs" 
        showCreateButton={true} 
        onCreate={handleCreate} 
      /> 
      
      <Box className="card"> 
        <StatusTabs
          tabIndex={tabIndex}
          handleTabChange={handleTabChange}
          data={acteurs}
          statuses={statuses}
        /> 
        <FilterBar
          label="Type de rôle"
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={acteurs}
          tabIndex={tabIndex}
          statuses={statuses}
          onFilteredData={setFilteredData}
          filterCriteria={{ filterBy: 'role_acteurs', searchFields: ['nom', 'prenom', 'role_acteurs', 'commune.nomCommune'] }}
          multiple={false}
        />
        {filteredData.length > 0 && (
          <TableView 
            data={filteredData}
            columns={columns}
            statuses={statuses}
            rowsPerPage={5}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showCheckboxes={true}
            loading={loading}
          />
        )}
      </Box> 
       
      <ActeurCreate
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={(message, severity = 'success') => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setOpenSnackbar(true);
        }}
      /> 

      <ActeurEdit
        isOpen={openEditModal}
        acteur={selectedActeur}
        onSave={() => setOpenEditModal(false)}
        onClose={() => setOpenEditModal(false)}
        onSuccess={(message, severity = 'success') => {
          setSnackbarMessage(message);
          setSnackbarSeverity(severity);
          setOpenSnackbar(true);
        }}
        key={selectedActeur?.id || 'new-edit-modal'}
      />
      
      
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer cet acteur?"
      />
    </>
  );
}

export default ActeursView;