// composant.js
import React from 'react';
import { Box } from '@mui/material'; 
import CustomButton from '../components/ui/CustomButton';
import InputField from '../components/ui/form/InputField';

function Composant() {
  return (
    <>
      <div className="row">
        {/* Basic Buttons */}
        <div className="col-12">
          <div className="card mb-4">
            <h5 className="card-header">Buttons</h5>
            <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <CustomButton
                variant="contained"
                color="primary"
              >
                Button
              </CustomButton>
              <CustomButton
                variant="outlined"
                color="primary"
              >
                Button
              </CustomButton> 
              <CustomButton
                variant="contained"
                color="secondary"
              >
                Button
              </CustomButton> 
              <CustomButton
                variant="outlined"
                color="secondary"
              >
                Button
              </CustomButton> 
              <CustomButton
                variant="text"
                color="primary"
              >
                Button
              </CustomButton> 
              <CustomButton
                variant="contained"
                color="primary"
                disabled
              >
                Button
              </CustomButton> 
            </div>  
          </div>
        </div>
        {/* <div className="col-12">
          <div className="card mb-4">
            <h5 className="card-header">Inputs</h5> 
            <div className="card-body pt-0" > 
                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            className="form-control"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value="John"
                            autoFocus />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input className="form-control" type="text" name="lastName" id="lastName" value="Doe" />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            className="form-control"
                            type="text"
                            id="email"
                            name="email"
                            value="john.doe@example.com"
                            placeholder="john.doe@example.com" />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="organization" className="form-label">Organization</label>
                        <input
                            type="text"
                            className="form-control"
                            id="organization"
                            name="organization"
                            value="ThemeSelection" />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-group input-group-merge">
                            <span className="input-group-text">US (+1)</span>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                className="form-control"
                                placeholder="202 555 0111" />
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address" name="address" placeholder="Address" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <InputField 
                        label="Nom"
                        name="nom"  
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <InputField 
                        label="Nom"
                        name="nom"  
                      />
                    </div> 
                </div>
            </div>
          </div>
        </div> */}

      </div>
    </>
  );
}

export default Composant;
