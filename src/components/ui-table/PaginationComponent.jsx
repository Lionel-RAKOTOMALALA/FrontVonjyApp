import React from 'react';
import { Box, Pagination } from '@mui/material';

function PaginationComponent({ count, page, onChange }) {
  return (
    <Box display="flex" justifyContent="end" p={2}>
    <Pagination
      count={count}
      page={page}
      onChange={onChange}  
      shape="rounded" 
    />
  </Box>
  );
}

export default PaginationComponent;
