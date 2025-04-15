import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import RadioGroupField from "../../../components/ui/form/RadioGroupField";
import useResponsableStore from "../../../store/responsableStore"; // Importer le store des responsables

const ResponsableCreate = ({ isOpen, onClose, onSuccess }) => {
  const [responsable, setResponsable] = useState({
    fokotany_id: "",
    classe_responsable: "",
    nom_responsable: "",
    prenom_responsable: "",
    fonction: "",
    formation_acquise: "true", // Valeur par défaut
  });

  const [fokotanys, setFokotanys] = useState([]);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createResponsable } = useResponsableStore(); // Utiliser l'action `createResponsable` du store

  // Charger les fokotanys depuis l'API
  useEffect(() => {
    const fetchFokotanys = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/fokotany/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des fokotanys.");
        }
        const data = await response.json();
        setFokotanys(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des fokotanys :", err);
        setError("Impossible de charger les fokotanys.");
      } finally {
        setLoading(false);
      }
    };

    fetchFokotanys();
  }, []);

  const isFormValid =
    responsable.fokotany_id !== "" &&
    responsable.classe_responsable.trim() !== "" &&
    responsable.nom_responsable.trim() !== "" &&
    responsable.prenom_responsable.trim() !== "" &&
    responsable.fonction.trim() !== "" &&
    !inputDisabled;

  const resetForm = () => {
    setResponsable({
      fokotany_id: "",
      classe_responsable: "",
      nom_responsable: "",
      prenom_responsable: "",
      fonction: "",
      formation_acquise: "true",
    });
    setError("");
    setSubmitError("");
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResponsable((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      setSubmitError("");

      // Transformation de formation_acquise en booléen avant l'envoi
      const payload = {
        ...responsable,
        formation_acquise: responsable.formation_acquise === "true",
      };

      // Appel au store pour créer un responsable
      await createResponsable(payload);
      if (onSuccess) onSuccess("Responsable créé avec succès !");

      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du responsable :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la création.");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la création.", "error");
    }
  };

  return (
    <Modal
      title="Créer un responsable"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={() => {
        resetForm();
        onClose();
      }}
      isFormValid={isFormValid}
      resetForm={resetForm}
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <label htmlFor="fokotany_id" className="form-label">
            Fokotany
          </label>
          {loading ? (
            <p>Chargement des fokotanys...</p>
          ) : fokotanys.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={responsable.fokotany_id}
              onChange={handleChange}
              options={fokotanys.map((fokotany) => ({
                value: fokotany.id.toString(),
                label: fokotany.nomFokotany,
              }))}
              placeholder="Choisissez un fokotany"
            />
          ) : (
            <p className="text-danger">Aucun fokotany disponible.</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Classe Responsable"
            name="classe_responsable"
            value={responsable.classe_responsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du Responsable"
            name="nom_responsable"
            value={responsable.nom_responsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Prénom du Responsable"
            name="prenom_responsable"
            value={responsable.prenom_responsable}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Fonction"
            name="fonction"
            value={responsable.fonction}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <RadioGroupField
            label="Formation Acquise"
            name="formation_acquise"
            value={responsable.formation_acquise}
            onChange={handleChange}
            options={[
              { value: "true", label: "Oui" },
              { value: "false", label: "Non" },
            ]}
          />
        </div>
      </div>
      {submitError && (
        <p className="text-danger mt-2 text-sm">{submitError}</p>
      )}
    </Modal>
  );
};

export default ResponsableCreate; 