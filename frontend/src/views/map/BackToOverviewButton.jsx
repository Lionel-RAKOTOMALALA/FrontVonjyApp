import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomButton from '../../components/ui/CustomButton';

function BackToOverviewButton({ onClick }) {
  return (
<Box sx={{ display: 'flex', justifyContent: 'flex-start',mx:2 }}>
  <CustomButton 
    color="secondary"
    variant="outlined" 
    onClick={onClick}
    sx={{ 
      borderRadius: 50,
      minWidth: '40px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',zIndex:5010
    }}
  >
    <ArrowBackIcon />
  </CustomButton>  
</Box>

  );
}

BackToOverviewButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default BackToOverviewButton;