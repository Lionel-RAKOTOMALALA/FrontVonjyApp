import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectField = ({ label, name, value, onChange, options, required = true, fullWidth = true, ...props }) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel
        required={required}
        sx={{
          fontWeight: 'inherit',
          color: '#919EAB',
          '&.Mui-focused': {
            fontWeight: 'bold',
            color: '#1C252E',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        sx={{ 
            borderRadius: '8px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1C252E',
            borderWidth: '1px',
            },
            '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(145, 158, 171, 0.16)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1C252E',
            borderWidth: '1px',
            },
        }}
        MenuProps={{
          PaperProps: {
          sx: {
              color: 'black',
              boxShadow: 'rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px',
              maxHeight: '240px',
              borderRadius: '10px',
              padding: '6px 8px',
              margin: '6px',
              color: '#1C252E',
              '& .MuiMenuItem-root': {
              '&.Mui-selected': {
                  borderRadius: '10px',
                  margin: '4px 0',
              },
              '&:hover': {
                  borderRadius: '10px',
              },
              },
          },
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
