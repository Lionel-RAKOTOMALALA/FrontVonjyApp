import React, { useState, useEffect } from 'react';
import { Box, Button, Alert } from '@mui/material';
import StatusTabs from '../../../components/ui-table/StatusTabs'; 
import TableView, { highlightText } from '../../../components/ui-table/TableView';
import CollapsibleTable from '../../../components/ui-table/CollapsibleTable';
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
  const [expandedRows, setExpandedRows] = useState({});

  // Fonction pour vérifier si le terme de recherche est dans les détails
  const shouldExpandRow = (row, searchQuery) => {
    if (!searchQuery) return false;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Vérifier dans interventions_actuelles
    if (row.interventions_actuelles) {
      const interventions = Array.isArray(row.interventions_actuelles) 
        ? row.interventions_actuelles 
        : [row.interventions_actuelles];
      
      for (const intervention of interventions) {
        if (intervention && intervention.toString().toLowerCase().includes(searchLower)) {
          return true;
        }
      }
    }
    
    // Vérifier dans domaines_intervention_possibles
    if (row.domaines_intervention_possibles) {
      const domaines = Array.isArray(row.domaines_intervention_possibles) 
        ? row.domaines_intervention_possibles 
        : [row.domaines_intervention_possibles];
      
      for (const domaine of domaines) {
        if (domaine && domaine.toString().toLowerCase().includes(searchLower)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Effet pour étendre automatiquement les lignes lors de la recherche
  useEffect(() => {
    if (searchQuery && filteredData.length > 0) {
      const newExpandedRows = {};
      
      filteredData.forEach(row => {
        if (shouldExpandRow(row, searchQuery)) {
          newExpandedRows[row.id] = true;
        }
      });
      
      setExpandedRows(newExpandedRows);
    } else {
      // Réinitialiser quand il n'y a pas de recherche
      setExpandedRows({});
    }
  }, [searchQuery, filteredData]);

  // Fetch data from backend
  useEffect(() => {
    fetchActeurs();
  }, [fetchActeurs]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
    }
  }, [error]);
  
  // Colonnes pour la table principale (CollapsibleTable)
  const collapsibleColumns = [
    { field: 'id', label: 'Id', align: 'center' },
    { 
      field: 'nom', 
      label: 'Nom',
      render: (row) => highlightText(row.nom || '', searchQuery)
    },
    { 
      field: 'prenom', 
      label: 'Prénom',
      render: (row) => highlightText(row.prenom || '', searchQuery)
    },
    { 
      field: 'role_acteurs', 
      label: 'Rôle',
      render: (row) => highlightText(row.role_acteurs || '', searchQuery)
    },
    { 
      field: 'commune', 
      label: 'Commune',
      align: 'center',
      render: (row) => row.commune ? highlightText(row.commune.nomCommune || '', searchQuery) : 'N/A'
    },
    { 
      field: 'contact', 
      label: 'Contact',
      align: 'center',
      render: (row) => highlightText(row.contact || 'N/A', searchQuery)
    }
  ];

// Remplacer la fonction getDetailData par celle-ci :

// Fonction pour récupérer les données détaillées pour chaque acteur avec surlignage
const getDetailData = (row) => {
  const details = [];
  // Ajouter les interventions actuelles
  if (row.interventions_actuelles) {
    const interventions = Array.isArray(row.interventions_actuelles) 
      ? row.interventions_actuelles 
      : [row.interventions_actuelles];
    
    interventions.forEach((intervention, index) => {
      details.push({
        id: `intervention_${index}`,
        type: 'Intervention Actuelle',
        description: intervention,
        // Utiliser highlightText pour le rendu
        render: (item) => highlightText(item.description || '', searchQuery)
      });
    });
  }

  // Ajouter les domaines d'intervention possibles
  if (row.domaines_intervention_possibles) {
    const domaines = Array.isArray(row.domaines_intervention_possibles) 
      ? row.domaines_intervention_possibles 
      : [row.domaines_intervention_possibles];
    
    domaines.forEach((domaine, index) => {
      details.push({
        id: `domaine_${index}`,
        type: 'Domaine d\'Intervention Possible',
        description: domaine,
        // Utiliser highlightText pour le rendu
        render: (item) => highlightText(item.description || '', searchQuery)
      });
    });
  }
  return details;
};

// Et modifier la définition des colonnes détaillées (approche plus simple) :
const detailColumns = [
  { field: 'type', label: 'Type', align: 'center' },
  { 
    field: 'description', 
    label: 'Description',
    render: (row) => highlightText(row.description || '', searchQuery)
  }
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
        <FilterBar 
          showFilter={false} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={acteurs} 
          onFilteredData={setFilteredData}
          filterCriteria={{ 
            filterBy: 'role_acteurs', 
            searchFields: [
              'nom', 
              'prenom', 
              'role_acteurs', 
              'commune.nomCommune', 
              'contact', 
              'interventions_actuelles', 
              'domaines_intervention_possibles'
            ] 
          }}
          multiple={false}
        />
        
        {filteredData.length > 0 && (
          <CollapsibleTable
            columns={collapsibleColumns}
            rows={filteredData}
            detailTables={[
              {
                title: "Interventions et Domaines",
                columns: detailColumns,
                getData: getDetailData
              }
            ]}
            arrowPosition="left"
            expandedRows={expandedRows}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={true}
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