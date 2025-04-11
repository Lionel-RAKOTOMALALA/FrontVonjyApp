import { useState, useEffect } from "react"
import Modal from "../../../components/ui/Modal"
import InputField from "../../../components/ui/form/InputField"
import RadioGroupField from "../../../components/ui/form/RadioGroupField"

const FokontanyEdit = ({ isOpen, fokontany: propFokontany, onChange, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [fokontany, setFokontany] = useState({
    nom: "",
    classeResponsable: "",
    nomResponsable: "",
    prenomResponsable: "",
    fonction: "",
    formationAcquise: "true",
  })

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFokontany({
      nom: "",
      classeResponsable: "",
      nomResponsable: "",
      prenomResponsable: "",
      fonction: "",
      formationAcquise: "true",
    })
  }

  // Mettre à jour l'état local lorsque le fokontany sélectionné change
  useEffect(() => {
    if (propFokontany) {
      // Initialiser avec les valeurs existantes ou des valeurs par défaut
      setFokontany({
        id: propFokontany.id || "",
        nom: propFokontany.nom || "",
        // Utiliser des valeurs par défaut pour les champs manquants
        classeResponsable: propFokontany.classeResponsable || "", // Valeur par défaut
        nomResponsable: propFokontany.nomResponsable || "",
        prenomResponsable: propFokontany.prenomResponsable || propFokontany.prenom || "",
        fonction: propFokontany.fonction || "", // Valeur par défaut
        // Convertir la valeur booléenne en chaîne pour le RadioGroupField
        formationAcquise:
          propFokontany.formationAcquise === true || propFokontany.formationAcquise === "true" ? "true" : "false",
      })
    }
  }, [propFokontany])

  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid =
    fokontany.nom !== "" &&
    fokontany.classeResponsable !== "" &&
    fokontany.nomResponsable !== "" &&
    fokontany.prenomResponsable !== "" &&
    fokontany.fonction !== "" 

  const handleChange = (event) => {
    const { name, value } = event.target
    const updatedFokontany = {
      ...fokontany,
      [name]: value,
    }
    setFokontany(updatedFokontany)

    // Propager les changements au composant parent
    if (onChange) {
      onChange(updatedFokontany)
    }
  }

  const handleSave = () => {
    // Convertir la valeur string en booléen avant de sauvegarder
    const formattedData = {
      ...fokontany,
      formationAcquise: fokontany.formationAcquise === "true",
    }
    onSave(formattedData)
    console.log("Données du fokontany modifiées:", formattedData)
  }

  return (
    <Modal
      title="Modifier un Fokontany"
      btnLabel="Modifier"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm}
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField required label="Nom" name="nom" value={fokontany.nom} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Classe Responsable"
            name="classeResponsable"
            value={fokontany.classeResponsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du Responsable"
            name="nomResponsable"
            value={fokontany.nomResponsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Prénom du Responsable"
            name="prenomResponsable"
            value={fokontany.prenomResponsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField label="Fonction" name="fonction" value={fokontany.fonction} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <RadioGroupField
            label="Formation Acquise"
            name="formationAcquise"
            value={fokontany.formationAcquise}
            onChange={handleChange}
            options={[
              { value: "true", label: "Oui" },
              { value: "false", label: "Non" },
            ]}
          />
        </div>
      </div>
    </Modal>
  )
}

export default FokontanyEdit