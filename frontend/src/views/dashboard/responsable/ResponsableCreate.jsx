import { useState } from "react"
import Modal from "../../../components/ui/Modal"
import InputField from "../../../components/ui/form/InputField"
import RadioGroupField from "../../../components/ui/form/RadioGroupField"

const ResponsableCreate = ({ isOpen, onSave, onClose }) => {
  // État local pour stocker les données du formulaire
  const [responsable, setResponsable] = useState({
    nom: "",
    classeResponsable: "",
    nomResponsable: "",
    prenomResponsable: "",
    fonction: "",
    formationAcquise: "true", // Valeur par défaut modifiée à "true" pour cocher "Oui"
  })

  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid =
    responsable.nom !== "" &&
    responsable.classeResponsable !== "" &&
    responsable.nomResponsable !== "" &&
    responsable.prenomResponsable !== "" &&
    responsable.fonction !== "" 

  const handleChange = (event) => {
    const { name, value } = event.target
    setResponsable((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Réinitialise tous les champs du formulaire après soumission
  const resetForm = () => {
    setResponsable({
      nom: "",
      classeResponsable: "",
      nomResponsable: "",
      prenomResponsable: "",
      fonction: "",
      formationAcquise: "true", // Modifié pour réinitialiser à "Oui"
    })
  }

  const handleSave = () => {
    // Conversion de la valeur string en booléen avant de sauvegarder
    const formattedData = {
      ...responsable,
      formationAcquise: responsable.formationAcquise === "true",
    }
    onSave(formattedData)
    console.log("Données du responsable:", formattedData)
  }

  return (
    <Modal
      title="Créer un responsable"
      btnLabel="Créer"
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

export default ResponsableCreate
