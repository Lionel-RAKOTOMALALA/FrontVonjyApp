// AnnuaireCreate.js
import { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';

// Schéma de validation Zod
const annuaireSchema = z.object({
    acteurs: z.string()
        .trim()
        .min(1, "Le champ Acteurs est requis"),
    personne_reference: z.string()
        .trim()
        .min(1, "Le champ Personne de référence est requis"),
    contacts: z.string()
        .trim()
        .min(1, "Le champ Contacts est requis"),
    interventions_actuelles: z.string()
        .trim()
        .min(1, "Le champ Interventions actuelles est requis"),
    domaines_intervention_possibles: z.string()
        .trim()
        .min(1, "Le champ Domaines d'intervention possibles est requis"),
    ouverture: z.string()
        .trim()
        .min(1, "Le champ Ouverture est requis")
});

const AnnuaireCreate = ({ isOpen, onSave, onClose }) => {
    // État local pour stocker les données du formulaire
    const [annuaire, setAnnuaire] = useState({
        acteurs: '',
        personne_reference: '',
        contacts: '',
        interventions_actuelles: '',
        domaines_intervention_possibles: '',
        ouverture: ''
    });

    // État pour les erreurs de validation
    const [errors, setErrors] = useState({});

    // Réinitialise le formulaire quand le modal se ferme
    useEffect(() => {
        if (!isOpen) {
            setAnnuaire({
                acteurs: '',
                personne_reference: '',
                contacts: '',
                interventions_actuelles: '',
                domaines_intervention_possibles: '',
                ouverture: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    // Gère les changements pour les champs texte du formulaire
    const handleChange = (event) => {
        const { name, value } = event.target;
        setAnnuaire(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Efface l'erreur pour ce champ lors de la modification
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    // Valide les données avec Zod
    const validateForm = () => {
        try {
            annuaireSchema.parse(annuaire);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    // Gère la sauvegarde des données du formulaire
    const handleSave = () => {
        if (validateForm()) {
            console.log('Données de l\'annuaire:', annuaire);
            onSave(annuaire); // Appelle la fonction parent pour sauvegarder
        }
    };

    return (
        <Modal
            title="Créer un annuaire"
            btnLabel="Créer"
            isOpen={isOpen}
            onSave={handleSave}
            onClose={onClose}
            maxWidth="600px"
        >
            {/* Champ Acteurs */}
            <div className="row">
                <div className="col mb-3 mt-2">
                    <InputField
                        required
                        label="Acteurs"
                        name="acteurs"
                        value={annuaire.acteurs}
                        onChange={handleChange}
                        error={!!errors.acteurs}
                        helperText={errors.acteurs}
                    />
                </div>
            </div>

            {/* Champ Personne de référence */}
            <div className="row">
                <div className="col mb-3">
                    <InputField
                        required
                        label="Personne de référence"
                        name="personne_reference"
                        value={annuaire.personne_reference}
                        onChange={handleChange}
                        error={!!errors.personne_reference}
                        helperText={errors.personne_reference}
                    />
                </div>
            </div>

            {/* Champ Contacts */}
            <div className="row">
                <div className="col mb-3">
                    <InputField
                        required
                        label="Contacts"
                        name="contacts"
                        value={annuaire.contacts}
                        onChange={handleChange}
                        error={!!errors.contacts}
                        helperText={errors.contacts}
                    />
                </div>
            </div>

            {/* Champ Interventions actuelles */}
            <div className="row">
                <div className="col mb-3">
                    <InputField
                        required
                        label="Interventions actuelles"
                        name="interventions_actuelles"
                        value={annuaire.interventions_actuelles}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        error={!!errors.interventions_actuelles}
                        helperText={errors.interventions_actuelles}
                    />
                </div>
            </div>

            {/* Champ Domaines d'intervention possibles */}
            <div className="row">
                <div className="col mb-3">
                    <InputField
                        required
                        label="Domaines d'intervention possibles"
                        name="domaines_intervention_possibles"
                        value={annuaire.domaines_intervention_possibles}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        error={!!errors.domaines_intervention_possibles}
                        helperText={errors.domaines_intervention_possibles}
                    />
                </div>
            </div>

            {/* Champ Ouverture */}
            <div className="row">
                <div className="col mb-0">
                    <InputField
                        required
                        label="Ouverture"
                        name="ouverture"
                        value={annuaire.ouverture}
                        onChange={handleChange}
                        error={!!errors.ouverture}
                        helperText={errors.ouverture}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default AnnuaireCreate;