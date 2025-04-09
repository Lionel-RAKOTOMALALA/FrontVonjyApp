import React, { useState }  from 'react'
import InputField from '../../components/ui/form/InputField';
import SelectField from '../../components/ui/form/SelectField';
import InputQuantity from '../../components/ui/InputQuantity';
import CheckboxPage from './checkbox';

function input() {
    const [genre, setGenre] = useState('');

    const selectChange = (event) => {
      const { value } = event.target;
      setGenre(value);
    };
    
    const handleQuantityChange = (event, newValue) => {
      
    };
  return (
    <>
        <h5 className="card-header">Inputs</h5> 
        <div className="card-body pt-0" > 
            <div className="row"> 
                <div className="mb-3 col-md-6">
                <InputField 
                    label="Nom"
                    name="nom" 
                    required={false}
                />
                </div>
                <div className="mb-3 col-md-6">
                <InputField 
                    label="Prénom"
                    name="prenom" 
                    required={false}
                />
                </div> 
                <div className="mb-3 col-md-6">
                <SelectField
                    label="Genre"
                    name="genre"
                    value={genre}
                    onChange={selectChange}
                    options={["Homme","Femme"]} 
                />  
                </div> 
                <div className="mb-3 col-md-6">
                <InputField 
                    error
                    id="outlined-error-helper-text"
                    label="Error"
                    defaultValue="hobyhardiot1@g.mail.com"
                    helperText="Incorrect entry"
                    name="email" 
                    required={false}
                />
                </div> 
                <div className="mb-3 col-md-6">
                <label htmlFor="quantité" className="mb-2 d-flex flex-column align-items-center" style={{ fontWeight: '700', color: '#919EAB', fontSize: '0.75rem' }}>
                    Champ nombre
                </label>
                <InputQuantity
                    aria-label="Nombre"
                    min={1}
                    max={1000} 
                    onChange={handleQuantityChange} 
                />
                </div> 
                <div className="mb-3 col-md-6">
                    <InputField 
                        id="outlined-multiline-static"
                        label="Description"
                        name="description" 
                        required={false}
                        multiline
                        rows={5}
                        defaultValue="Default value"
                    />
                </div> 
                <hr className="m-0" />
                <div className="mb-3 mt-4 col-md-6">
                    <small className="text-light fw-medium">Checkbox</small> 
                    <CheckboxPage/>
                </div> 
            </div>
        </div>
    </>
  )
}

export default input