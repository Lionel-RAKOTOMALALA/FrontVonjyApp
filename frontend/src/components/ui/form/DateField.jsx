import { FormControl, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DateField = ({ label, value, onChange, required = false, format = 'DD/MM/YYYY', ...props }) => {
  return (
    <FormControl fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            slotProps={{
            textField: {
                required: required,
            },
            }}
            label={label}
            value={value}
            onChange={onChange}
            format={format}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1C252E',
                      borderWidth: '1px',
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(145, 158, 171, 0.16)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1C252E',
                      borderWidth: '1px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 'inherit',
                    color: '#637381',
                    '&.Mui-focused': {
                      fontWeight: 'bold',
                      color: '#1C252E',
                    },
                  },
                  '& .MuiInputBase-root': {
                    width: '100%', 
                  },
                }}
            renderInput={(params) => (
            <TextField
                {...params}
                fullWidth
            />
            )}
            {...props}
        />
        </LocalizationProvider>
    </FormControl>
  );
};

export default DateField;
