import React, { useState, useEffect } from "react";
import { z } from "zod";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/form/InputField";
import SelectField from "../../../components/ui/form/SelectField";
import RadioGroupField from "../../../components/ui/form/RadioGroupField";
import useResponsableStore from "../../../store/responsableStore";

// Schéma zod pour la validation
const responsableSchema = z.object({
  fokotany_id: z.string().min(1, "Le fokotany est requis"),
  classe_responsable: z.string().min(1, "La classe est requise"),
  nom_responsable: z.string().min(1, "Le nom est requis"),
  prenom_responsable: z.string().optional(),
  contact_responsable: z.string().optional(),
  fonction: z.string().min(1, "La fonction est requise"),
  formation_acquise: z.enum(["true", "false"]),
});

const ResponsableCreate = ({ isOpen, onClose, onSave }) => {
  const [responsable, setResponsable] = useState({
    fokotany_id: "",
    classe_responsable: "",
    nom_responsable: "",
    prenom_responsable: "",
    contact_responsable: "",
    fonction: "",
    formation_acquise: "true",
  });

  const [fokotanys, setFokotanys] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createResponsable } = useResponsableStore();

  // Charger les fokotanys depuis l'API
  useEffect(() => {
    const fetchFokotanys = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/api/fokotany/", {
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
        setErrors((prev) => ({ ...prev, fokotany_id: "Impossible de charger les fokotanys." }));
      } finally {
        setLoading(false);
      }
    };

    fetchFokotanys();
  }, []);

  // Validation d'un champ individuel
  const validateField = (name, value) => {
    try {
      responsableSchema.pick({ [name]: true }).parse({ [name]: value });
      return "";
    } catch (err) {
      return err.errors?.[0]?.message || "";
    }
  };

  // Gestion du changement de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    setResponsable((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError("");
  };

  // Validation globale du formulaire
  const isFormValid = responsableSchema.safeParse(responsable).success && !inputDisabled;

  const resetForm = () => {
    setResponsable({
      fokotany_id: "",
      classe_responsable: "",
      nom_responsable: "",
      prenom_responsable: "",
      contact_responsable: "",
      fonction: "",
      formation_acquise: "true",
    });
    setErrors({});
    setSubmitError("");
    setInputDisabled(false);
  };

  const handleSave = async () => {
    try {
      responsableSchema.parse(responsable);

      setSubmitError("");
      const payload = {
        ...responsable,
        formation_acquise: responsable.formation_acquise === "true",
      };

      await createResponsable(payload);
      if (onSave) onSave("Responsable créé avec succès !");
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
        setSubmitError(err.message || "Une erreur est survenue lors de la création.");
        if (onSave) onSave(err.message || "Erreur lors de la création.", "error");
      }
    }
  };

  return (
    <Modal
      title="Ajouter un responsable"
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
          ) : fokotanys.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={responsable.fokotany_id}
              onChange={handleChange}
              options={fokotanys.map((fokotany) => ({
                value: fokotany.id.toString(),
                label: `${fokotany.nomFokotany} (${fokotany.commune.nomCommune})`,
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
            label="Classe"
            name="classe_responsable"
            value={responsable.classe_responsable}
            onChange={handleChange}
            error={!!errors.classe_responsable}
            helperText={errors.classe_responsable}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required
            label="Nom"
            name="nom_responsable"
            value={responsable.nom_responsable}
            onChange={handleChange}
            error={!!errors.nom_responsable}
            helperText={errors.nom_responsable}
          />
        </div>
        <div className="col mb-3">
          <InputField
            required={false}
            label="Prénom"
            name="prenom_responsable"
            value={responsable.prenom_responsable}
            onChange={handleChange}
            error={!!errors.prenom_responsable}
            helperText={errors.prenom_responsable}
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
            error={!!errors.fonction}
            helperText={errors.fonction}
          />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <InputField
            required={false}
            label="Contact"
            name="contact_responsable"
            value={responsable.contact_responsable}
            onChange={handleChange}
            error={!!errors.contact_responsable}
            helperText={errors.contact_responsable}
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
    </Modal>
  );
};

export default ResponsableCreate;