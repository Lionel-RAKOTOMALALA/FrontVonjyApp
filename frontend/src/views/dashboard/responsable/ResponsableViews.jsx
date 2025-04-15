import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import TableView from "../../../components/ui-table/TableView";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ResponsableEdit from "./ResponsableEdit";
import ResponsableCreate from "./ResponsableCreate";
import useResponsableStore from "../../../store/responsableStore"; // Import du store

function ResponsableViews() {
  const { responsables, fetchResponsables, loading,deleteResponsable, error } = useResponsableStore(); // Utilisation du store
  const [selectedResponsable, setSelectedResponsable] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [responsableToDelete, setResponsableToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Charger les responsables au montage du composant
  useEffect(() => {
    fetchResponsables();
  }, [fetchResponsables]);

  // Colonnes du tableau adaptées aux champs du modèle Responsable
  const columns = [
    { id: "id", label: "ID" },
    {
      id: "fokotany",
      label: "Fokontany",
      render: (row) => row.fokotany.nomFokotany,
    },
    {
      id: "classe_responsable",
      label: "Classe",
    },
    {
      id: "nom_responsable",
      label: "Nom Responsable",
    },
    {
      id: "prenom_responsable",
      label: "Prénom Responsable",
    },
    {
      id: "fonction",
      label: "Fonction",
    },
    {
      id: "formation_acquise",
      label: "Formation Acquise",
      render: (row) => (row.formation_acquise ? "Oui" : "Non"), // Affiche "Oui" ou "Non"
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
    setOpenCreateModal(false); // Ferme le modal après la sauvegarde
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
      await deleteResponsable(responsableToDelete.id); // Appel à l'action du store
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
        <TableView
          data={responsables} // Les données dynamiques récupérées via le store
          columns={columns}
          rowsPerPage={5}
          onEdit={handleEdit}
          showCheckboxes={true}
          showDeleteIcon={true}
          onDelete={handleDelete}
          loading={loading} // Indicateur de chargement
        />
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

      {/* Notification (snackbar) après une action réussie */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResponsableViews;