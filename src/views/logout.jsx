import { useEffect } from 'react';
import { Navigate } from "react-router-dom";  
import { logout } from '../utils/auth';

const Logout = () => {
    useEffect(() => {
        logout();
    }, []);
    return <Navigate to="/auth/login" />;
};

export default Logout;
