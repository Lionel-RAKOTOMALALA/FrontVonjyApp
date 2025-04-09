// composant.js
import React from 'react';
import ButtonPage from './button'
import InputPage from './input'
import SnackBarPage from './snackbar'
import TablePage from './table'
import TypographyPage from './typography'

function Index() {

  return (
    <>
      <div className="row"> 
        <div className="col-12">
          <div className="card mb-4">
            <ButtonPage/>
          </div>
        </div>
        <div className="col-12">
          <div className="card mb-4">
            <TypographyPage/>
          </div>
        </div>
        <div className="col-12">
          <div className="card mb-4">
            <InputPage/>
          </div>
        </div>
        <div className="col-12">
          <div className="card mb-4">
            <SnackBarPage/>
          </div>
        </div>
        <div className="col-12">
          <div className="card mb-4">
            <TablePage/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
