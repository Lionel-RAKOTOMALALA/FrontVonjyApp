import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useServiceStore from "../../../store/serviceStore"; // Import du store des services

const ServiceEdit = ({ isOpen, service, onChange, onSave, onClose }) => {
  const { updateService } = useServiceStore();
  const [fokotanys, setFokotanys] = useState([]);
  const [localService, setLocalService] = useState({
    fokotany_id: "",
    nomService: "",
    description: "",
    offre: "",
    membre: "",
    nombre_membre: "",
  });
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (service) {
      setLocalService({
        fokotany_id: service.fokotany?.id?.toString() || "",
        nomService: service.nomService || "",
        description: service.description || "",
        offre: service.offre || "",
        membre: service.membre || "",
        nombre_membre: service.nombre_membre?.toString() || "",
      });
    }
  }, [service]);

  useEffect(() => {
    const fetchFokotanys = async () => {
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
      }
    };

    fetchFokotanys();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (
      !localService.nomService ||
      !localService.description ||
      !localService.offre ||
      !localService.membre ||
      !localService.nombre_membre ||
      !localService.fokotany_id
    ) {
      setSubmitError("Tous les champs sont requis. Veuillez les remplir.");
      return;
    }

    try {
      const payload = {
        ...localService,
        nombre_membre: parseInt(localService.nombre_membre, 10),
      };

      await updateService(service.id, payload);
      if (onSave) onSave("Service modifié avec succès !");
      onClose();
    } catch (err) {
      setSubmitError("Erreur lors de la mise à jour du service.");
    }
  };

  return (
    <Modal
      title="Modifier un service"
      btnLabel="Sauvegarder"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid
      maxWidth="435px"
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          <label htmlFor="fokotany_id" className="form-label">
            Fokotany
          </label>
          {fokotanys.length > 0 ? (
            <SelectField
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={localService.fokotany_id}
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
            value={localService.nomService}
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
            value={localService.description}
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
            value={localService.offre}
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
            value={localService.membre}
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
            value={localService.nombre_membre}
            onChange={handleChange}
          />
        </div>
      </div>
      {submitError && <p className="text-danger mt-2">{submitError}</p>}
    </Modal>
  );
};

export default ServiceEdit;