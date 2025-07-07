import { useState, useEffect } from "react";
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

const ChefServiceEdit = ({ isOpen, chefService, onSave, onClose, onError }) => {
  const { updateChefService } = useChefServiceStore();
  const { fokotanys, fetchFokotanys } = useFokotanyStore();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [localChefService, setLocalChefService] = useState(initialChefService);
  const [errors, setErrors] = useState({});
  const [, setSubmitError] = useState("");

  // Charger les fokotanys au montage
  useEffect(() => {
    fetchFokotanys();
  }, [fetchFokotanys]);

  // Pré-remplir le formulaire à l'ouverture
  useEffect(() => {
    if (chefService && fokotanys.length > 0) {
      const fokotanyObj = chefService.fokotany || chefService.service?.fokotany;
      setLocalChefService({
        service_id: chefService.service?.id?.toString() || "",
        fokotany_id: fokotanyObj?.id?.toString() || "",
        nomChef: chefService.nomChef || "",
        prenomChef: chefService.prenomChef || "",
        contact: chefService.contact || "",
        adresse: chefService.adresse || "",
        sexe: chefService.sexe || "null",
      });
      setErrors({});
      setSubmitError("");
    }
  }, [chefService, fokotanys]);

  // Charger les services du fokotany sélectionné
  useEffect(() => {
    const fetchFokotanyDetails = async (fokotanyId) => {
      if (!fokotanyId) {
        setServices([]);
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
        setServices(data.services || []);
      } catch {
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchFokotanyDetails(localChefService.fokotany_id);
  }, [localChefService.fokotany_id]);

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
    setLocalChefService((prev) => {
      if (name === "fokotany_id" && value !== prev.fokotany_id) {
        return { ...prev, fokotany_id: value, service_id: "" };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError("");
  };

  // Validation globale du formulaire
  const isFormValid = chefServiceSchema.safeParse(localChefService).success;

  const handleSave = async () => {
    try {
      chefServiceSchema.parse(localChefService);
      setSubmitError("");
      const {
        service_id,
        nomChef,
        prenomChef,
        contact,
        adresse,
        sexe
      } = localChefService;
      const payload = {
        service_id,
        nomChef,
        prenomChef,
        contact,
        adresse,
        sexe,
      };
      await updateChefService(chefService.id, payload);
      if (onSave) onSave("Chef de service modifié avec succès !");
      onClose();
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        const msg = err.message || "Erreur lors de la requête. Vérifiez vos données.";
        if (onError) onError(msg); // Ajout ici
      }
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
      resetForm={() => {}}
    >
      <div className="row">
        <div className="col mb-3 mt-2">
          {fokotanys && fokotanys.length > 0 ? (
            <SelectField
              required
              label="Sélectionnez un fokotany"
              name="fokotany_id"
              value={localChefService.fokotany_id}
              onChange={handleChange}
              options={fokotanys.map((fokotany) => ({
                value: fokotany.id.toString(),
                label: `${fokotany.nomFokotany} (${fokotany.commune?.nomCommune || "Commune inconnue"})`,
              }))}
              placeholder="Choisissez un fokotany"
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
          ) : localChefService.fokotany_id ? (
            services.length > 0 ? (
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
                error={!!errors.service_id}
                helperText={errors.service_id}
              />
            ) : (
              <p className="text-warning">Aucun service disponible pour ce fokotany.</p>
            )
          ) : (
            <p className="text-info">Veuillez d&apos;abord sélectionner un fokotany.</p>
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
            value={localChefService.prenomChef}
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
            value={localChefService.contact}
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
            value={localChefService.adresse}
            onChange={handleChange}
            error={!!errors.adresse}
            helperText={errors.adresse}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChefServiceEdit;