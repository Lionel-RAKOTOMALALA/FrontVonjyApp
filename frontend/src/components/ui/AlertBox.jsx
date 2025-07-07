import React from 'react';
import { Box, Typography } from '@mui/material';

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

// Version modifiée qui accepte les enfants et des props individuelles
export default function AlertBox({ 
  severity = 'info', 
  children, 
  sx = {}, 
  // On garde aussi la compatibilité avec l'ancien mode
  alerts = [] 
}) {
  // Si on a des enfants, on crée une alerte unique
  const hasDirectChildren = React.Children.count(children) > 0;
  
  // Si nous avons des enfants directs, affichez-les comme une seule alerte
  if (hasDirectChildren) {
    return (
      <Box
        display="flex"
        alignItems="center"
        p={1.5}
        pl={2}
        borderRadius={2}
        sx={{
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)',
          bgcolor: 'background.paper',
          minWidth: '240px',
          padding: '9px 12px',
          height: '40px',
          borderRadius: '8px',
          ...sx
        }}
      >
        <Box mr={1.5}>
          <img src={iconMap[severity]} width={26} height={32} alt={severity} />
        </Box>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {children}
        </Typography>
      </Box>
    );
  }
  
  // Sinon, utilisez le mode tableau d'alertes original
  return (
    <Box display="flex" flexDirection="column" gap={2} sx={sx}>
      {alerts.map((alert, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          p={1.5}
          pl={2}
          borderRadius={2}
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
            <img src={iconMap[alert.severity]} width={26} height={26} alt={alert.severity} />
          </Box>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {alert.message}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}