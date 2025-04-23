import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import TableView, { highlightText } from "../../../components/ui-table/TableView";
import FilterBar from "../../../components/ui-table/FilterBar";
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ServiceEdit from "./ServiceEdit";
import ServiceCreate from "./ServiceCreate";
import useServiceStore from "../../../store/serviceStore";
import SnackbarAlert from "../../../components/ui/SnackbarAlert";

function ServiceViews() {
  const { services, fetchServices, loading, deleteService, error } = useServiceStore();
  const [selectedService, setSelectedService] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // Ajouter ces états pour la fonctionnalité de recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Charger les services au montage du composant
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Mettre à jour les données filtrées quand les services changent
  useEffect(() => {
    setFilteredData(services);
  }, [services]);

  const columns = [
    { id: "id", label: "ID" },
    {
      id: "fokotany",
      label: "Fokontany",
      render: (row) => highlightText(row.fokotany.nomFokotany, searchQuery),
    },
    { 
      id: "nomService", 
      label: "Service", 
      render: (row) => highlightText(row.nomService, searchQuery) 
    },
    { 
      id: "description", 
      label: "Description", 
      render: (row) => highlightText(row.description, searchQuery) 
    },
    { 
      id: "offre", 
      label: "Offre", 
      render: (row) => highlightText(row.offre, searchQuery) 
    },
    { 
      id: "nombre_membre", 
      label: "Nombre de Membres", 
      render: (row) => <div className="text-center">{row.nombre_membre}</div> 
    },
    { 
      id: "membre", 
      label: "Responsable", 
      render: (row) => highlightText(row.membre, searchQuery) 
    },
  ];

  const handleCreate = () => {
    setSelectedService(null);
    setOpenCreateModal(true);
  };

  const handleSaveCreate = (service) => {
    setSnackbarMessage("Service créé avec succès!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenCreateModal(false);
  };

  const handleEdit = (row) => {
    setSelectedService(row);
    setOpenEditModal(true);
  };

  const handleSaveEdit = (updatedService) => {
    setSnackbarMessage("Service modifié avec succès!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenEditModal(false);
  };

  const handleDelete = (row) => {
    setServiceToDelete(row);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteService(serviceToDelete.id);
      setSnackbarMessage("Service supprimé avec succès!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression du service.");
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
        subText="Services"
        showCreateButton={true}
        onCreate={handleCreate}
      />
      <Box className="card">
        <FilterBar
          showSearch={true}
          showFilter={false}
          filterCriteria={{ filterBy: null, searchFields: ['nomService', 'description', 'offre', 'membre'] }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          data={services}
          onFilteredData={setFilteredData}
        />
        <TableView
          data={filteredData}
          columns={columns}
          rowsPerPage={5}
          onEdit={handleEdit}
          showCheckboxes={false}
          showDeleteIcon={true}
          onDelete={handleDelete}
          loading={loading}
        />
      </Box>
      <ServiceCreate
        isOpen={openCreateModal}
        onSave={handleSaveCreate}
        onClose={() => setOpenCreateModal(false)}
      />
      <ServiceEdit
        isOpen={openEditModal}
        service={selectedService}
        onChange={(updatedService) => setSelectedService(updatedService)}
        onSave={handleSaveEdit}
        onClose={() => setOpenEditModal(false)}
      />
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce service ?"
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

export default ServiceViews;