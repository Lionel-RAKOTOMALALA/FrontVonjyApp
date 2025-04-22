import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useChefServiceStore from "../../../store/chefServiceStore"; // Importer le store des chefs de service

const ChefServiceCreate = ({ isOpen, onClose, onSuccess }) => {
  const [chefService, setChefService] = useState({
    service_id: "",
    nomChef: "",
    prenomChef: "",
    contact: "",
    adresse: "",
    sexe: "",
  });

  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createChefService } = useChefServiceStore(); // Utiliser l'action `createChefService` du store

  // Charger les services depuis l'API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("https://www.admin.com/api/services/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des services.");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des services :", err);
        setError("Impossible de charger les services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const isFormValid =
    chefService.service_id !== "" &&
    chefService.nomChef.trim() !== "" &&
    chefService.prenomChef.trim() !== "" &&
    chefService.contact.trim() !== "" &&
    chefService.adresse.trim() !== "" &&
    chefService.sexe.trim() !== "" &&
    !inputDisabled;

  const resetForm = () => {
    setChefService({
      service_id: "",
      nomChef: "",
      prenomChef: "",
      contact: "",
      adresse: "",
      sexe: "",
    });
    setError("");
    setSubmitError("");
    setInputDisabled(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChefService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      setSubmitError("");

      // Appel au store pour créer un chef de service
      await createChefService(chefService);
      if (onSuccess) onSuccess("Chef de service créé avec succès !");

      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du chef de service :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la création.");
      if (onSuccess) onSuccess(err.message || "Erreur lors de la création.", "error");
    }
  };

  return (
    <Modal
      title="Créer un chef de service"
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
          <label htmlFor="service_id" className="form-label">
            Service
          </label>
          {loading ? (
            <p>Chargement des services...</p>
          ) : services.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un service"
              name="service_id"
              value={chefService.service_id}
              onChange={handleChange}
              options={services.map((service) => ({
                value: service.id.toString(),
                label: service.nomService,
              }))}
              placeholder="Choisissez un service"
            />
          ) : (
            <p className="text-danger">Aucun service disponible.</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom du Chef"
            name="nomChef"
            value={chefService.nomChef}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Prénom du Chef"
            name="prenomChef"
            value={chefService.prenomChef}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Contact"
            name="contact"
            value={chefService.contact}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Adresse"
            name="adresse"
            value={chefService.adresse}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Sexe"
            name="sexe"
            value={chefService.sexe}
            onChange={handleChange}
          />
        </div>
      </div>
      {submitError && (
        <p className="text-danger mt-2 text-sm">{submitError}</p>
      )}
    </Modal>
  );
};

export default ChefServiceCreate;