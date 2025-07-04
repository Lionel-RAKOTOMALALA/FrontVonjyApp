import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SelectField from '../../../components/ui/form/SelectField';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import useActeursCommuneStore from '../../../store/acteursCommuneStore';

// Schéma de validation Zod amélioré

const acteurSchema = z.object({
    nom: z.string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes')
        .trim(),
    prenom: z.string()
        .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
        .regex(/^[a-zA-ZÀ-ÿ\s-']*$/, 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes')
        .trim()
        .optional()
        .or(z.literal('')),
    commune_id: z.string()
        .min(1, 'La commune est requise')
        .refine(val => !isNaN(Number(val)), 'ID de commune invalide'),
    role_acteurs: z.string()
        .min(1, 'Le rôle est requis')
        .max(200, 'Le rôle ne peut pas dépasser 200 caractères')
        .trim(),
    contact: z.string()
        .min(1, 'Le contact est requis')
        .max(50, 'Le contact ne peut pas dépasser 50 caractères')
        .regex(/^[\d\s+()-]+$/, 'Le contact doit être un numéro de téléphone valide')
        .trim(),
    interventions_actuelles: z.string()
        .max(200000, 'Les interventions actuelles ne peuvent pas dépasser 200000 caractères')
        .trim()
        .optional()
        .or(z.literal('')),
    domaines_intervention_possibles: z.string()
        .max(200000, 'Les domaines d\'intervention ne peuvent pas dépasser 200000 caractères')
        .trim()
        .optional()
        .or(z.literal('')),
    ouverture: z.string()
        .max(500, 'L\'ouverture ne peut pas dépasser 500 caractères')
        .trim()
        .optional()
        .or(z.literal(''))
});

function ActeurEdit({ isOpen, acteur, onChange, onSave, onClose }) {
    const [communes, setCommunes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formData, setFormData] = useState({});

    const { updateActeur } = useActeursCommuneStore();

    // Valeurs par défaut
    const getDefaultValues = () => ({
        nom: '',
        prenom: '',
        commune_id: '',
        role_acteurs: '',
        contact: '',
        interventions_actuelles: '',
        domaines_intervention_possibles: '',
        ouverture: ''
    });

    // Fonction pour extraire les données de l'acteur
    const getActeurData = (acteurData) => {
        if (!acteurData) return getDefaultValues();

        return {
            nom: acteurData.nom || '',
            prenom: acteurData.prenom || '',
            commune_id: acteurData.commune_id ?
                acteurData.commune_id.toString() :
                (acteurData.commune?.id ? acteurData.commune.id.toString() : ''),
            role_acteurs: acteurData.role_acteurs || '',
            contact: acteurData.contact || '',
            interventions_actuelles: acteurData.interventions_actuelles || '',
            domaines_intervention_possibles: acteurData.domaines_intervention_possibles || '',
            ouverture: acteurData.ouverture || ''
        };
    };

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        const initialData = getDefaultValues();
        setFormData(initialData);
        if (onChange) {
            onChange(initialData);
        }
        setValidationErrors({});
        setSubmitError('');
        setIsFormValid(false);
    };

    // Charger les communes dès l'ouverture du modal
    useEffect(() => {
        const fetchCommunes = async () => {
            if (!isOpen) return;

            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('http://localhost:8000/api/communes/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des communes.');
                }

                const data = await response.json();
                console.log('Communes chargées:', data); // Debug
                setCommunes(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des communes :', err);
                setError('Impossible de charger les communes.');
            } finally {
                setLoading(false);
            }
        };

        fetchCommunes();
    }, [isOpen]);

    // Initialiser le formulaire avec les données de l'acteur après le chargement des communes
    useEffect(() => {
        if (isOpen && communes.length > 0) {
            const initialData = getActeurData(acteur);
            console.log('Initialisation du formulaire avec:', initialData); // Debug
            console.log('Acteur reçu:', acteur); // Debug
            console.log('Communes disponibles:', communes); // Debug

            setFormData(initialData);
            if (onChange) {
                onChange(initialData);
            }
        }
    }, [isOpen, acteur, communes, onChange]);

    // Validation du formulaire
    const validateForm = (data) => {
        try {
            acteurSchema.parse(data);
            setValidationErrors({});
            setIsFormValid(true);
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = {};
                error.errors.forEach((err) => {
                    errors[err.path[0]] = err.message;
                });
                setValidationErrors(errors);
            }
            setIsFormValid(false);
            return false;
        }
    };

    // Validation d'un champ spécifique
    const validateField = (name, value) => {
        try {
            acteurSchema.pick({ [name]: true }).parse({ [name]: value });
            return '';
        } catch (err) {
            return err.errors?.[0]?.message || '';
        }
    };

    // Valider quand les données du formulaire changent
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            validateForm(formData);
        }
    }, [formData]);

    // Fonction pour gérer les changements
    const handleChange = (name, value) => {
        console.log(`Changement du champ ${name} à:`, value); // Debug

        const newData = { ...formData, [name]: value };
        setFormData(newData);

        if (onChange) {
            onChange(newData);
        }

        // Validation du champ modifié
        const fieldError = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
        setSubmitError('');
    };

    // Fonction spéciale pour gérer le changement du SelectField
    const handleSelectChange = (name, value) => {
        console.log(`Changement du select ${name} à:`, value); // Debug
        handleChange(name, value);
    };

    // Fonction pour gérer la sauvegarde
    const handleSave = async () => {
        try {
            // Validation des données du formulaire
            const validatedData = acteurSchema.parse(formData);

            // Préparer les données pour l'API (convertir commune_id en number)
            const payload = {
                ...validatedData,
                commune_id: parseInt(validatedData.commune_id, 10),
                // Inclure l'ID de l'acteur pour la modification
                id: acteur?.id
            };

            console.log('Données à envoyer:', payload); // Debug

            // Appeler la méthode de mise à jour depuis le store
            await updateActeur(acteur.id, payload);

            // Succès
            if (onSave) {
                onSave('Acteur modifié avec succès !', 'success');
            }

            // Réinitialiser et fermer
            resetForm();
            onClose();

        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);

            if (err instanceof z.ZodError) {
                // Erreurs de validation Zod
                const fieldErrors = {};
                err.errors.forEach(error => {
                    fieldErrors[error.path[0]] = error.message;
                });
                setValidationErrors(fieldErrors);
                setSubmitError('Veuillez corriger les erreurs dans le formulaire.');
            } else {
                // Autres erreurs (API, réseau, etc.)
                const errorMessage = err.message || "Une erreur est survenue lors de la modification.";
                setSubmitError(errorMessage);

                if (onSave) {
                    onSave(errorMessage, 'error');
                }
            }
        }
    };

    // Fonction pour gérer la fermeture
    const handleClose = () => {
        resetForm();
        if (onClose) {
            onClose();
        }
    };

    // Vérifier si la commune existe dans la liste
    const selectedCommuneId = formData.commune_id || '';
    const communeExists = communes.some(commune => commune.id.toString() === selectedCommuneId);
    const safeCommune = communeExists ? selectedCommuneId : '';

    console.log('Commune sélectionnée:', selectedCommuneId); // Debug
    console.log('Commune existe:', communeExists); // Debug
    console.log('Commune sécurisée:', safeCommune); // Debug

    return (
        <Modal
            title="Modifier un acteur"
            btnLabel="Sauvegarder"
            isOpen={isOpen}
            onSave={handleSave}
            onClose={handleClose}
            isFormValid={isFormValid}
            resetForm={resetForm}
            maxWidth="600px"
        >
            {submitError && (
                <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
                    {submitError}
                </p>
            )}

            {error && (
                <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
                    {error}
                </p>
            )}

            <div className="row">
                <div className="col-md-6 mb-3 mt-2">
                    <TextField
                        required
                        label="Nom"
                        fullWidth
                        error={!!validationErrors.nom}
                        helperText={validationErrors.nom}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                        value={formData.nom || ''}
                        onChange={(e) => handleChange('nom', e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3 mt-2">
                    <TextField
                        label="Prénom"
                        fullWidth
                        error={!!validationErrors.prenom}
                        helperText={validationErrors.prenom}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                        value={formData.prenom || ''}
                        onChange={(e) => handleChange('prenom', e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <SelectField
                        label="Commune"
                        name="commune_id"
                        value={safeCommune}
                        onChange={(e) => handleSelectChange('commune_id', e.target.value)}
                        options={communes.map((commune) => ({
                            label: commune.nomCommune,
                            value: commune.id.toString(),
                        }))}
                        error={!!validationErrors.commune_id}
                        helperText={validationErrors.commune_id}
                        placeholder="Choisissez une commune"
                        required={true}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <TextField
                        required
                        label="Rôle"
                        fullWidth
                        error={!!validationErrors.role_acteurs}
                        helperText={validationErrors.role_acteurs}
                        value={formData.role_acteurs || ''}
                        onChange={(e) => handleChange('role_acteurs', e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <TextField
                        required
                        label="Contact"
                        fullWidth
                        placeholder="Ex: 033 24 992 10"
                        error={!!validationErrors.contact}
                        helperText={validationErrors.contact}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                        value={formData.contact || ''}
                        onChange={(e) => handleChange('contact', e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <TextField
                        label="Ouverture"
                        fullWidth
                        error={!!validationErrors.ouverture}
                        helperText={validationErrors.ouverture}
                        value={formData.ouverture || ''}
                        onChange={(e) => handleChange('ouverture', e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col mb-3">
                    <TextField
                        label="Interventions actuelles"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Décrivez les interventions actuelles..."
                        error={!!validationErrors.interventions_actuelles}
                        helperText={validationErrors.interventions_actuelles}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                        value={formData.interventions_actuelles || ''}
                        onChange={(e) => handleChange('interventions_actuelles', e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col mb-3">
                    <TextField
                        label="Domaines d'intervention possibles"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Décrivez les domaines d'intervention possibles..."
                        error={!!validationErrors.domaines_intervention_possibles}
                        helperText={validationErrors.domaines_intervention_possibles}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 'bold',
                                color: '#637381',
                                '&.Mui-focused': {
                                    fontWeight: 'bold',
                                    color: '#1C252E',
                                },
                            },
                        }}
                        value={formData.domaines_intervention_possibles || ''}
                        onChange={(e) => handleChange('domaines_intervention_possibles', e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default ActeurEdit;