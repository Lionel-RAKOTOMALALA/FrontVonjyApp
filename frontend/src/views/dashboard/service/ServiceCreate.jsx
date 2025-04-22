import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useServiceStore from "../../../store/serviceStore"; // Importer le store des services

const ServiceCreate = ({ isOpen, onClose, onSuccess }) => {
  const [service, setService] = useState({
    fokotany_id: "",
    nomService: "",
    description: "",
    offre: "",
    membre: "",
    nombre_membre: "",
  });

  const [fokotanys, setFokotanys] = useState([]);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const { createService } = useServiceStore();

  useEffect(() => {
    const fetchFokotanys = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("https://www.admin.com/api/fokotany/", {
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
        setError("Impossible de charger les fokotanys.");
      }
    };

    fetchFokotanys();
  }, []);

  const isFormValid =
    service.fokotany_id &&
    service.nomService.trim() &&
    service.description.trim() &&
    service.offre.trim() &&
    service.membre.trim() &&
    service.nombre_membre;

  const resetForm = () => {
    setService({
      fokotany_id: "",
      nomService: "",
      description: "",
      offre: "",
      membre: "",
      nombre_membre: "",
    });
    setError("");
    setSubmitError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!isFormValid) {
        setSubmitError("Formulaire invalide");
        return;
      }

      const payload = {
        ...service,
        nombre_membre: parseInt(service.nombre_membre, 10),
      };

      await createService(payload);
      if (onSuccess) onSuccess("Service créé avec succès !");
      resetForm();
      onClose();
    } catch (err) {
      setSubmitError("Erreur lors de la création du service.");
    }
  };

  return (
    <Modal
      title="Créer un service"
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
          {fokotanys.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={service.fokotany_id}
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
            label="Nom Service"
            name="nomService"
            value={service.nomService}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Description"
            name="description"
            value={service.description}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Offre"
            name="offre"
            value={service.offre}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Membre"
            name="membre"
            value={service.membre}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nombre de Membres"
            name="nombre_membre"
            type="number"
            value={service.nombre_membre}
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

export default ServiceCreate;