import { useState } from 'react';
import * as React from 'react';
import { CircularProgress, Button, Snackbar, Alert } from '@mui/material'; // Importation de Snackbar et Alert
import { login } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { AuthWrapper } from "../authentication/AuthWrapper";  
import IconButton from '@mui/material/IconButton'; 
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment'; 
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Nouvel état pour l'erreur
    const [open, setOpen] = useState(false); // État pour contrôler la visibilité du toast
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };
    const resetForm = () => {
        setUsername('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await login(username, password);
        setLoading(false);

        if (error) {
            setError(error);
            setOpen(true); // Affiche le toast d'erreur
        } else {
            navigate('/');
            resetForm();
        }
    };

    const handleClose = () => {
        setOpen(false); // Ferme le toast
    };

    return (
        <AuthWrapper> 
            <p className="mb-4">Please sign-in to your account and start the adventure</p> 
            <form id="formAuthentication" className="mb-3" onSubmit={handleLogin}>
                <div className="mb-3">
                
                <TextField
                    label="Username"
                    id="outlined-size-small"
                    autoFocus 
                    fullWidth
                    required
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px', 
                            '&:hover fieldset': {
                                borderColor: '#1C252E',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1C252E',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            '&.Mui-focused': {
                                fontWeight: 'bold',                        
                                color: '#1C252E',   
                            },
                        },
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                    
                    {/* <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="email"
                        placeholder="Enter your email or username"
                        autoFocus /> */}
                </div>  
                <div className="mb-3  mt-4"> 
                    
                    <div className="input-group input-group-merge">
                        <FormControl fullWidth  sx={{ 
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px', 
                                '&:hover fieldset': {
                                    borderColor: '#1C252E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1C252E',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                '&.Mui-focused': {
                                    fontWeight: 'bold',                             
                                    color: '#1C252E',   
                                },
                            },
                        }}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                placeholder='6+ characters'
                                fullWidth
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        {/* <input
                            type="password"
                            autoComplete="true"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            name="password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password" />
                        <span className="input-group-text cursor-pointer"></span> */}
                    </div>
                </div>
                <div className="mb-3 mt-4">
                    <Button
                        variant="contained" 
                        type="submit"
                        sx={{
                            bgcolor: "#1C252E",
                            textTransform:"none",
                            fontSize:"1rem",
                            borderRadius:"8px",
                            fontWeight:"800",
                            "&:hover":{bgcolor:"#454F5B"}
                        }}
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? '' : 'Sign in'}
                    </Button>
                </div>
            </form>
 
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </AuthWrapper>
    );
};

export default Login;
