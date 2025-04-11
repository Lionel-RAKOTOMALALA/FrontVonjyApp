import React from 'react' 
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function composant() {
  return (
    <>
      <div className="row">
        {/* Basic Buttons */}
        <div className="col-12">
            <div className="card mb-4">
                <h5 className="card-header">Basic Buttons</h5>
                <div className="card-body">
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: "#1C252E",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      borderRadius: "8px",
                      fontWeight: "700",
                      "&:hover": { bgcolor: "#454F5B" }
                    }} 
                  >
                    Créer
                  </Button>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default composant