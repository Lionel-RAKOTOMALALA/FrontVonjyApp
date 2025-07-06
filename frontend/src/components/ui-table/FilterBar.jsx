import { useEffect, useState } from 'react';
import {
    Box,
    Select,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
} from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

function FilterBar({
    label,
    filterOptions,
    selectedFilter,
    onFilterChange,
    searchQuery,
    data,
    tabIndex,
    statuses,
    onFilteredData,
    filterCriteria,
    multiple = false,
}) {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const result = data
            .filter(
                (item) =>
                    tabIndex === 0 || item.status === Object.keys(statuses)[tabIndex - 1]
            )
            .filter((item) => {
                if (multiple && Array.isArray(selectedFilter)) {
                    return selectedFilter.every((filter) =>
                        item[filterCriteria.filterBy].includes(filter)
                    );
                }
                return !selectedFilter || item[filterCriteria.filterBy].includes(selectedFilter);
            })
            .filter((item) => {
                return filterCriteria.searchFields.some((field) =>
                    item[field]
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            });

        setFilteredData(result);
        onFilteredData(result);
    }, [
        data,
        tabIndex,
        selectedFilter,
        searchQuery,
        statuses,
        filterCriteria,
        onFilteredData,
        multiple,
    ]);

    return (
        <Box>
            <Box display="flex" alignItems="center" p={3}>
                <FormControl sx={{ m: 1, minWidth: 160 }}>
                    <InputLabel
                    sx={{
                        '&.Mui-focused': {
                        color: '#1C252E',
                        fontWeight: '600',
                        },
                    }}
                    id="demo-simple-select-autowidth-label"
                    >
                    {label}
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={multiple ? selectedFilter : selectedFilter || ''}
                        onChange={(e) => onFilterChange(multiple ? e.target.value : e.target.value)}
                        label={label}
                        multiple={multiple}
                        renderValue={(selected) =>
                            multiple ? selected.join(', ') : selected
                        }
                        sx={{
                            minWidth: 160,
                            marginRight: 2,
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
                    >
                    <MenuItem value="">
                        <em className="text-secondary">Tous</em>
                    </MenuItem>
                    {filterOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {multiple && (
                            <Checkbox
                            checked={selectedFilter.indexOf(option.value) > -1}
                            />
                        )}
                        <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Box>
            {filteredData.length === 0 && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="300px"
                    sx={{
                        m: 3,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        marginTop: 2,
                    }}
                >
                    <SearchOffIcon sx={{ fontSize: 60, color: '#c4c4c4' }} />
                    <Typography
                        variant="h6"
                        sx={{ marginTop: 2, color: '#c4c4c4' }}
                    >
                        Aucun résultat
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default FilterBar;
