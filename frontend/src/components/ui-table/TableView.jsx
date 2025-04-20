import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, IconButton,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PaginationComponent from './PaginationComponent';
import BpCheckbox from './BpCheckbox';  // Importation du composant BpCheckbox

export function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
 
function TableView({ data, columns, statuses, rowsPerPage, onEdit, onDelete, showCheckboxes = true , showDeleteIcon = true }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  

  // Sorting and pagination handlers
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
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
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedData = [...data].sort(getComparator(order, orderBy));
  
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

  return (
    <Box sx={{border:'1px solid rgba(224, 224, 224, .6)', borderRadius:'16px', overflow:'hidden'}}>
      <TableContainer>
        <div style={{ position: 'relative' }}>
          {/* Header personnalisé pour les éléments sélectionnés */}
          {selected.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,  // Assure-toi que le header personnalisé est au-dessus
              backgroundColor: '#d5edf3',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center', 
              color: '#078DEE',
              fontWeight:'600'
            }}>
              <div>
              <BpCheckbox
                indeterminate={selected.length > 0 && selected.length < filteredData.length}
                checked={selected.length === filteredData.length}
                onChange={handleSelectAllClick}
              />
              <span>{selected.length} sélectionné(s)</span>
              </div>
              <IconButton sx={{marginRight:'8px'}} onClick={handleDeleteSelected} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          )}
  
          {/* Table */}
          <Table>
            {/* En-tête standard */}
            <TableHead
              sx={{
                backgroundColor: 'rgba(255, 255, 0, 0.08)',
                position: 'relative',  // Assure-toi que le header standard est en dessous
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
                    className={column.id === 'prenom_responsable' ||column.id === 'contact_responsable' || column.id === 'formation_acquise' || column.id === 'offre' ||column.id === 'nombreMembre' || column.id === 'experience' || column.id === 'permis_conduire' ? 'text-center' : ''}
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
                <TableCell className='text-end' sx={{ color: '#637381', fontWeight: '800' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
  
            {/* Corps du tableau */}
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
                      <TableCell sx={{borderBottom: '1px dashed #e0e0e0 !important'}} padding="checkbox">
                        <BpCheckbox
                          checked={isItemSelected}
                          onChange={(event) => handleCheckboxChange(event, row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell sx={{borderBottom: '1px dashed #e0e0e0 !important'}} key={column.id}>
                        {column.render ? column.render(row) : row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell align="right"  sx={{borderBottom: '1px dashed #e0e0e0 !important'}}>
                      <IconButton  onClick={() => onEdit(row)}>
                        <EditIcon />
                      </IconButton>
                      {showDeleteIcon && (
                        <IconButton onClick={() => onDelete(row)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
  
        </div>
      </TableContainer>      <PaginationComponent
        count={Math.ceil(filteredData.length / rowsPerPage)}
        page={page + 1}
        onChange={handleChangePage}
      />
    </Box>
  );
  
}

export default TableView;