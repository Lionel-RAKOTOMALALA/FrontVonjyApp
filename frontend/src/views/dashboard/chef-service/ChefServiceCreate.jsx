import React, { useState, useEffect } from "react";
import { z } from "zod";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useChefServiceStore from "../../../store/chefServiceStore";
import useFokotanyStore from "../../../store/fokotanyStore";

// Schéma Zod pour valider le formulaire ChefService
const chefServiceSchema = z.object({
  fokotany_id: z.string().trim().min(1, "Fokotany requis"),
  service_id: z.string().trim().min(1, "Service requis"),
  nomChef: z.string().trim().min(1, "Nom requis"),
  prenomChef: z.string().trim().min(1, "Prénom requis"),
  contact: z.string().trim().min(1, "Contact requis"),
  adresse: z.string().trim().min(1, "Adresse requise"),
  sexe: z.string().optional(),
});
// ...existing code...

const initialChefService = {
  service_id: "",
  fokotany_id: "",
  nomChef: "",
  prenomChef: "",
  contact: "",
  adresse: "",
  sexe: "null",
};

const ChefServiceCreate = ({ isOpen, onClose, onSave, onError }) => {
  const [chefService, setChefService] = useState(initialChefService);
  const [filteredServices, setFilteredServices] = useState([]);
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const { createChefService } = useChefServiceStore();
  const { fokotanys, fetchFokotanys } = useFokotanyStore();

  // Charger les fokotanys au montage
  useEffect(() => {
    const loadFokotanys = async () => {
      setLoading(true);
      try {
        await fetchFokotanys();
      } catch {
        setErrors((prev) => ({ ...prev, fokotany_id: "Impossible de charger les fokotanys." }));
      } finally {
        setLoading(false);
      }
    };
    loadFokotanys();
  }, [fetchFokotanys]);

  // Charger les services du fokotany sélectionné
  useEffect(() => {
    const fetchFokotanyDetails = async (fokotanyId) => {
      if (!fokotanyId) {
        setFilteredServices([]);
        return;
      }
      setLoadingServices(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:8000/api/fokotany/${fokotanyId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setFilteredServices(data.services || []);
      } catch {
        setFilteredServices([]);
        setErrors((prev) => ({ ...prev, service_id: "Impossible de charger les services." }));
      } finally {
        setLoadingServices(false);
      }
    };
    fetchFokotanyDetails(chefService.fokotany_id);
  }, [chefService.fokotany_id]);

  // Validation d'un champ individuel
  const validateField = (name, value) => {
    try {
      chefServiceSchema.pick({ [name]: true }).parse({ [name]: value });
      return "";
    } catch (err) {
      return err.errors?.[0]?.message || "";
    }
  };

  // Gestion du changement de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    setChefService((prev) => {
      if (name === "fokotany_id" && value !== prev.fokotany_id) {
        return { ...prev, [name]: value, service_id: "" };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Validation globale du formulaire
  const isFormValid = chefServiceSchema.safeParse(chefService).success;

  const resetForm = () => {
    setChefService(initialChefService);
    setErrors({});
    setFilteredServices([]);
  };

  const handleSave = async () => {
    try {
      chefServiceSchema.parse(chefService);
      await createChefService(chefService);
      if (onSave) onSave("Chef de service créé avec succès !");
      resetForm();
      onClose();
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        const msg = err.message || "Erreur lors de la création. Vérifiez vos données.";
        if (onError) onError(msg);
      }
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
              error={!!errors.fokotany_id}
              helperText={errors.fokotany_id}
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
                error={!!errors.service_id}
                helperText={errors.service_id}
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
            error={!!errors.nomChef}
            helperText={errors.nomChef}
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
            error={!!errors.prenomChef}
            helperText={errors.prenomChef}
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
            error={!!errors.contact}
            helperText={errors.contact}
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
            error={!!errors.adresse}
            helperText={errors.adresse}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChefServiceCreate;