// CollapsibleTable.jsx - composant modifié pour prendre en charge plusieurs niveaux de collapse et les actions
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PaginationComponent from '../ui-table/PaginationComponent';

function Row(props) {
  const { 
    row, 
    columns, 
    detailTables, 
    arrowPosition, 
    isOpen, 
    onToggle, 
    isHighlighted,
    showActionsColumn,
    showDeleteIcon,
    onEdit,
    onDelete
  } = props;
  
  const [open, setOpen] = useState(isOpen);
  const hasDetails = detailTables && detailTables.length > 0;

  // Mettre à jour l'état "open" lorsqu'il y a un changement dans "isOpen"
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    if (onToggle) {
      onToggle(row.id, newOpenState);
    }
  };

  // Styles pour la mise en évidence
  const highlightStyle = isHighlighted ? { backgroundColor: '#f0f7ff' } : {};

  return (
    <React.Fragment>
      <TableRow sx={{ 
        '& > *': { borderBottom: 'none !important' },
        ...highlightStyle,
        transition: 'background-color 0.3s ease',
      }}>
        {arrowPosition === 'left' && (
          <TableCell sx={{ width: '30px' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleToggle}
              disabled={!hasDetails}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell key={column.field} align={column.align || 'left'}>
            {column.render ? column.render(row) : row[column.field]}
          </TableCell>
        ))}
        {arrowPosition === 'right' && (
          <TableCell sx={{ width: '30px' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleToggle}
              disabled={!hasDetails}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {showActionsColumn && (
          <TableCell align="right" sx={{ width: '120px' }}>
            <IconButton onClick={() => onEdit && onEdit(row)} size="small">
              <EditIcon />
            </IconButton>
            {showDeleteIcon && (
              <IconButton onClick={() => onDelete && onDelete(row)} size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </TableCell>
        )}
      </TableRow>
      <TableRow sx={{ '& > *': { borderBottom: '1px dashed #e0e0e0 !important' } }}>
        <TableCell 
          style={{ paddingBottom: 0, paddingTop: 0 }} 
          colSpan={columns.length + (arrowPosition ? 1 : 0) + (showActionsColumn ? 1 : 0)}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ my: 2, px: 2 }}>
              {detailTables && detailTables.map((detailTable, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: index < detailTables.length - 1 ? 3 : 0,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "solid 1px rgba(145, 158, 171, 0.16)",
                    overflow: "hidden"
                  }}
                >
                  <Typography className='p-3 fw-bolder' variant="subtitle2" component="div">
                    {detailTable.title}
                  </Typography>
                  <Table size="small" aria-label={`detail-table-${index}`}>
                    <TableHead>
                      <TableRow>
                        {detailTable.columns.map((column) => (
                          <TableCell
                            key={column.field}
                            align={column.align || 'left'}
                            sx={{
                              backgroundColor: '#F4F6F8',
                              color: '#637381',
                            }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailTable.data && detailTable.data.length > 0 ? (
                        detailTable.data.map((detailRow, idx) => (
                          <TableRow key={`${row.id}-${index}-${idx}`}>
                            {detailTable.columns.map((column) => (
                              <TableCell
                                key={column.field}
                                align={column.align || 'left'}
                                sx={{ borderBottom: '1px dashed #e0e0e0' }}
                              >
                                {column.render ? column.render(detailRow) : detailRow[column.field]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={detailTable.columns.length} align="center">
                            Aucune donnée disponible
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  detailTables: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      columns: PropTypes.array.isRequired,
      data: PropTypes.array.isRequired,
    })
  ).isRequired,
  arrowPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  isHighlighted: PropTypes.bool,
  showActionsColumn: PropTypes.bool,
  showDeleteIcon: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default function CollapsibleTable({ 
  columns, 
  rows, 
  detailTables, 
  arrowPosition = 'left', 
  expandedRows = {},
  accordion = false,
  highlightSelected = true,
  // highlightColor = '#f0f7ff',
  showActionsColumn = true, // Nouveau paramètre pour afficher la colonne d'actions
  showDeleteIcon = true,    // Nouveau paramètre pour afficher l'icône de suppression
  onEdit,                   // Callback pour l'édition
  onDelete,                 // Callback pour la suppression
}) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(1);
  const [openRowId, setOpenRowId] = useState(null);
  const rowsPerPage = 5;

  const count = Math.ceil(rows.length / rowsPerPage);

  // Initialiser l'état des lignes ouvertes à partir des expandedRows
  useEffect(() => {
    if (Object.keys(expandedRows).length > 0) {
      // Si mode accordion, ne garder que la dernière ligne ouverte
      if (accordion) {
        const openRows = Object.entries(expandedRows).filter(([, isOpen]) => isOpen);
        if (openRows.length > 0) {
          const lastOpenRowId = openRows[openRows.length - 1][0];
          setOpenRowId(parseInt(lastOpenRowId, 10));
        }
      }
    }
  }, [expandedRows, accordion]);

  const handleRequestSort = (property) => {
    const column = columns.find(col => col.field === property);
    const sortProperty = column.sortBy || column.field; 
    const isAsc = orderBy === sortProperty && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(sortProperty);
  };

  const sortedRows = (rows, order, orderBy) => {
    if (!orderBy) return rows;
    
    return rows.sort((a, b) => {
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((prev, curr) => {
          return prev ? prev[curr] : undefined;
        }, obj);
      };

      const valueA = getNestedValue(a, orderBy);
      const valueB = getNestedValue(b, orderBy);

      if (valueA === undefined || valueB === undefined) return 0;

      if (order === 'asc') {
        if (valueA > valueB) return 1;
        if (valueA < valueB) return -1;
      } else {
        if (valueA < valueB) return 1;
        if (valueA > valueB) return -1;
      }

      return a.id - b.id; 
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedRows = sortedRows(rows, order, orderBy).slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Fonction pour obtenir les détails de tables pour chaque ligne
  const getRowDetailTables = (row) => {
    if (!detailTables) return [];
    
    return detailTables.map(table => ({
      ...table,
      data: typeof table.getData === 'function' ? table.getData(row) : []
    }));
  };

  // Gestionnaire pour le toggle d'une ligne
  const handleRowToggle = (rowId, isOpen) => {
    if (accordion && isOpen) {
      // En mode accordion, on ferme toutes les autres lignes
      setOpenRowId(rowId);
    } else if (accordion && !isOpen && openRowId === rowId) {
      // Si on ferme la ligne actuellement ouverte
      setOpenRowId(null);
    }
  };

  // Détermine si une ligne est ouverte ou non
  const isRowOpen = (rowId) => {
    if (accordion) {
      return openRowId === rowId;
    } else {
      return expandedRows[rowId] || false;
    }
  };

  // Détermine si une ligne doit être mise en évidence
  const isRowHighlighted = (rowId) => {
    return highlightSelected && isRowOpen(rowId);
  };

  return (
    <Box sx={{border:'1px solid rgba(224, 224, 224, .9)', borderRadius:'16px', overflow:'hidden'}}>
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {arrowPosition === 'left' && <TableCell />}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sortDirection={orderBy === (column.sortBy || column.field) ? order : false}
                  sx={{
                    backgroundColor: '#F4F6F8',
                    color: '#637381',
                    fontWeight: 'lighter',
                  }}
                >
                  <TableSortLabel
                    active={orderBy === (column.sortBy || column.field)}
                    direction={orderBy === (column.sortBy || column.field) ? order : 'asc'}
                    onClick={() => handleRequestSort(column.field)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              {arrowPosition === 'right' && <TableCell />}
              {showActionsColumn && (
                <TableCell 
                  align="right" 
                  sx={{
                    backgroundColor: '#F4F6F8',
                    color: '#637381',
                    fontWeight: 'lighter',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row) => (
              <Row 
                key={row.id} 
                row={row} 
                columns={columns} 
                detailTables={getRowDetailTables(row)}
                arrowPosition={arrowPosition}
                isOpen={isRowOpen(row.id)}
                onToggle={handleRowToggle}
                isHighlighted={isRowHighlighted(row.id)}
                showActionsColumn={showActionsColumn}
                showDeleteIcon={showDeleteIcon}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationComponent
        count={count}
        page={page}
        onChange={handleChangePage}
      />
    </Box>
  );
}

CollapsibleTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      align: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailTables: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          field: PropTypes.string.isRequired,
          align: PropTypes.string,
          render: PropTypes.func,
        })
      ).isRequired,
      getData: PropTypes.func.isRequired,
    })
  ).isRequired,
  arrowPosition: PropTypes.oneOf(['left', 'right']),
  expandedRows: PropTypes.object,
  accordion: PropTypes.bool,
  highlightSelected: PropTypes.bool,
  highlightColor: PropTypes.string,
  showActionsColumn: PropTypes.bool,
  showDeleteIcon: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};