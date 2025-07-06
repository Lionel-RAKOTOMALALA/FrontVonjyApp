import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function ConfirmationDialog({ open, onClose, onConfirm, title, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose} 
      sx={{ 
        "& .MuiPaper-root": { 
          borderRadius: "16px" ,
          width: "450px", 
          maxWidth: "80%",
        } 
      }}
    >
      <DialogTitle className='pt-4 px-4 fw-bold fs-5'>{title}</DialogTitle>
      <DialogContent className="p-0 px-4">
        <DialogContentText className='fs-6'>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions className='p-4'>

        <Button
            onClick={onConfirm}
            variant="contained"  
            sx={{
                bgcolor: "#FF5630",
                textTransform:"none",
                fontSize:"0.875rem",
                borderRadius:"8px",
                fontWeight:"700",
                boxShadow:"none",
                "&:hover":{boxShadow:"none",bgcolor:"#B71D18"}
            }} 
        > 
        Confirmer
        </Button> 
        <Button
            onClick={onClose} 
            variant="outlined"  
            sx={{
                bgcolor: "transparent",
                textTransform:"none",
                fontSize:"0.875rem",
                borderRadius:"8px",
                fontWeight:"700",
                color:'#1C252E',
                borderColor:"rgba(145, 158, 171, 0.35)",
                "&:hover":{bgcolor:"rgba(145 158 171 / 0.08)",borderColor:"rgba(145, 158, 171, 0.35)"}
            }} 
        > 
        Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
