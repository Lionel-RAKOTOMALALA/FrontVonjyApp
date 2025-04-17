import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import TableView from "../../../components/ui-table/TableView";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ChefServiceEdit from "./ChefServiceEdit";
import ChefServiceCreate from "./ChefServiceCreate";
import useChefServiceStore from "../../../store/chefServiceStore"; // Import du store

function ChefServiceViews() {
  const { chefServices, fetchChefServices, loading, deleteChefService, error } = useChefServiceStore(); // Utilisation du store
  const [selectedChefService, setSelectedChefService] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chefServiceToDelete, setChefServiceToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchChefServices();
  }, [fetchChefServices]);

  const columns = [
    { id: "id", label: "ID" },
    { id: "nomChef", label: "Nom Chef" },
    { id: "prenomChef", label: "Prénom Chef" },
    { id: "contact", label: "Contact" },
    { id: "adresse", label: "Adresse" },
    { id: "sexe", label: "Sexe" },
    {
      id: "service",
      label: "Service",
      render: (row) => row.service.nomService,
    },
  ];

  const handleCreate = () => {
    setSelectedChefService(null);
    setOpenCreateModal(true);
  };

  const handleSaveCreate = (chefService) => {
    setSnackbarMessage("Chef de service créé avec succès!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenCreateModal(false);
  };

  const handleEdit = (row) => {
    setSelectedChefService(row);
    setOpenEditModal(true);
  };

  const handleSaveEdit = (updatedChefService) => {
    setSnackbarMessage("Chef de service modifié avec succès!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenEditModal(false);
  };

  const handleDelete = (row) => {
    setChefServiceToDelete(row);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteChefService(chefServiceToDelete.id);
      setSnackbarMessage("Chef de service supprimé avec succès!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression du chef de service.");
      setSnackbarSeverity("error");
    } finally {
      setOpenDialog(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Breadcrumb
        mainText="Listes"
        subText="Chefs de Service"
        showCreateButton={true}
        onCreate={handleCreate}
      />
      <Box className="card">
        <TableView
          data={chefServices}
          columns={columns}
          rowsPerPage={5}
          onEdit={handleEdit}
          showCheckboxes={true}
          showDeleteIcon={true}
          onDelete={handleDelete}
          loading={loading}
        />
      </Box>
      <ChefServiceCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)}
      />
      <ChefServiceEdit
        isOpen={openEditModal}
        chefService={selectedChefService}
        onChange={(updatedChefService) => setSelectedChefService(updatedChefService)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)}
      />
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce chef de service ?"
      />
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

export default ChefServiceViews;