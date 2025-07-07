import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomButton from '../../../../components/ui/CustomButton';

function BackToOverviewButton({ onClick }) {
  const handleBackToOverview = () => {
    // Scroll fluide en haut de page
    window.scrollTo({ top: 0, behavior: "smooth" });
    onClick();
  };
  
  return (
<Box sx={{ display: 'flex', justifyContent: 'flex-start',mx:2 }}>
  <CustomButton 
    color="secondary"
    variant="outlined" 
    onClick={handleBackToOverview}
    sx={{ 
      borderRadius: 50,
      minWidth: '40px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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