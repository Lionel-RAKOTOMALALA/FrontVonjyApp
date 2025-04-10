import { useState } from "react"
import { Box, Snackbar, Alert } from "@mui/material"
import TableView from "../../../components/ui-table/TableView"
import ConfirmationDialog from "../../../components/ui/ConfirmationDialog"
import Breadcrumb from "../../../components/ui/Breadcrumb"
import FokontanyEdit from "./FokontanyEdit"
import FokontanyCreate from "./FokontanyCreate"

function FokontanyViews() {
  const [selectedFokontany, setSelectedFokontany] = useState(null)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [fokontanyToDelete, setFokontanyToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // Données fictives des fokontany adaptées aux nouveaux champs
  const data = [
    {
      id: 1,
      nom: "Ambohimanarina",
      classeResponsable: "Classe A",
      nomResponsable: "Rasoanaivo",
      prenomResponsable: "Hery",
      fonction: "Responsable",
      formationAcquise: true,
    },
    {
      id: 2,
      nom: "Ankorondrano",
      classeResponsable: "Classe B",
      nomResponsable: "Rakotoarivelo",
      prenomResponsable: "Naina",
      fonction: "Adjoint",
      formationAcquise: false,
    },
    {
      id: 3,
      nom: "Analakely",
      classeResponsable: "Classe A",
      nomResponsable: "Andrianarivo",
      prenomResponsable: "Mamy",
      fonction: "Responsable",
      formationAcquise: true,
    },
    {
      id: 4,
      nom: "Andravoahangy",
      classeResponsable: "Classe C",
      nomResponsable: "Ravelojaona",
      prenomResponsable: "Lova",
      fonction: "Secrétaire",
      formationAcquise: true,
    },
    {
      id: 5,
      nom: "Ambohipo",
      classeResponsable: "Classe B",
      nomResponsable: "Mihobisoa",
      prenomResponsable: "Antsa",
      fonction: "Responsable",
      formationAcquise: false,
    },
  ]

  // Colonnes du tableau adaptées aux champs du fokontany
  const columns = [
    { id: "id", label: "Id" },
    { id: "nom", label: "Nom du Fokontany", render: (row) => row.nom },
    { id: "classeResponsable", label: "Classe", render: (row) => row.classeResponsable },
    { id: "nomResponsable", label: "Nom Responsable", render: (row) => row.nomResponsable },
    { id: "prenomResponsable", label: "Prénom Responsable", render: (row) => row.prenomResponsable },
    {
      id: "formationAcquise",
      label: "Formation Acquise",
      render: (row) => (row.formationAcquise ? "Oui" : "Non"),
    },
  ]

  // Ouvre le modal de création de fokontany
  const handleCreate = () => {
    setSelectedFokontany(null)
    setOpenCreateModal(true)
  }

  // Gère l'enregistrement d'un nouveau fokontany
  const handleSaveCreate = (fokontany) => {
    console.log("Created:", fokontany)
    setOpenSnackbar(true)
    setOpenCreateModal(false) // Ferme le modal après la sauvegarde
  }

  // Ouvre le modal d'édition avec les infos du fokontany sélectionné
  const handleEdit = (row) => {
    setSelectedFokontany(row)
    setOpenEditModal(true)
  }

  // Gère l'enregistrement des modifications d'un fokontany
  const handleSaveEdit = (updatedFokontany) => {
    console.log("Edited:", updatedFokontany)
    setOpenEditModal(false)
    setOpenSnackbar(true)
  }

  // Ouvre le dialogue de confirmation pour la suppression
  const handleDelete = (row) => {
    setFokontanyToDelete(row)
    setOpenDialog(true)
  }

  // Confirme la suppression d'un fokontany
  const confirmDelete = () => {
    console.log("Deleted:", fokontanyToDelete)
    setOpenDialog(false)
    setOpenSnackbar(true)
  }

  return (
    <>
      {/* Fil d'Ariane avec bouton de création */}
      <Breadcrumb mainText="Listes" subText="Fokontany" showCreateButton={true} onCreate={handleCreate} />

      {/* Tableau principal affichant les fokontany */}
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
      <FokontanyCreate isOpen={openCreateModal} onSave={handleSaveCreate} onClose={() => setOpenCreateModal(false)} />

      {/* Modal d'édition */}
      <FokontanyEdit
        isOpen={openEditModal}
        fokontany={selectedFokontany}
        onChange={(updatedFokontany) => setSelectedFokontany(updatedFokontany)}
        onSave={handleSaveEdit}
        onClose={() =>{setOpenEditModal(false); console.log(openEditModal);
        }
      }
      />

      {/* Boîte de dialogue de confirmation pour la suppression */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDelete}
        title="Suppression"
        content="Êtes-vous sûr de vouloir supprimer ce fokontany?"
      />

      {/* Notification (snackbar) après une action réussie */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Opération réalisée avec succès!
        </Alert>
      </Snackbar>
    </>
  )
}

export default FokontanyViews