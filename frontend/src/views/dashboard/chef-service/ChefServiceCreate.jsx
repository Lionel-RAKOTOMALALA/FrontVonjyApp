import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useChefServiceStore from "../../../store/chefServiceStore";
import useFokotanyStore from "../../../store/fokotanyStore";

const ChefServiceCreate = ({ isOpen, onClose, onSave }) => {
  const [chefService, setChefService] = useState({
    service_id: "",
    fokotany_id: "",
    nomChef: "",
    prenomChef: "",
    contact: "",
    adresse: "",
    sexe: "",
  });

  const [filteredServices, setFilteredServices] = useState([]);
  const [fokotanyDetails, setFokotanyDetails] = useState(null);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const { createChefService } = useChefServiceStore();
  const { fokotanys, fetchFokotanys } = useFokotanyStore();

  // Charger les fokotanys au montage du composant
  useEffect(() => {
    const loadFokotanys = async () => {
      setLoading(true);
      try {
        await fetchFokotanys();
      } catch (err) {
        console.error("Erreur lors de la récupération des fokotanys :", err);
        setError("Impossible de charger les fokotanys.");
      } finally {
        setLoading(false);
      }
    };

    loadFokotanys();
  }, [fetchFokotanys]);

  // Charger les détails du fokotany lorsqu'un fokotany est sélectionné
  useEffect(() => {
    const fetchFokotanyDetails = async (fokotanyId) => {
      if (!fokotanyId) {
        setFilteredServices([]);
        return;
      }

      setLoadingServices(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/fokotany/${fokotanyId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des détails du fokotany.");
        }
        const data = await response.json();
        console.log("Détails du fokotany:", data);

        setFokotanyDetails(data);
        // Mettre à jour les services filtrés avec la liste des services du fokotany
        setFilteredServices(data.services || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des détails du fokotany:", err);
        setError("Impossible de charger les services pour ce fokotany.");
        setFilteredServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchFokotanyDetails(chefService.fokotany_id);
  }, [chefService.fokotany_id]);

  const isFormValid =
    chefService.fokotany_id !== "" &&
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
      fokotany_id: "",
      nomChef: "",
      prenomChef: "",
      contact: "",
      adresse: "",
      sexe: "",
    });
    setError("");
    setSubmitError("");
    setInputDisabled(false);
    setFilteredServices([]);
    setFokotanyDetails(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChefService((prev) => {
      // Si nous changeons de fokotany, réinitialiser le service_id
      if (name === "fokotany_id" && value !== prev.fokotany_id) {
        return { ...prev, [name]: value, service_id: "" };
      }
      return { ...prev, [name]: value };
    });
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
      if (onSave) onSave("Chef de service créé avec succès !");

      resetForm();
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du chef de service :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de la création.");
      if (onSave) onSave(err.message || "Erreur lors de la création.", "error");
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
          {loading ? (
            <p>Chargement des fokotanys...</p>
          ) : fokotanys && fokotanys.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={chefService.fokotany_id}
              onChange={handleChange}
              options={fokotanys.map((fokotany) => ({
                value: fokotany.id.toString(),
                label: `${fokotany.nomFokotany} (${fokotany.commune?.nomCommune || "Commune inconnue"})`,
              }))}
              placeholder="Choisissez un fokotany"
              autocomplete={true}
            />
          ) : (
            <p className="text-danger">Aucun fokotany disponible.</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col mb-3 mt-2">
          {loadingServices ? (
            <p>Chargement des services...</p>
          ) : chefService.fokotany_id ? (
            filteredServices.length > 0 ? (
              <SelectField
                required
                label="Sélectionnez un service"
                name="service_id"
                value={chefService.service_id}
                onChange={handleChange}
                options={filteredServices.map((service) => ({
                  value: service.id.toString(),
                  label: service.nomService,
                }))}
                placeholder="Choisissez un service"
              />
            ) : (
              <p className="text-warning">Aucun service disponible pour ce fokotany.</p>
            )
          ) : (
            <p className="text-info">Veuillez d'abord sélectionner un fokotany.</p>
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