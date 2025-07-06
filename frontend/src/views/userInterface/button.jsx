import { CircularProgress } from '@mui/material';
import { Save, CheckCircle, WarningAmber, Info } from '@mui/icons-material';
import CustomButton from '../../components/ui/CustomButton';

function button() {
  return (
    <>
      <h5 className="card-header">Buttons</h5>

      {/* Primary */}
      <div className="card-body">
        <small className="text-light fw-medium">Primary</small>
        <div className="demo-inline-spacing">
          <CustomButton variant="contained" color="primary">
            Button
          </CustomButton>
          <CustomButton variant="outlined" color="primary">
            Button
          </CustomButton>
          <CustomButton variant="contained" color="primary" disabled>
            Button
          </CustomButton>
          <CustomButton variant="contained" color="primary" startIcon={<Save />}>
            With Icon
          </CustomButton>
          <CustomButton
            variant="contained"
            color="primary"
            startIcon={<CircularProgress size={18} color="inherit" />}
          >
            Loading...
          </CustomButton>
        </div>
      </div>

      <hr className="m-0" />

      {/* Secondary */}
      <div className="card-body">
        <small className="text-light fw-medium">Secondary</small>
        <div className="demo-inline-spacing">
          <CustomButton variant="contained" color="secondary">
            Button
          </CustomButton>
          <CustomButton variant="outlined" color="secondary">
            Button
          </CustomButton>
          <CustomButton variant="contained" color="secondary" disabled>
            Button
          </CustomButton>
          <CustomButton variant="contained" color="secondary" startIcon={<Info />}>
            With Icon
          </CustomButton>
          <CustomButton
            variant="contained"
            color="secondary"
            startIcon={<CircularProgress size={18} color="inherit" />}
          >
            Loading...
          </CustomButton>
        </div>
      </div>

      <hr className="m-0" />

      {/* Success */}
      <div className="card-body">
        <small className="text-light fw-medium">Success</small>
        <div className="demo-inline-spacing">
          <CustomButton variant="contained" color="success">
            Button
          </CustomButton>
          <CustomButton variant="outlined" color="success">
            Button
          </CustomButton>
          <CustomButton variant="contained" color="success" disabled>
            Button
          </CustomButton>
          <CustomButton variant="contained" color="success" startIcon={<CheckCircle />}>
            With Icon
          </CustomButton>
          <CustomButton
            variant="contained"
            color="success"
            startIcon={<CircularProgress size={18} color="inherit" />}
          >
            Loading...
          </CustomButton>
        </div>
      </div>

      <hr className="m-0" />

      {/* Warning */}
      <div className="card-body">
        <small className="text-light fw-medium">Warning</small>
        <div className="demo-inline-spacing">
          <CustomButton variant="contained" color="warning">
            Button
          </CustomButton>
          <CustomButton variant="outlined" color="warning">
            Button
          </CustomButton>
          <CustomButton variant="contained" color="warning" disabled>
            Button
          </CustomButton>
          <CustomButton variant="contained" color="warning" startIcon={<WarningAmber />}>
            With Icon
          </CustomButton>
          <CustomButton
            variant="contained"
            color="warning"
            startIcon={<CircularProgress size={18} color="inherit" />}
          >
            Loading...
          </CustomButton>
        </div>
      </div>
    </>
  );
}

export default button;
