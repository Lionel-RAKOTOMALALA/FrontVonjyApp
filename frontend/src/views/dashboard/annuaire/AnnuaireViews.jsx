import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, Tooltip } from '@mui/material';
import TableView from '../../../components/ui-table/TableView';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import AnnuaireCreate from './AnnuaireCreate';
import AnnuaireEdit from './AnnuaireEdit';
import SnackbarAlert from '../../../components/ui/SnackbarAlert';
import useAnnuaireStore from '../../../store/annuaireStore';

function AnnuaireViews() {
  const [selectedAnnuaire, setSelectedAnnuaire] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [annuaireToDelete, setAnnuaireToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Ajout pour gérer le type d'alerte

  // Store Zustand
  const { annuaires, fetchAnnuaires, loading, error } = useAnnuaireStore();

  useEffect(() => {
    fetchAnnuaires();
  }, [fetchAnnuaires]);

  // Colonnes du tableau avec formatage personnalisé
  const columns = [
    { id: 'id', label: 'Id' },
    { id: 'acteurs', label: 'Acteurs', render: (row) => row.acteurs },
    { id: 'personne_reference', label: 'Personne de référence', render: (row) => row.personne_reference },
    { id: 'contacts', label: 'Contacts', render: (row) => row.contacts },
    {
      id: 'interventions_actuelles',
      label: 'Interventions actuelles',
      render: (row) => {
        const text = row.interventions_actuelles;
        const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;

        return (
          <Tooltip title={text} arrow placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: '#333',
                  color: '#fff',
                  fontSize: 13,
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: 300,
                  whiteSpace: 'pre-line',
                  p: 1.2,
                }
              },
              arrow: {
                sx: {
                  color: '#333',
                }
              }
            }}>
            <span style={{ cursor: 'pointer' }}>
              {truncatedText}
            </span>
          </Tooltip>
        );
      }
    },
    {
      id: 'domaines_intervention_possibles',
      label: 'Domaines d\'intervention possibles',
      render: (row) => {
        const text = row.domaines_intervention_possibles;
        const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;

        return (
          <Tooltip
            title={
              <span style={{ whiteSpace: 'pre-line', fontSize: 14 }}>
                {text}
              </span>
            }
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: '#333',
                  color: '#fff',
                  fontSize: 13,
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: 300,
                  whiteSpace: 'pre-line',
                  p: 1.2,
                }
              },
              arrow: {
                sx: {
                  color: '#333',
                }
              }
            }}
          >
            <span
              style={{
                cursor: 'pointer',
              }}
            >
              {truncatedText}
            </span>
          </Tooltip>
        );
      }
    },
    { id: 'ouverture', label: 'Ouverture', render: (row) => row.ouverture }
  ];

  // Fonction utilitaire pour afficher les notifications
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Ouvre le modal de création d'annuaire
  const handleCreate = () => {
    setSelectedAnnuaire(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'un nouvel annuaire
  const handleSaveCreate = (annuaire) => {
    try {
      console.log('Created:', annuaire);
      // Ici, vous ajouteriez la logique pour sauvegarder dans la base de données

      setOpenCreateModal(false); // Ferme le modal après la sauvegarde
      showSnackbar(`Annuaire "${annuaire.acteurs}" créé avec succès !`, 'success');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showSnackbar('Erreur lors de la création de l\'annuaire.', 'error');
    }
  };

  // Ouvre le modal d'édition avec les infos de l'annuaire sélectionné
  const handleEdit = (row) => {
    setSelectedAnnuaire(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications d'un annuaire
  const handleSaveEdit = (updatedAnnuaire) => {
    try {
      console.log('Edited:', updatedAnnuaire);
      // Ici, vous ajouteriez la logique pour mettre à jour dans la base de données

      setOpenEditModal(false);
      showSnackbar(`Annuaire "${updatedAnnuaire.acteurs}" modifié avec succès !`, 'success');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      showSnackbar('Erreur lors de la modification de l\'annuaire.', 'error');
    }
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setAnnuaireToDelete(row);
    setOpenDialog(true);
  };

  // Confirme la suppression d'un annuaire
  const confirmDelete = () => {
    try {
      console.log('Deleted:', annuaireToDelete);
      // Ici, vous ajouteriez la logique pour supprimer de la base de données

      const deletedActeur = annuaireToDelete.acteurs;
      setOpenDialog(false);
      setAnnuaireToDelete(null);
      showSnackbar(`Annuaire "${deletedActeur}" supprimé avec succès !`, 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showSnackbar('Erreur lors de la suppression de l\'annuaire.', 'error');
      setOpenDialog(false);
    }
  };


  return (
    <>
      {/* Fil d'Ariane avec bouton de création */}
      <Breadcrumb
        mainText="Listes"
        subText="Annuaire"
        showCreateButton={true}
        onCreate={handleCreate}
      />

      {/* Tableau principal affichant les annuaires */}
      <Box className="card">
        <TableView
          data={annuaires}
          columns={columns}
          rowsPerPage={5}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showCheckboxes={false}
          loading={loading}
        />
      </Box>

      {/* Modal de création */}
      <AnnuaireCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)}
      />

      {/* Modal d'édition */}
      <AnnuaireEdit
        isOpen={openEditModal}
        annuaire={selectedAnnuaire}
        onChange={(updatedAnnuaire) => setSelectedAnnuaire(updatedAnnuaire)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)}
      />

      {/* Boîte de dialogue de confirmation pour la suppression */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer cet annuaire?"
      />

      {/* Notification (snackbar) après une action réussie */}
      <SnackbarAlert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </>
  );
}

export default AnnuaireViews;