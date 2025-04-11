"use client"
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled } from "@mui/material"

// Radio stylisé
const StyledRadio = styled(Radio)(({ theme }) => ({
  "&.MuiRadio-root": {
    color: "rgba(0, 0, 0, 0.6)",
    padding: "4px 9px",
    "&.Mui-checked": {
      color: "#1C252E",
    },
  },
}))

// FormControlLabel stylisé
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginRight: 16,
  "& .MuiFormControlLabel-label": {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "14px",
    fontWeight: 400,
  },
}))

const RadioGroupField = ({
  label,
  name,
  value,
  onChange,
  options = [
    { value: "true", label: "Oui" },
    { value: "false", label: "Non" },
  ],
  required = false,
  row = true,
  ...rest
}) => {
  return (
    <FormControl required={required} fullWidth component="fieldset" variant="standard" {...rest}>
      <FormLabel
        component="legend"
        sx={{
          color: "rgba(0, 0, 0, 0.87) !important",
          fontWeight: 500,
          fontSize: "16px",
          marginBottom: "8px",
          "&.Mui-focused": {
            color: "#1C252E !important",
          },
        }}
      >
        {label}
      </FormLabel>
      <RadioGroup
        row={row}
        aria-labelledby={`${name}-label`}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <StyledFormControlLabel
            key={option.value}
            value={option.value}
            control={<StyledRadio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default RadioGroupField
