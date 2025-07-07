import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Fade,
} from '@mui/material';
import SearchInput from '../ui/SearchInput';
import SearchOffIcon from '@mui/icons-material/SearchOff';

function FilterBar({
  label,
  filterOptions,
  selectedFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  data,
  tabIndex,
  statuses,
  onFilteredData,
  filterCriteria,
  multiple = false,
  showSearch = true,
  showFilter = true,
  tableTitle = '',
  getDetailData,
  detailColumns,
  onExpandedRowsChange, 
  children,
}) {
  const [,setFilteredData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [, setRowsToExpand] = useState({});

  const matchesSearch = useCallback((value, searchTerms) => {
    if (!value) return false;
    return searchTerms.every(term =>
      value.toString().toLowerCase().includes(term.toLowerCase().trim())
    );
  }, []);

  const getNestedValue = useCallback((obj, keyPath) => {
    return keyPath.split('.').reduce((acc, key) => {
      if (!acc) return null;
      // Si c'est un tableau, recherche dans chaque élément
      if (Array.isArray(acc)) {
        return acc.map(item => getNestedValue(item, key)).filter(Boolean);
      }
      return acc[key];
    }, obj);
  }, []);

  const objectContainsSearch = useCallback((obj, searchTerms, fields) => {
    return fields.some(field => {
      const value = getNestedValue(obj, field);
      if (Array.isArray(value)) {
        // Si c'est un tableau, vérifie chaque élément
        return value.some(v => {
          if (typeof v === 'object' && v !== null) {
            return Object.values(v).some(subV => matchesSearch(subV, searchTerms));
          }
          return matchesSearch(v, searchTerms);
        });
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => matchesSearch(v, searchTerms));
      }
      return matchesSearch(value, searchTerms);
    });
  }, [getNestedValue, matchesSearch]);

  const detailsContainSearch = useCallback((item, searchTerms) => {
    if (!item.centres_desservis) return false;
    
    // Recherche directement dans les données brutes des centres
    return item.centres_desservis.some(centre => 
      // Vérifie la description
      matchesSearch(centre.description, searchTerms) ||
      // Vérifie les autres champs du centre si nécessaire
      matchesSearch(centre.detail.nom, searchTerms) ||
      matchesSearch(centre.detail.localisation, searchTerms)
    );
  }, [matchesSearch]);

  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('Expected data to be an array, but received:', data);
      return;
    }
   
    const searchTerms = searchQuery
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0);
  
    const statusKey = statuses ? Object.keys(statuses)[tabIndex - 1] : null;
    const newRowsToExpand = {};
  
    const result = data
      .filter(item => {
        const itemStatus = item.status || '';
        return !statuses || tabIndex === 0 || itemStatus === statusKey;
      })
      .filter(item => {
        const filterValue = item[filterCriteria.filterBy] || '';
        if (multiple && Array.isArray(selectedFilter)) {
          return selectedFilter.every(filter => filterValue.includes(filter));
        }
        return !selectedFilter || filterValue.includes(selectedFilter);
      })
      .filter(item => {
        if (searchTerms.length === 0) return true;

        const mainFieldsMatch = objectContainsSearch(item, searchTerms, filterCriteria.searchFields);
        const detailsMatch = detailsContainSearch(item, searchTerms);
  
        if (detailsMatch) {
          newRowsToExpand[item.id] = true;
        }
  
        return mainFieldsMatch || detailsMatch;
      });
  
    setRowsToExpand(newRowsToExpand);
    if (onExpandedRowsChange) {
      onExpandedRowsChange(newRowsToExpand);
    }
  
    setFilteredData(result);
    setTotalResults(result.length);
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
    getDetailData,
    detailColumns,
    onExpandedRowsChange,
    objectContainsSearch,
    detailsContainSearch,
  ]);

  const hasFilterOrSearch = searchQuery.trim() !== '' || (multiple ? selectedFilter.length > 0 : selectedFilter);

  return (
    <Box>
      <Box display="flex" className="w-100" justifyContent="space-between" alignItems="center" p={3} py={2}>
        {tableTitle && (
          <Typography sx={{ fontSize: '1.125rem' }} className='text-dark'>
            {tableTitle}
          </Typography>
        )}
        {showFilter && (
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
        )}
        {showSearch && (
          <SearchInput
            className={tableTitle ? "d-flex align-items-end" : ""}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        )} 
        {children && (
            <Box display="flex" alignItems="center" ml={2}>
              {children}
            </Box>
          )}
      </Box>

      {(showSearch || showFilter) && hasFilterOrSearch && (
        <Fade in={true} timeout={300}>
          <Typography variant="body2" sx={{ padding: 2 }}>
            <span className='fw-bold text-dark'>{totalResults}</span> ligne{totalResults !== 1 ? 's' : ''} trouvé{totalResults !== 1  ? 's' : ''}
          </Typography>
        </Fade>
      )}
      {(showSearch || showFilter) && totalResults === 0 && (
        <Fade in={true} timeout={300}>
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
        </Fade>
      )}
    </Box>
  );
}

export default FilterBar;