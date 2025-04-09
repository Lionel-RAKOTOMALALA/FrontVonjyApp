import React, { useState } from 'react'
import CustomCheckbox from '../../components/ui/CustomCheckbox'
import BpCheckbox from '../../components/ui-table/BpCheckbox'

function checkbox() {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div className='d-flex align-items-center'>
      <BpCheckbox id="my-check" color="success" label="J'accepte les conditions" />

    </div>
  )
}

export default checkbox