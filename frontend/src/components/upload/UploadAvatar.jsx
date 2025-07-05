import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { useDropzone } from 'react-dropzone';
// @mui
import { Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
//
import Image from './Image';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '20px',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`,
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '20px',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

UploadAvatar.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
  user: PropTypes.object,
};

export default function UploadAvatar({ error, file, helperText, sx, user, ...other }) {
  // Validation personnalisée des fichiers
  const validateFile = (file) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/webp', 'image/bmp', 'image/svg+xml'
    ];
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    
    // Vérifier le type MIME
    if (!allowedTypes.includes(file.type)) {
      return {
        code: 'file-invalid-type',
        message: `Le type de fichier ${file.type} n'est pas autorisé. Seules les images sont acceptées.`
      };
    }
    
    // Vérifier l'extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        code: 'file-invalid-extension',
        message: `L'extension ${fileExtension} n'est pas autorisée.`
      };
    }
    
    // Vérifier la taille (optionnel - 5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        code: 'file-too-large',
        message: 'Le fichier est trop volumineux (5MB maximum).'
      };
    }
    
    return null;
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    multiple: false,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
      'image/svg+xml': ['.svg'],
    },
    validator: validateFile, // Validation personnalisée
    // S'assurer que other n'écrase pas nos paramètres critiques
    ...other,
  });

  const userInitial = useMemo(
    () => user?.namefull?.charAt(0).toUpperCase() || "?",
    [user?.namefull]
  );

  return (
    <>
      <RootStyle
        sx={{
          ...((isDragReject || error) && {
            borderColor: 'error.light',
          }),
          ...sx,
          border: "1px dashed rgba(145, 158, 171, 0.20)",
        }}
      >
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
          }}
        >
          <input {...getInputProps()} />

          {file ? (
            <Image alt="avatar" src={isString(file) ? file : file.preview} sx={{ zIndex: 8 }} />
          ) : (
            <Avatar sx={{ width: 1, borderRadius: '20px', height: 1, bgcolor: "#fbc02d", zIndex: 8, fontSize: 48 }}>
              {userInitial}
            </Avatar>
          )}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: 'common.white',
                bgcolor: 'grey.900',
                '&:hover': { opacity: 0.72 },
              }),
              ...((isDragReject || error) && {
                bgcolor: 'error.lighter',
              }),
            }}
          >
            <Iconify icon={'ic:round-add-a-photo'} sx={{ width: 24, height: 24, mb: 1 }} />
            <Typography variant="caption">{file ? 'Met à jour l\'image' : 'Insérer une image'}</Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {helperText && helperText}
 
    </>
  );
}