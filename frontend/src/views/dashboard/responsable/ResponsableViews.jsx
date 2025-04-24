import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import TableView, { highlightText } from "../../../components/ui-table/TableView";
import FilterBar from "../../../components/ui-table/FilterBar";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ResponsableEdit from "./ResponsableEdit";
import ResponsableCreate from "./ResponsableCreate";
import useResponsableStore from "../../../store/responsableStore";
import SnackbarAlert from "../../../components/ui/SnackbarAlert";

function ResponsableViews() {
  const { responsables, fetchResponsables, loading, deleteResponsable, error } = useResponsableStore();
  const [selectedResponsable, setSelectedResponsable] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [responsableToDelete, setResponsableToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // Nouveaux états pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Charger les responsables au montage du composant
  useEffect(() => {
    fetchResponsables();
  }, [fetchResponsables]);

  // Mettre à jour les données filtrées quand les responsables changent
  useEffect(() => {
    setFilteredData(responsables);
  }, [responsables]);

  // Colonnes du tableau adaptées aux champs du modèle Responsable avec highlight
  const columns = [
    { id: "id", label: "ID" },
    {
      id: "fokotany",
      label: "Fokontany",
      render: (row) => highlightText(row.fokotany.nomFokotany, searchQuery),
    },
    {
      id: "classe_responsable",
      label: "Classe",
      render: (row) => highlightText(row.classe_responsable, searchQuery),
    },
    {
      id: "nom_responsable",
      label: "Nom",
      render: (row) => highlightText(row.nom_responsable, searchQuery),
    },
    {
      id: "prenom_responsable",
      label: "Prénom",
      render: (row) => row.prenom_responsable ?
        <div className="text-center">{highlightText(row.prenom_responsable, searchQuery)}</div> :
        <div className="text-center">-</div>
    },
    {
      id: "fonction",
      label: "Fonction",
      render: (row) => highlightText(row.fonction, searchQuery),
    },
    {
      id: "contact_responsable",
      label: "Contact",
      render: (row) => row.contact_responsable ?
        <div className="text-center">{highlightText(row.contact_responsable, searchQuery)}</div> :
        <div className="text-center">-</div>
    },
    {
      id: "formation_acquise",
      label: "Formation Acquise",
      render: (row) => (row.formation_acquise ?
        <div className="text-center">Oui</div> :
        <div className="text-center">Non</div>),
    },
  ];

  // Ouvre le modal de création de responsable
  const handleCreate = () => {
    setSelectedResponsable(null);
    setOpenCreateModal(true);
  };

  // Gère l'enregistrement d'un nouveau responsable
  const handleSaveCreate = (responsable) => {
    console.log("Created:", responsable);
    setSnackbarMessage("Responsable créé avec succès!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenCreateModal(false);
  };

  // Ouvre le modal d'édition avec les infos du responsable sélectionné
  const handleEdit = (row) => {
    setSelectedResponsable(row);
    setOpenEditModal(true);
  };

  // Gère l'enregistrement des modifications d'un responsable
  const handleSaveEdit = (updatedResponsable) => {
    console.log("Edited:", updatedResponsable);
    setSnackbarMessage("Responsable modifié avec succès!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenEditModal(false);
  };

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setResponsableToDelete(row);
    setOpenDialog(true);
  };

  // Confirme la suppression d'un responsable
  const confirmDelete = async () => {
    try {
      await deleteResponsable(responsableToDelete.id);
      setSnackbarMessage("Responsable supprimé avec succès!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSnackbarMessage("Erreur lors de la suppression du responsable.");
      setSnackbarSeverity("error");
    } finally {
      setOpenDialog(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      {/* Fil d'Ariane avec bouton de création */}
      <Breadcrumb
        mainText="Listes"
        subText="Responsables"
        showCreateButton={true}
        onCreate={handleCreate}
      />

      {/* Tableau principal affichant les responsables */}
      <Box className="card">
        {/* Ajout du composant FilterBar */}
        <FilterBar
          showSearch={true}
          showFilter={false}
          filterCriteria={{
            filterBy: null,
            searchFields: ['fokotany.nomFokotany', 'nom_responsable', 'prenom_responsable', 'fonction', 'contact_responsable', 'classe_responsable']
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={responsables}
          onFilteredData={setFilteredData}
        />

        {filteredData.length > 0 && (
          <TableView
            data={filteredData} // Utilisation des données filtrées
            columns={columns}
            rowsPerPage={5}
            onEdit={handleEdit}
            showCheckboxes={false}
            showDeleteIcon={true}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </Box>

      {/* Modal de création */}
      <ResponsableCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)}
      />

      {/* Modal d'édition */}
      <ResponsableEdit
        isOpen={openEditModal}
        responsable={selectedResponsable}
        onChange={(updatedResponsable) => setSelectedResponsable(updatedResponsable)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)}
      />

      {/* Boîte de dialogue de confirmation pour la suppression */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce responsable ?"
      />
      <SnackbarAlert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </>
  );
}

export default ResponsableViews;