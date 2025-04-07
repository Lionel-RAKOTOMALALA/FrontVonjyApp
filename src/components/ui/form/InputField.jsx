import React from 'react';
import { TextField } from '@mui/material';

const InputField = ({ label, name, value, onChange, required = true, fullWidth = true, ...props }) => {
  return (
    <TextField
      required={required}
      label={label}
      name={name}
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      sx={{
        '& fieldset': {
        borderColor: 'rgba(145 158 171 / 0.2)',
        },
        '& .MuiFormLabel-root' : {
            color:'#919EAB !important',
        },
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
          fontWeight: 'inherit',
          color: '#637381',
          '&.Mui-focused': {
            fontWeight: 'bold',
            color: '#1C252E !important',
          },
        },
      }}
      {...props}
    />
  );
};

export default InputField;
