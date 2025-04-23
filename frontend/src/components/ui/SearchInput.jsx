import React from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
// src/utils/searchUtils.js

export const countOccurrences = (data, searchQuery, searchFields) => {
    const lowerQuery = searchQuery.toLowerCase();
    return data.reduce((acc, item) => {
      return acc + searchFields.reduce((count, field) => {
        const fieldValue = getNestedValue(item, field) || '';
        const matches = fieldValue.toString().toLowerCase().match(new RegExp(lowerQuery, 'g'));
        return count + (matches ? matches.length : 0);
      }, 0);
    }, 0);
  };
  
  const getNestedValue = (obj, keyPath) => {
    return keyPath.split('.').reduce((acc, key) => acc && acc[key], obj);
  };
  
function SearchInput({ searchQuery, onSearchChange, className }) {
    return (
        <TextField
            variant="outlined"
            placeholder="Recherche..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: searchQuery && (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={() => onSearchChange('')}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            className={className}
            sx={{
                flexGrow: 1, 
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                    width: '200px',
                    borderRadius: '8px',
                    '&:hover fieldset': {
                        borderColor: '#1C252E',
                    },
                    '& fieldset': {
                        borderColor: 'rgba(145, 158, 171, 0.16)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#1C252E',
                        borderWidth: '1px',
                    },
                },
            }}
        />
    );
}

export default SearchInput;
