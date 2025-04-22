import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create((set, get) => ({
    allUserData: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
        email: get().allUserData?.email || null,
        role: get().allUserData?.role || null,
        last_name: get().allUserData?.last_name || null,
        first_name: get().allUserData?.first_name || null,
    }),

    setAuthData: (data) => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        set({ 
            allUserData: data.user,
            accessToken: data.access,
            refreshToken: data.refresh
        });
    },

    clearAuthData: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({ 
            allUserData: null,
            accessToken: null,
            refreshToken: null
        });
    },

    setLoading: (loading) => set({ loading }),
    isLoggedIn: () => !!get().accessToken,
}));

if (import.meta.env.DEV) {
    mountStoreDevtool('Store', useAuthStore);
}

export { useAuthStore };