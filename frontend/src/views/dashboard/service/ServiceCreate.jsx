import React, { useState, useEffect } from "react";
import { z } from "zod";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import useServiceStore from "../../../store/serviceStore";

// Schéma Zod pour valider le formulaire
const serviceSchema = z.object({
  fokotany_id: z.string().min(1, "Fokotany requis"),
  nomService: z.string().min(1, "Nom requis"),
  description: z.string().min(1, "Description requise"),
  offre: z.string().min(1, "Offre requise"),
  membre: z.string().min(1, "Membre requis"),
  nombre_membre: z
    .string()
    .min(1, "Nombre requis")
    .refine((val) => !isNaN(Number(val)), "Doit être un nombre"),
});

const initialService = {
  fokotany_id: "",
  nomService: "",
  description: "",
  offre: "",
  membre: "",
  nombre_membre: "",
};

const ServiceCreate = ({ isOpen, onClose, onSave }) => {
  const [service, setService] = useState(initialService);
  const [fokotanys, setFokotanys] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const { createService } = useServiceStore();

  useEffect(() => {
    const fetchFokotanys = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/fokotany/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setFokotanys(data);
      } catch {
        setErrors((prev) => ({ ...prev, fokotany_id: "Impossible de charger les fokotanys." }));
      }
    };
    fetchFokotanys();
  }, []);

  // Validation d'un champ individuel
  const validateField = (name, value) => {
    try {
      serviceSchema.pick({ [name]: true }).parse({ [name]: value });
      return "";
    } catch (err) {
      return err.errors?.[0]?.message || "";
    }
  };

  // Gestion du changement de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    setService((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError("");
  };

  // Validation globale du formulaire
  const isFormValid = serviceSchema.safeParse(service).success;

  const resetForm = () => {
    setService(initialService);
    setErrors({});
    setSubmitError("");
  };

  const handleSave = async () => {
    try {
      serviceSchema.parse(service);
      setSubmitError("");
      const payload = {
        ...service,
        nombre_membre: parseInt(service.nombre_membre, 10),
      };
      await createService(payload);
      if (onSave) onSave("Service créé avec succès !");
      resetForm();
      onClose();
    } catch (err) {
      if (err.errors) {
        // Erreurs zod
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message || "Erreur lors de la création du service.");
      }
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
        <div className="col mb-3">
          <InputField
            required
            label="Nom Service"
            name="nomService"
            value={service.nomService}
            onChange={handleChange}
            error={!!errors.nomService}
            helperText={errors.nomService}
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
            error={!!errors.description}
            helperText={errors.description}
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
            error={!!errors.offre}
            helperText={errors.offre}
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
            error={!!errors.membre}
            helperText={errors.membre}
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
            error={!!errors.nombre_membre}
            helperText={errors.nombre_membre}
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