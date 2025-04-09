// File: snackbar.jsx
import React, { useState } from 'react';
import SnackbarAlert from '../../components/ui/SnackbarAlert';
import AlertBox from '../../components/ui/AlertBox';
import CustomButton from '../../components/ui/CustomButton';

function Snackbar() {
  const [open, setOpen] = useState(false);
  const [snackConfig, setSnackConfig] = useState({
    severity: 'success',
    message: '',
    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  });

  const showSnackbar = (severity, message, anchorOrigin) => {
    setSnackConfig({ severity, message, anchorOrigin });
    setOpen(true);
  };

  const staticAlerts = [
    { severity: 'success', message: 'Ceci est une alerte succès' },
    { severity: 'error', message: 'Ceci est une alerte erreur' },
    { severity: 'warning', message: 'Ceci est une alerte avertissement' },
    { severity: 'info', message: 'Ceci est une alerte information' },
  ];

  return (
    <>
      <h5 className="card-header">Snackbar & Alert</h5>
      <div className="card-body pt-0">
        <div className="row">
          <div className="mb-3 col-md-6">
            <div className='d-flex justify-content-center'>
              <AlertBox alerts={staticAlerts} />
            </div>
          </div>

          <div className="mb-3 col-md-6">
            <div className="gap-2 mt-2">
              <CustomButton
                size="large"
                color="error"
                onClick={() =>
                  showSnackbar('error', 'Merde !', {
                    vertical: 'top',
                    horizontal: 'center',
                  })
                }
              >
                Snackbar Success
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      <SnackbarAlert
        open={open}
        setOpen={setOpen}
        severity={snackConfig.severity}
        message={snackConfig.message}
        anchorOrigin={snackConfig.anchorOrigin}
      />
    </>
  );
}

export default Snackbar;
