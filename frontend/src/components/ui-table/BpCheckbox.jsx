import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

// Définition des couleurs du thème
const themeColors = {
  primary: {
    main: "rgba(22, 119, 255, 0.90)",
    hover: "#1677FF",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "rgba(89, 89, 89, 0.90)",
    hover: "rgba(89, 89, 89, 1)",
    contrastText: "#ffffff",
  },
  success: {
    main: "rgba(112, 255, 12, 0.90)",
    hover: "rgba(112, 255, 12, 1)",
    contrastText: "#ffffff",
  },
  warning: {
    main: "rgba(254, 201, 31, 0.9)",
    hover: "rgba(254, 201, 31, 1)",
    contrastText: "#000",
  },
  danger: {
    main: "#D32F2F",
    hover: "#B71C1C",
    contrastText: "#ffffff",
  },
};

// Styled components pour Checkbox
const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme, color }) => {
  const colorScheme = themeColors[color] || themeColors.primary;

  return {
    backgroundColor: colorScheme.main,
    boxShadow: 'none', // 🔥 Supprime la bordure (héritée de BpIcon)
    '&::before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z\' fill=\'%23fff\'/%3E%3C/svg%3E")',
      content: '""',
    },
    '&:hover': {
      backgroundColor: colorScheme.hover,
    },
  };
});

// BpCheckbox component avec couleur personnalisée
function BpCheckbox({ color = 'primary', id, label, ...rest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox
        id={id}
        sx={{ '&:hover': { bgcolor: 'transparent' } }}
        checkedIcon={<BpCheckedIcon color={color} />}
        icon={<BpIcon />}
        inputProps={{ 'aria-label': label }}
        {...rest}
      />
      {label && (
        <label htmlFor={id} style={{ cursor: 'pointer' }}>
          {label}
        </label>
      )}
    </div>
  );
}

export default BpCheckbox;
