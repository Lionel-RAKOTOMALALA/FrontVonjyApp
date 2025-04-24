import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useChefServiceStore from "../../../store/chefServiceStore"; // Importer le store des chefs de service

const ChefServiceEdit = ({ isOpen, chefService, onChange, onSave, onClose }) => {
  const { updateChefService } = useChefServiceStore();
  const [services, setServices] = useState([]);
  const [localChefService, setLocalChefService] = useState({
    service_id: "",
    nomChef: "",
    prenomChef: "",
    contact: "",
    adresse: "",
    sexe: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);



  const resetForm = () => {
    onChange({
      service_id: "",
      nomChef: "",
      prenomChef: "",
      contact: "",
      adresse: "",
      sexe: "",
    });
  };

  useEffect(() => {
    if (chefService) {
      setLocalChefService({
        service_id: chefService.service?.id?.toString() || "",
        nomChef: chefService.nomChef || "",
        prenomChef: chefService.prenomChef || "",
        contact: chefService.contact || "",
        adresse: chefService.adresse || "",
        sexe: chefService.sexe || "",
      });
    }
  }, [chefService]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const isFormValid =
    localChefService.service_id !== "" &&
    localChefService.nomChef.trim() !== "" &&
    localChefService.prenomChef.trim() !== "" &&
    localChefService.contact.trim() !== "" &&
    localChefService.adresse.trim() !== "" &&
    localChefService.sexe.trim() !== "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalChefService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      setSubmitError("");

      // Appel au store pour mettre à jour le chef de service
      await updateChefService(chefService.id, localChefService);
      if (onSave) onSave("Chef de service modifié avec succès !");
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du chef de service :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la modification.");
    }
  };

  return (
    <Modal
      title="Modifier un chef de service"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      maxWidth="435px"
      resetForm={resetForm}
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
              value={localChefService.service_id}
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
            value={localChefService.nomChef}
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
            value={localChefService.prenomChef}
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
            value={localChefService.contact}
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
            value={localChefService.adresse}
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
            value={localChefService.sexe}
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

export default ChefServiceEdit;