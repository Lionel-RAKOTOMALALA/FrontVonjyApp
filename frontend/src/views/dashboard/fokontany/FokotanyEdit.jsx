import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField';

const FokotanyEdit = ({ isOpen, fokotany, onChange, onSave, onClose }) => {
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [inputDisabled, setInputDisabled] = useState(false);

    // Exemple de données communes (à remplacer dynamiquement si nécessaire)
    const communes = ['Androaka', 'Ampanihy', 'Ankiliabo', 'Amboropotsy', 'Ankilizato', 'Maniry',
         'Ankilimivory', 'Androipano','Anavoha','Antaly','Beara', 'Belafika Ambony','Beroy Atsimo','Ejeda',  'Gogogogo', 'Beahitse', 'Vohitany', 'Fotadrevo'];

    const validFokotany = fokotany || { commune: '', nomFokotany: '' };

    const isValidName = (value) => /^[a-zA-ZÀ-ÿ0-9IVXLCDM\s-]*$/i.test(value);

    const isFormValid =
        validFokotany.nomFokotany?.trim() !== '' &&
        validFokotany.commune?.trim() !== '' &&
        isValidName(validFokotany.nomFokotany?.trim()) &&
        !inputDisabled;

    const resetForm = () => {
        onChange({ commune: '', nomFokotany: '' });
        setError('');
        setSubmitError('');
        setInputDisabled(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'nomFokotany' && !isValidName(value)) {
            setError("Seules les lettres, chiffres romains, espaces et tirets sont autorisés.");
            setInputDisabled(true);
            return;
        }

        setError('');
        setInputDisabled(false);
        onChange({ ...validFokotany, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (!isFormValid) {
                setSubmitError("Veuillez corriger les erreurs du formulaire avant de soumettre.");
                return;
            }

            setSubmitError('');
            await onSave(validFokotany);
        } catch (err) {
            console.error("Erreur lors de la mise à jour du fokotany :", err);
            setSubmitError("Une erreur est survenue lors de la modification. Veuillez réessayer.");
        }
    };
    

    return (
        <Modal
            title="Modifier un fokotany"
            btnLabel="Sauvegarder"
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
                        value={validFokotany.commune}
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
                        value={validFokotany.nomFokotany || ''}
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

export default FokotanyEdit;
