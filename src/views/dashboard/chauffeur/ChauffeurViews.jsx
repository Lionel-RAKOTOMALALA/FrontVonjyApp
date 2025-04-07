import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import StatusTabs from '../../../components/ui-table/StatusTabs'; 
import TableView, { highlightText } from '../../../components/ui-table/TableView';
import FilterBar from '../../../components/ui-table/FilterBar';
import AddIcon from '@mui/icons-material/Add';
import ChauffeurEdit from './ChauffeurEdit';  
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import ChauffeurCreate from './ChauffeurCreate';

function ChauffeurViews() {
  const [tabIndex, setTabIndex] = useState(0);   
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); 
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chauffeurToDelete, setChauffeurToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue); 
  };

  const statuses = {
    Disponible: { label: "Disponible", color: "success" },
    EnMission: { label: "En mission", color: "warning" }, 
  };

  const filterOptions = [
    { value: 'B', label: 'Permis B' },
    { value: 'C', label: 'Permis C' },
    { value: 'D', label: 'Permis D' },
    { value: 'E', label: 'Permis E' },
  ];

  const data = [
    { id: 1, nom: 'Rasoanaivo', prenom: 'Hery', permis_conduire: ['B'], experience: 5, status: 'Disponible' },
    { id: 2, nom: 'Rakotoarivelo', prenom: 'Naina', permis_conduire: ['C'], experience: 3, status: 'EnMission' },
    { id: 3, nom: 'Andrianarivo', prenom: 'Mamy', permis_conduire: ['D'], experience: 8, status: 'Disponible' },
    { id: 4, nom: 'Ravelojaona', prenom: 'Lova', permis_conduire: ['B'], experience: 10, status: 'EnMission' },
    { id: 5, nom: 'Mihobisoa', prenom: 'Antsa Sarobidy Hardiot', permis_conduire: ['E', 'B'], experience: 2, status: 'Disponible' },
    { id: 6, nom: 'Andriantsitohaina', prenom: 'Tiana', permis_conduire: ['E'], experience: 2, status: 'Disponible' },
  ];
  
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'nom', label: 'Nom', render: (row) => highlightText(row.nom, searchQuery) },
    { id: 'prenom', label: 'Prénom', render: (row) => highlightText(row.prenom, searchQuery) },
    { 
      id: 'permis_conduire', 
      label: 'Permis', 
      render: (row) => (
        <div className="text-center">
          {row.permis_conduire.map((permis, index) => (
            <span key={index}>
              {highlightText(permis, searchQuery)}
              {index < row.permis_conduire.length - 1 && ', '}
            </span>
          ))}
        </div>
      ) 
    },
    { 
      id: 'experience', 
      label: "Années d'expérience", 
      render: (row) => (
        <div className="text-center">
          {row.experience}
        </div>
      ) 
    },
    { 
      id: 'status', 
      label: 'Status', 
      render: (row) => (
        <span className={`badge bg-label-${statuses[row.status]?.color.toLowerCase()} me-1`}>
          {statuses[row.status]?.label}
        </span>
      ) 
    },
  ];

  const handleCreate = () => {
    setSelectedChauffeur(null);
    setOpenCreateModal(true);
  };

  const handleSaveCreate = (chauffeur) => {
    console.log('Created:', chauffeur);
    setOpenSnackbar(true);  
    setOpenCreateModal(false); // Close the modal after saving
  };

  const handleEdit = (row) => {
    setSelectedChauffeur(row);
    setOpenEditModal(true);
  };

  const handleSaveEdit = (updatedChauffeur) => {  
    console.log('Edited:', updatedChauffeur);
    setOpenEditModal(false);
    setOpenSnackbar(true);  // Show a success message
  };

  const handleDelete = (row) => {
    setChauffeurToDelete(row);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    console.log('Deleted:', chauffeurToDelete);
    setOpenDialog(false);
    setOpenSnackbar(true);  
    setChauffeurToDelete(null);
  };

  return (
    <>
      <Breadcrumb 
        mainText="Listes" 
        subText="Chauffeur" 
        showCreateButton={true} 
        onCreate={handleCreate} 
      /> 
      <Box className="card"> 
        <StatusTabs
          tabIndex={tabIndex}
          handleTabChange={handleTabChange}
          data={data}
          statuses={statuses}
        /> 
        <FilterBar
          label="Type de permis"
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={data}
          tabIndex={tabIndex}
          statuses={statuses}
          onFilteredData={setFilteredData}
          filterCriteria={{ filterBy: 'permis_conduire', searchFields: ['nom', 'prenom', 'permis_conduire'] }}
          multiple={false} // ou true si vous utilisez la sélection multiple
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
          />
        )}
      </Box> 
       
      <ChauffeurCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)} 
      /> 

      <ChauffeurEdit
        isOpen={openEditModal}
        chauffeur={selectedChauffeur}
        onChange={(updatedChauffeur) => setSelectedChauffeur(updatedChauffeur)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)} 
      />
      
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce chauffeur?"
      />
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

export default ChauffeurViews;
