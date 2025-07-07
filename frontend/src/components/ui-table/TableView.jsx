import { useState, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, IconButton,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PaginationComponent from './PaginationComponent';
import BpCheckbox from './BpCheckbox';

function TableView({ data, columns, rowsPerPage, onEdit, onDelete, showCheckboxes = true, showDeleteIcon = true, loading = false, showActionsColumn = true }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [searchQuery,] = useState('');
  const [, setIsTransitioning] = useState(false);

  // Référence pour le conteneur externe pour animation
  const containerRef = useRef(null);

  // Sorting and pagination handlers
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    // Déclencher l'animation
    setIsTransitioning(true);

    // Changer la page avec un léger délai pour permettre à l'animation de commencer
    setTimeout(() => {
      setPage(newPage - 1);

      // Fin de la transition après un court délai
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 50);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((item) => item.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxChange = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // Sorting and filtering
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const descendingComparator = (a, b, orderBy) => {
    let aValue = getNestedValue(a, orderBy);
    let bValue = getNestedValue(b, orderBy);

    // Conversion en string pour la comparaison si nécessaire
    if (typeof aValue === 'object' && aValue !== null) {
      aValue = JSON.stringify(aValue);
    }
    if (typeof bValue === 'object' && bValue !== null) {
      bValue = JSON.stringify(bValue);
    }

    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedData = data && data.length > 0 ? [...data].sort(getComparator(order, orderBy)) : [];

  const filteredData = sortedData.filter(item => {
    if (searchQuery && !item.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDeleteSelected = () => {
    onDelete(selected);
    setSelected([]);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Rendu du message "Aucun résultat"
  const renderEmptyState = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <Typography variant="body1" color="textSecondary">
        Aucun résultat trouvé
      </Typography>
    </Box>
  );

  // Rendu de l'indicateur de chargement
  const renderLoadingState = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box
      sx={{
        border: '1px solid rgba(224, 224, 224, .6)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'height 0.5s ease-in-out'
      }}
      ref={containerRef}
    >
      <TableContainer>
        {loading ? (
          renderLoadingState()
        ) : data.length === 0 ? (
          renderEmptyState()
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Header personnalisé pour les éléments sélectionnés */}
            {selected.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundColor: '#d5edf3',
                padding: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#078DEE',
                fontWeight: '600'
              }}>
                <div>
                  <BpCheckbox
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={selected.length === filteredData.length}
                    onChange={handleSelectAllClick}
                  />
                  <span>{selected.length} sélectionné(s)</span>
                </div>
                <IconButton sx={{ marginRight: '8px' }} onClick={handleDeleteSelected} color="error">
                  <DeleteIcon />
                </IconButton>
              </div>
            )}

            {/* Table */}
            <Table>
              <TableHead
                sx={{
                  backgroundColor: 'rgba(255, 255, 0, 0.08)',
                  position: 'relative',
                  zIndex: 0
                }}
              >
                <TableRow>
                  {showCheckboxes && (
                    <TableCell padding="checkbox" sx={{ color: '#637381', fontWeight: '800', borderBottom: '1px dashed #e0e0e0 !important' }}>
                      <BpCheckbox
                        indeterminate={selected.length > 0 && selected.length < filteredData.length}
                        checked={selected.length === filteredData.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sortDirection={orderBy === column.id ? order : false}
                      sx={{ color: '#637381', fontWeight: '800', borderBottom: '1px dashed #e0e0e0 !important' }}
                      className={column.id === 'prenom_responsable' || column.id === 'contact_responsable' || column.id === 'formation_acquise' || column.id === 'offre' || column.id === 'nombreMembre' || column.id === 'experience' || column.id === 'permis_conduire' ? 'text-center' : ''}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  {showActionsColumn && (
                    <TableCell className='text-end' sx={{ color: '#637381', fontWeight: '800' }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;
                  return (
                    <TableRow
                      key={row.id}
                      selected={isItemSelected}
                      style={{
                        backgroundColor: isItemSelected ? 'rgba(3, 81, 171, 0.04)' : 'inherit',
                      }}
                    >
                      {showCheckboxes && (
                        <TableCell sx={{ borderBottom: '1px dashed #e0e0e0 !important' }} padding="checkbox">
                          <BpCheckbox
                            checked={isItemSelected}
                            onChange={(event) => handleCheckboxChange(event, row.id)}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell sx={{ borderBottom: '1px dashed #e0e0e0 !important' }} key={column.id}>
                          {column.render ? column.render(row) : row[column.id]}
                        </TableCell>
                      ))}
                      {showActionsColumn && (
                        <TableCell align="right" sx={{ borderBottom: '1px dashed #e0e0e0 !important' }}>
                          <IconButton onClick={() => onEdit(row)}>
                            <EditIcon />
                          </IconButton>
                          {showDeleteIcon && (
                            <IconButton onClick={() => onDelete(row)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </TableContainer>
      {!loading && data.length > 0 && (
        <PaginationComponent
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page + 1}
          onChange={handleChangePage}
        />
      )}
    </Box>
  );
}

export default TableView;