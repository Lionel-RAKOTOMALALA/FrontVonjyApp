import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';

const FokotanyCreate = ({ isOpen, onSave, onClose }) => {
    const [fokotany, setFokotany] = useState({ commune: '', nomFokotany: '' });
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [inputDisabled, setInputDisabled] = useState(false);

    // Exemple de données communes (à remplacer par des données dynamiques si besoin)
    const communes = ['Androaka', 'Ampanihy', 'Ankiliabo', 'Amboropotsy', 'Ankilizato', 'Maniry',
        'Ankilimivory', 'Androipano','Anavoha','Antaly','Beara', 'Belafika Ambony','Beroy Atsimo','Ejeda',  'Gogogogo', 'Beahitse', 'Vohitany', 'Fotadrevo'];

    const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

    const isFormValid =
        fokotany.nomFokotany.trim() !== '' &&
        fokotany.commune.trim() !== '' &&
        isValidName(fokotany.nomFokotany.trim()) &&
        !inputDisabled;

    const resetForm = () => {
        setFokotany({ commune: '', nomFokotany: '' });
        setError('');
        setSubmitError('');
        setInputDisabled(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Si on modifie le nom du fokotany, appliquer la validation
        if (name === 'nomFokotany' && !isValidName(value)) {
            setError("Seules les lettres, chiffres romains, espaces et tirets sont autorisés.");
            setInputDisabled(true);
            return;
        }

        setError('');
        setInputDisabled(false);
        setFokotany((prev) => ({ ...prev, [name]: value }));
    };
    

    const handleSave = async () => {
        try {
            if (!isFormValid) {
                setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
                return;
            }

            setSubmitError('');
            await onSave(fokotany);
            console.log('Données du fokotany:', fokotany);
        } catch (err) {
            console.error("Erreur lors de l'enregistrement du fokotany :", err);
            setSubmitError("Une erreur est survenue lors de la création. Veuillez réessayer.");
        }
    };

    return (
        <Modal
            title="Créer un fokotany"
            btnLabel="Créer"
            isOpen={isOpen}
            onSave={handleSave}
            onClose={onClose}
            isFormValid={isFormValid}
            resetForm={resetForm}
            maxWidth="435px"
        >
            <div className="row">
                <div className="col mb-3 mt-2">
                    <label htmlFor="commune" className="form-label">Commune</label>
                    <SelectField
                        label="Sélectionnez une commune"
                        name="commune"
                        value={fokotany.commune}
                        onChange={handleChange}
                        options={communes}
                    />

                </div>
            </div>
            <div className="row">

                <div className="col mb-3">
                    <InputField
                        required
                        label="Nom du fokotany"
                        name="nomFokotany"
                        value={fokotany.nomFokotany}
                        onChange={handleChange}
                        error={!!error}
                        helperText={error || ' '}
                    />
                </div>

                {submitError && (
                    <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
                        {submitError}
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default FokotanyCreate;
