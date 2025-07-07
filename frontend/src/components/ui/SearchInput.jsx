import {
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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