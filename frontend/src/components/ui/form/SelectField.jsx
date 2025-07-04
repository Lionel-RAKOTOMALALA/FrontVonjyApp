import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error,
  helperText,
  required = true, 
  fullWidth = true, 
  autocomplete = false, // Nouveau prop pour activer l'autocomplete
  error = false,
  helperText = '',
  ...props 
}) => {
  
  // Styles communs pour les labels
  const labelStyle = {
    fontWeight: 'inherit',
    color: '#919EAB',
    '&.Mui-focused': {
      fontWeight: 'bold',
      color: '#1C252E',
    },
  };
  
  // Styles communs pour les inputs
  const inputStyle = {
    borderRadius: '8px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1C252E',
      borderWidth: '1px',
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(145, 158, 171, 0.4)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1C252E',
      borderWidth: '1px',
    },
  };

  // Style commun pour les menus déroulants
  const menuStyle = {
    boxShadow: 'rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px',
    maxHeight: '240px',
    borderRadius: '10px',
    padding: '6px 8px',
    margin: '6px',
    color: '#1C252E',
    '& .MuiMenuItem-root': {
      '&.Mui-selected, &.Mui-focused': {
        backgroundColor: 'rgba(145, 158, 171, 0.08)',
        borderRadius: '10px',
        margin: '4px 0',
      },
      '&:hover': {
        backgroundColor: 'rgba(145, 158, 171, 0.08)',
        borderRadius: '10px',
      },
    },
    '& .MuiAutocomplete-option': {
      padding: '6px 16px',
      '&[aria-selected="true"]': {
        backgroundColor: 'rgba(145, 158, 171, 0.08)',
        borderRadius: '10px',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(145, 158, 171, 0.08)',
        borderRadius: '10px',
      },
      '&:hover': {
        backgroundColor: 'rgba(145, 158, 171, 0.08)',
        borderRadius: '10px',
      },
    },
  };

  // Si autocomplete est activé, on utilise le composant Autocomplete de MUI
  if (autocomplete) {
    return (
      <FormControl fullWidth={fullWidth} error={error}>
        <Autocomplete
        
          value={value ? options.find(option => option.value === value) || null : null}
          onChange={(event, newValue) => {
            onChange({
              target: {
                name,
                value: newValue ? newValue.value : ''
              }
            });
          }}
          options={options}
          getOptionLabel={(option) => option.label || ''}
          renderInput={(params) => (
            <TextField 
              {...params} 
              name={name}
              label={label}
              required={required}
              error={error}
              helperText={helperText}
              InputLabelProps={{
                sx: labelStyle
              }}
              sx={inputStyle}
            />
          )} 
          sx={{
            '& .MuiOutlinedInput-root': {
              ...inputStyle
            }
          }}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.value}>
              {option.label}
            </MenuItem>
          )}
          disablePortal
          {...props}
        />
      </FormControl>
    );
  }

  // Sinon on garde le Select d'origine
  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel
        required={required}
        sx={labelStyle}
      >
        {label}
      </InputLabel>
      <Select
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        sx={inputStyle}
        MenuProps={{
          PaperProps: {
            sx: menuStyle
          },
        }}
        error={error}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;