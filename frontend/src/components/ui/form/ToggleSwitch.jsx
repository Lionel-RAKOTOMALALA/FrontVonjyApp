import { FormControlLabel, Switch, styled } from "@mui/material"

// Styled Switch component to match the design in the image
const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#1C252E",
        opacity: 1,
      },
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.5,
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
    backgroundColor: "#E53935", // Red color for the thumb
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: "rgba(229, 57, 53, 0.2)", // Light red background
    opacity: 1,
  },
}))

const ToggleSwitch = ({ label, name, checked, onChange, disabled = false, labelPlacement = "end", ...rest }) => {
  return (
    <FormControlLabel
      control={
        <StyledSwitch
          checked={checked}
          onChange={onChange}
          name={name}
          disabled={disabled}
          sx={{
            "& .MuiFormControlLabel-label": {
              color: "#637381",
              fontWeight: "inherit",
            },
          }}
          {...rest}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      sx={{
        margin: 0,
        "& .MuiFormControlLabel-label": {
          color: "#637381",
          fontWeight: "inherit",
        },
      }}
    />
  )
}

export default ToggleSwitch
