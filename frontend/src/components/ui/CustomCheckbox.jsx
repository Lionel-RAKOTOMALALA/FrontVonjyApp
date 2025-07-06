// ../../components/ui/CustomButton.js
import { Checkbox, FormControlLabel } from '@mui/material';

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  color = 'primary', // Par défaut, on choisit la couleur primaire
  size = 'medium', // Taille par défaut
  labelPlacement = 'end', // Par défaut, le label est placé à droite de la checkbox
  sx, // Pour permettre un style supplémentaire via 'sx'
  ...props
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color={color}
          size={size}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: 30, // Taille de l'icône de la checkbox
              ...(sx && sx), // Applique les styles passés via 'sx'
            },
          }}
          {...props}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& .MuiFormControlLabel-label': {
          fontWeight: 600, // Poids de la police pour le label
          fontSize: 16, // Taille du texte du label
          color: 'text.primary', // Couleur par défaut du texte
        },
        ...sx, // Applique les styles externes s'ils existent
      }}
    />
  );
};

export default CustomCheckbox;
