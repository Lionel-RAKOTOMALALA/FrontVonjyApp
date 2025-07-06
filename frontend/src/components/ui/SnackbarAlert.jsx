import Snackbar from '@mui/material/Snackbar';
import { Box, Typography } from '@mui/material';

// Import des icônes
import InfoSvg from '../../assets/icons/info.svg';
import ErrorSvg from '../../assets/icons/error.svg';
import SuccessSvg from '../../assets/icons/success.svg';
import WarningSvg from '../../assets/icons/warning.svg';
import LoadingSvg from '../../assets/icons/loading.svg';

const iconMap = {
  info: InfoSvg,
  error: ErrorSvg,
  success: SuccessSvg,
  warning: WarningSvg,
  loading: LoadingSvg,
};

export default function SnackbarAlert({ 
  open, 
  setOpen, 
  severity = 'success', 
  message = '', 
  duration = 3000, 
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' }
}) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={duration} 
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Box
        display="flex"
        alignItems="center"
        p={1.5}
        pl={2}
        borderRadius={2}
        onClick={handleClose}
        sx={{
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)',
          bgcolor: 'background.paper',
          minWidth: '240px',
          padding: '9px 12px',
          height: '40px',
          borderRadius: '8px'
        }}
      >
        <Box mr={1.5}>
          <img src={iconMap[severity]} width={26} height={26} alt={severity} />
        </Box>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {message}
        </Typography>
      </Box>
    </Snackbar>
  );
}