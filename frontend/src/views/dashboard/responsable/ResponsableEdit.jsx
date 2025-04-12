import { useState, useEffect } from "react"
import Modal from "../../../components/ui/Modal"
import InputField from "../../../components/ui/form/InputField"
import RadioGroupField from "../../../components/ui/form/RadioGroupField"

const ResponsableEdit = ({ isOpen, responsable: propResponsable, onChange, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [responsable, setResponsable] = useState({
    nom: "",
    classeResponsable: "",
    nomResponsable: "",
    prenomResponsable: "",
    fonction: "",
    formationAcquise: "true",
  })

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setResponsable({
      nom: "",
      classeResponsable: "",
      nomResponsable: "",
      prenomResponsable: "",
      fonction: "",
      formationAcquise: "true",
    })
  }

  // Mettre à jour l'état local lorsque le responsable sélectionné change
  useEffect(() => {
    if (propResponsable) {
      // Initialiser avec les valeurs existantes ou des valeurs par défaut
      setResponsable({
        id: propResponsable.id || "",
        nom: propResponsable.nom || "",
        // Utiliser des valeurs par défaut pour les champs manquants
        classeResponsable: propResponsable.classeResponsable || "", // Valeur par défaut
        nomResponsable: propResponsable.nomResponsable || "",
        prenomResponsable: propResponsable.prenomResponsable || propResponsable.prenom || "",
        fonction: propResponsable.fonction || "", // Valeur par défaut
        // Convertir la valeur booléenne en chaîne pour le RadioGroupField
        formationAcquise:
          propResponsable.formationAcquise === true || propResponsable.formationAcquise === "true" ? "true" : "false",
      })
    }
  }, [propResponsable])

  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid =
    responsable.nom !== "" &&
    responsable.classeResponsable !== "" &&
    responsable.nomResponsable !== "" &&
    responsable.prenomResponsable !== "" &&
    responsable.fonction !== "" 

  const handleChange = (event) => {
    const { name, value } = event.target
    const updatedFokontany = {
      ...responsable,
      [name]: value,
    }
    setResponsable(updatedFokontany)

    // Propager les changements au composant parent
    if (onChange) {
      onChange(updatedFokontany)
    }
  }

  const handleSave = () => {
    // Convertir la valeur string en booléen avant de sauvegarder
    const formattedData = {
      ...responsable,
      formationAcquise: responsable.formationAcquise === "true",
    }
    onSave(formattedData)
    console.log("Données du responsable modifiées:", formattedData)
  }

  return (
    <Modal
      title="Modifier un responsable"
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
          <InputField required label="Nom" name="nom" value={responsable.nom} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Classe Responsable"
            name="classeResponsable"
            value={responsable.classeResponsable}
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
            value={responsable.nomResponsable}
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
            value={responsable.prenomResponsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField label="Fonction" name="fonction" value={responsable.fonction} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <RadioGroupField
            label="Formation Acquise"
            name="formationAcquise"
            value={responsable.formationAcquise}
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

export default ResponsableEdit