// ChauffeurCreate.js
import  { useState } from 'react';  
import Modal from '../../../components/ui/Modal';
import InputField from '../../../components/ui/form/InputField';
import SelectField from '../../../components/ui/form/SelectField'; 
import 'dayjs/locale/fr'; 

const ChauffeurCreate = ({ isOpen, onClose }) => {
  // État local pour stocker les données du formulaire
  const [chauffeur, setChauffeur] = useState({
    nom: '',
    prenom: '',
    permis_conduire: '',
    experience: 1,
    telephone: '',
  });
  
  // Options pour le champ "Permis de conduire"
  const permisOptions = ['B', 'C', 'D', 'E'];

  // Vérifie si le formulaire est valide avant de pouvoir le soumettre
  const isFormValid = chauffeur.nom !== '' && chauffeur.prenom !== '' && chauffeur.permis_conduire.length > 0 && chauffeur.telephone !== '';

  // Gère les changements pour les champs texte du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setChauffeur(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Gère la sélection d'une option dans le champ "Permis de conduire"
  const handlePermisChange = (event) => {
    const { value } = event.target;
    setChauffeur(prevState => ({
      ...prevState,
      permis_conduire: value,
    }));
  };

  // Gère la sauvegarde des données du formulaire (actuellement affichées en console)
  const handleSave = () => { 
    console.log('Données du chauffeur:', chauffeur); 
    // onSave(chauffeur); // Peut être utilisé si on veut appeler une fonction parent
  };

  // Réinitialise tous les champs du formulaire après soumission
  const resetForm = () => {
    setChauffeur({
      nom: '',
      prenom: '',
      permis_conduire: '',
      experience: 1,
      telephone: '',
    });
  };

  
  return (
    <Modal
      title="Créer un chauffeur"
      btnLabel="Créer"
      isOpen={isOpen}
      onSave={handleSave}
      onClose={onClose}
      isFormValid={isFormValid}
      resetForm={resetForm} 
      maxWidth="435px"
    >
      {/* Champ Nom */}
      <div className="row">
        <div className="col mb-3 mt-2">
          <InputField
            required
            label="Nom"
            name="nom" 
            value={chauffeur.nom}
            onChange={handleChange} 
          />
        </div>
      </div>

      {/* Champ Prénom */}
      <div className="row">
        <div className="col mb-0">
          <InputField
            required
            label="Prénom"
            name="prenom" 
            value={chauffeur.prenom}
            onChange={handleChange} 
          />
        </div>
      </div>

      {/* Champ Téléphone */}
      <div className="row mt-3">
        <div className="col mb-3">
          <InputField
            required
            label="Numéro de téléphone"
            name="telephone"
            value={chauffeur.telephone}
            onChange={handleChange}
            type="number"
            inputProps={{ min: 0 }}
          />
        </div>
      </div>

      {/* Champ Permis de conduire */}
      {/* Exemple usage composant SelectField */}
      <div className="row g-2 mt-3"> 
        <div className="col mb-3">
          <SelectField
            label="Permis de conduire"
            name="permis_conduire"
            value={chauffeur.permis_conduire}
            onChange={handlePermisChange}
            options={permisOptions} 
          />  
        </div>
      </div>
    </Modal>
  );
};

export default ChauffeurCreate;
