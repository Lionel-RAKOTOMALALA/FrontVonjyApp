import { TextField } from '@mui/material';

const InputField = ({ label, name, value, onChange, required = true, fullWidth = true,sx = {}, ...rest }) => {

  const customSx = {
    '& fieldset': {
      borderColor: 'rgba(145 158 171 / 0.4)',
    },
    '& .MuiFormLabel-root': {
      color: '#919EAB !important',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': {
        borderColor: '#1C252E',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1C252E',
      },
      '&.Mui-error fieldset': {
        borderColor: '#f44336',
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 'inherit',
      color: '#637381',
      '&.Mui-focused': {
        fontWeight: 'bold',
        color: '#1C252E !important',
      },
      '&.Mui-error': {
        color: '#f44336 !important',
      },
    },
  };

  return (
    <TextField
      required={required}
      label={label}
      name={name}
      fullWidth={fullWidth}
      value={value}
      onChange={onChange} 
      sx={{ ...customSx, ...sx }}
      {...rest}
    />
  );
};

export default InputField;
