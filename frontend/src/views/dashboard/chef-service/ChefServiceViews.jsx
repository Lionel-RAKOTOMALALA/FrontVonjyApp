import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import TableView, { highlightText } from "../../../components/ui-table/TableView";
import FilterBar from "../../../components/ui-table/FilterBar";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ChefServiceEdit from "./ChefServiceEdit";
import ChefServiceCreate from "./ChefServiceCreate";
import useChefServiceStore from "../../../store/chefServiceStore";
import SnackbarAlert from "../../../components/ui/SnackbarAlert";

function ChefServiceViews() {
  const { chefServices, fetchChefServices, loading, deleteChefService, error } = useChefServiceStore();
  const [selectedChefService, setSelectedChefService] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chefServiceToDelete, setChefServiceToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // Ajout des états pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchChefServices();
  }, [fetchChefServices]);

  // Mettre à jour les données filtrées quand les chefs de service changent
  useEffect(() => {
    setFilteredData(chefServices);
  }, [chefServices]);

  const columns = [
    { id: "id", label: "ID" },
    {
      id: "fokotany",
      label: "Fokontany",
      render: (row) => (
        <>
          <div>FKT {highlightText(row.service.fokotany.nomFokotany, searchQuery)}</div>
          <div className="fw-bold text-secondary"><span className="">CU</span> {highlightText(row.service.fokotany.commune.nomCommune, searchQuery)}</div>
        </>
      ),
    },
    {
      id: "nomChef",
      label: "Nom",
      render: (row) => highlightText(row.nomChef, searchQuery)
    },
    {
      id: "prenomChef",
      label: "Prénom",
      render: (row) => highlightText(row.prenomChef, searchQuery)
    },
    {
      id: "contact",
      label: "Contact",
      render: (row) => highlightText(row.contact, searchQuery)
    },
    {
      id: "adresse",
      label: "Adresse",
      render: (row) => highlightText(row.adresse, searchQuery)
    },
    {
      id: "service",
      label: "Service",
      render: (row) => highlightText(row.service.nomService, searchQuery),
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
        {/* Ajout du composant FilterBar pour la recherche */}
        <FilterBar
          showSearch={true}
          showFilter={false}
          filterCriteria={{
            filterBy: null, 
            searchFields: ['service.fokotany.nomFokotany','service.fokotany.commune.nomCommune','nomChef', 'prenomChef', 'contact', 'adresse', 'sexe', 'service.nomService']
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={chefServices}
          onFilteredData={setFilteredData}
        />

        <TableView
          data={filteredData} // Utilisation des données filtrées
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
      <SnackbarAlert
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </>
  );
}

export default ChefServiceViews;