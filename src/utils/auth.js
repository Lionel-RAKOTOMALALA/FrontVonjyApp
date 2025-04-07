import { useAuthStore } from '../store/auth';
import axios from './axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import apiInstance from './axios';

export const login = async (username, password) => {
    try {
        const { data, status } = await axios.post('token/', {
            username,
            password,
        });
        if (status === 200) {
            setAuthUser(data.access, data.refresh);
        }
        return { data, error: null };
    } catch (error) {
        if (error && error.response) {
            console.error('API Error:', error.response);
            return {
                data: null,
                error: error.response.data?.detail || 'An unexpected error occurred. Please try again later.',
            };
        } else {
            console.error('Unexpected Error:', error);
            return {
                data: null,
                error: 'An unknown error occurred. Please contact support.',
            };
        }
    }
};

export const register = async (username, password, password2) => {
    try {
        const { data } = await axios.post('register/', {
            username,
            password,
            password2,
        });
        await login(username, password);
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response.data || 'Something went wrong',
        };
    }
};

export const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    useAuthStore.getState().setUser(null);
};

export const checkAndRefreshToken = async () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
        return false;
    }

    const { isExpired, remainingTime } = isAccessTokenExpired(accessToken);

    if (isExpired) {
        try {
            const response = await getRefreshToken(refreshToken);
            setAuthUser(response.access, response.refresh);
            return true;
        } catch (error) {
            console.error('Failed to refresh token:', error.response?.data || error.message);
            return false;
        }
    } else {
        console.log(`Access token is valid. Remaining time: ${remainingTime} seconds`);
        setAuthUser(accessToken, refreshToken);
        return true;
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        expires: 1,
        secure: true,
    });

    Cookies.set('refresh_token', refresh_token, {
        expires: 7,
        secure: true,
    });

    const user = jwt_decode(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get('refresh_token');
    try {
        const response = await apiInstance.post('token/refresh/', {
            refresh: refresh_token,
        });
        console.log(refresh_token); 
        return response.data;
    } catch (error) {
        console.error('Failed to refresh token:', error.response?.data || error.message);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/auth/login'; // Redirect to login page
        return Promise.reject(error);
    }
};

export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        const remainingTime = decodedToken.exp - currentTime;

        if (remainingTime <= 0) {
            return { isExpired: true, remainingTime: 0 };
        } else {
            return { isExpired: false, remainingTime: Math.round(remainingTime) };
        }
    } catch (err) {
        console.log("Token is invalid or expired");
        return { isExpired: true, remainingTime: 0 };
    }
};

export const updateProfile = async (formData) => {
    try {
        // Assurez-vous que le token est valide ou tentez de le rafraîchir
        const isTokenValid = await checkAndRefreshToken();
        if (!isTokenValid) {
            throw new Error("Failed to refresh token");
        }

        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
            throw new Error("User is not authenticated");
        }

        const response = await axios.put('update/', formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const updatedUser = response.data;
        useAuthStore.getState().setUser(updatedUser);

        return { data: updatedUser, error: null };
    } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        return {
            data: null,
            error: error.response?.data || 'Failed to update profile',
        };
    }
};

export const getCurrentUser = async () => {
    try {
        // Assurez-vous que le token est valide ou tentez de le rafraîchir
        const isTokenValid = await checkAndRefreshToken();
        if (!isTokenValid) {
            throw new Error("Failed to refresh token");
        }

        const accessToken = Cookies.get('access_token');
        if (!accessToken) {
            throw new Error("User is not authenticated");
        }

        const response = await axios.get('user/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const user = response.data;
        useAuthStore.getState().setUser(user);

        return { data: user, error: null };
    } catch (error) {
        console.error('Error fetching current user:', error.response?.data || error.message);
        return {
            data: null,
            error: error.response?.data || 'Failed to fetch current user',
        };
    }
};
