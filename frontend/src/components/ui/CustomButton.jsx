// components/CustomButton.jsx
import { Button } from '@mui/material';

const colorPalette = {
  primary: {
    main: "rgba(22, 119, 255, 0.90)",
    hover: "#1677FF",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "rgba(89, 89, 89,0.90)",
    hover: "rgba(89, 89, 89,1)",
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

const getShadowColor = (rgba, alpha = 0.4) => {
  return rgba.replace(/rgba?\(([^,]+),([^,]+),([^,]+)(?:,[^)]+)?\)/, `rgba($1,$2,$3,${alpha})`);
};

const getButtonStyle = (variant, color) => {
  const c = colorPalette[color] || colorPalette["primary"];

  // Custom style for secondary outlined
  if (variant === "outlined" && color === "secondary") {
    return {
      border: '1px solid',
      borderColor: 'rgba(145, 158, 171, 0.35)',
      color: '#1C252E',
      fontWeight: 700,
      textTransform: 'none',
      fontSize: '0.875rem',
      borderRadius: '8px',
      bgcolor: 'transparent',
      '&:hover': {
        bgcolor: 'rgba(145, 158, 171, 0.08)',
        borderColor: 'rgba(145, 158, 171, 0.35)',
      },
    };
  }

  // Custom style for warning outlined
  if (variant === "outlined" && color === "warning") {
    return {
      border: '1px solid rgba(254, 201, 31, 0.9)',
      color: '#ffab00',
      bgcolor: 'transparent',
      '&:hover': {
        borderColor: 'rgba(254, 201, 31, 1)',
        color: '#ffab00',
        bgcolor: 'rgba(254, 201, 31, 0.08)', // hover bg for visual feedback
      },
    };
  }

  // Default style for outlined with hover effect
  if (variant === "outlined") {
    return {
      border: `1px solid ${c.main}`,
      color: c.main,
      bgcolor: "transparent",
      "&:hover": {
        borderColor: c.hover,
        color: c.hover,
        bgcolor: `${c.main.replace(/[\d.]+\)$/g, '0.08)')}`, // soft background
      },
    };
  }

  if (variant === "contained") {
    const shadowColor = getShadowColor(c.main, 0.4);
    return {
      bgcolor: c.main,
      color: c.contrastText,
      boxShadow: 'none',
      "&:hover": {
        bgcolor: c.hover,
        boxShadow: `0px 4px 12px ${shadowColor}`,
      },
    };
  }
  
  

  // Text variant
  if (variant === "text") {
    return {
      color: c.main,
      bgcolor: "transparent",
      "&:hover": {
        color: c.hover,
        bgcolor: "transparent",
      },
    };
  }

  return {};
};

const baseStyle = {
  textTransform: "none",
  fontSize: "0.875rem",
  fontWeight: 600,
  borderRadius: "8px",
  padding: "6px 20px",
};

const CustomButton = ({
  children,
  sx = {},
  variant = "contained",
  color = "primary",
  ...props
}) => {
  const colorStyle = getButtonStyle(variant, color);

  return (
    <Button
      {...props}
      variant={variant === "contained" ? "contained" : "text"}
      sx={{
        ...baseStyle,
        ...colorStyle,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
