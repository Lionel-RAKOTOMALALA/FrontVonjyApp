// components/CustomButton.jsx
import React from 'react';
import { Button } from '@mui/material';

const colorPalette = {
  primary: {
    main: "#1677FF",
    hover: "#005ee2",
    contrastText: "#ffffff",
  },
  secondary: {
    main: " #595959",
    hover: "#3f3f3f",
    contrastText: "#ffffff",
  },
  success: {
    main: "#2E7D32",
    hover: "#1B5E20",
    contrastText: "#ffffff",
  },
  danger: {
    main: "#D32F2F",
    hover: "#B71C1C",
    contrastText: "#ffffff",
  },
};

const getButtonStyle = (variant, color) => {
  const c = colorPalette[color] || colorPalette["primary"];

  switch (variant) {
    case "contained":
      return {
        bgcolor: c.main,
        color: c.contrastText,
        "&:hover": {
          bgcolor: c.hover,
        },
      };
    case "outlined":
      return {
        border: `1px solid ${c.main}`,
        color: c.main,
        bgcolor: "transparent",
        "&:hover": {
          borderColor: c.hover,
          color: c.hover,
          bgcolor: "transparent",
        },
      };
    case "text":
      return {
        color: c.main,
        bgcolor: "transparent",
        "&:hover": {
          color: c.hover,
          bgcolor: "transparent",
        },
      };
    default:
      return {};
  }
};

const baseStyle = {
  textTransform: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  borderRadius: "8px",
  padding: "4px 26px",
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
      variant={variant === "contained" ? "contained" : "text"} // keep MUI happy
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
