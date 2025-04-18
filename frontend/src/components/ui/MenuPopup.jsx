"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Custom button styles
const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  backgroundColor: '#fff',
  color: '#333',
  border: '1px solid rgba(145, 158, 171, 0.24)',
  padding: '6px 16px',
  fontSize: '14px',
  fontWeight: '500', 
  display: 'flex',
  justifyContent: 'space-between',
  '&:hover': {
    border: '1px solid rgba(145, 158, 171, 0.24)',
    backgroundColor: '#F9FAFB', 
  },
}));

// Custom styles for the Menu
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '10px',
    boxShadow: 'rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px;', 
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    overflow: 'visible',  
    position: 'relative',
    maxWidth: '200px', 
  },
}));

export default function MenuPopup({ buttonLabel, menuItems, selectedItemId, onSelect }) {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <StyledButton
              variant="outlined"
              {...bindTrigger(popupState)}
            >
              {buttonLabel} 
            </StyledButton>
          </Box>
          <StyledMenu
            {...bindMenu(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {menuItems.map((item) => (
              <MenuItem
                className='mx-2 my-1'
                sx={{borderRadius: '10px'}}
                key={item.id}
                selected={item.id === selectedItemId}
                onClick={() => {
                  onSelect(item.id);
                  popupState.close();
                }} 
              >
                {item.name}
              </MenuItem>
            ))}
          </StyledMenu>
        </React.Fragment>
      )}
    </PopupState>
  );
}