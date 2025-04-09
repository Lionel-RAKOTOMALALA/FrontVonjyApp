import React, { useState } from 'react';
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
import PaginationComponent from '../ui-table/PaginationComponent';

function Row(props) {
  const { row, columns, getDetailData, detailColumns, detailTitle, arrowPosition, isOpen } = props;
  const [open, setOpen] = useState(isOpen); // Initialiser avec l'état passé en props

  const hasDetails = getDetailData(row).length > 0;

  // Mettre à jour l'état "open" lorsqu'il y a un changement dans "isOpen"
  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'none !important' } }}>
        {arrowPosition === 'left' && (
          <TableCell sx={{ width: '30px' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
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
              onClick={() => setOpen(!open)}
              disabled={!hasDetails}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <TableRow sx={{ '& > *': { borderBottom: '1px dashed #e0e0e0 !important' } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                paddingBottom: "16px",
                marginBottom: "16px",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                color: "#1C252E",
                border: "solid 1px rgba(145, 158, 171, 0.16)",
              }}
            >
              <Typography className='p-3 fw-bolder' variant="subtitle2" component="div">
                {detailTitle}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {detailColumns.map((column) => (
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
                  {getDetailData(row).length > 0 ? (
                    getDetailData(row).map((detailRow, index) => (
                      <TableRow key={`${row.id}-${index}`}>
                        {detailColumns.map((column) => (
                          <TableCell
                            key={column.field}
                            align={column.align || 'left'}
                            sx={{ borderBottom: '1px dashed #e0e0e0' }}
                          >
                            {detailRow[column.field]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={detailColumns.length} align="center">
                        Aucun pour le moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
  getDetailData: PropTypes.func.isRequired,
  detailColumns: PropTypes.array.isRequired,
  detailTitle: PropTypes.string.isRequired,
  arrowPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  isOpen: PropTypes.bool, // Ajouter la nouvelle prop pour savoir si la ligne est ouverte
};
 

export default function CollapsibleTable({ columns, rows, getDetailData, detailColumns, detailTitle, arrowPosition, expandedRows ={} }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const count = Math.ceil(rows.length / rowsPerPage);

  const handleRequestSort = (property) => {
    const column = columns.find(col => col.field === property);
    const sortProperty = column.sortBy || column.field; 
    const isAsc = orderBy === sortProperty && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(sortProperty);
  };

  const sortedRows = (rows, order, orderBy) => {
    return rows.sort((a, b) => {
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((value, key) => value[key], obj);
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
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row) => (
              <Row 
                key={row.id} 
                row={row} 
                columns={columns} 
                getDetailData={getDetailData} 
                detailColumns={detailColumns} 
                detailTitle={detailTitle} 
                arrowPosition={arrowPosition}
                isOpen={expandedRows[row.id] || false} // Passer l'état d'expansion ici
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
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  getDetailData: PropTypes.func.isRequired,
  detailColumns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      align: PropTypes.string,
    })
  ).isRequired,
  detailTitle: PropTypes.string.isRequired,
  arrowPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  expandedRows: PropTypes.object, // Ajouter une prop pour les lignes étendues
};

 