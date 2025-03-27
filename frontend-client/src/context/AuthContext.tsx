import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

interface AuthContextType {
    user: any;
    access_token: string | null;
    refresh_token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    logout: () => void;
    register: (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, company_name: string, dob: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    registerBusiness: (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, dob: string, company_name: string, company_address: string, company_description: string, company_postcode: string, company_number: string, company_type: string, company_logo: File, subcategories: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    fetchUserDetails: () => Promise<any>;
    deleteUser: () => Promise<{ success: boolean; error?: any }>;
    changePassword: (current_password: string, new_password: string) => Promise<{ success: boolean; error?: any }>;
    updateUser: (userData: any) => Promise<{ success: boolean; data?: any; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [access_token, setAccessToken] = useState(localStorage.getItem("access_token") || "");
    const [refresh_token, setRefreshToken] = useState(localStorage.getItem("refresh_token") || "");

    const login = async (email: string, password: string) => {
        try {
            const response = await axiosInstance.post('/api/users/token/', { email, password });
            const { refresh, access, user_id, user_type } = response.data as { refresh: string, access: string, user_id: any, user_type: string };
            setAccessToken(access);
            setRefreshToken(refresh);
            const user = { user_id, user_type };
            setUser(user);
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_type', user_type);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken("");
        setRefreshToken("");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');
    };

    const register = async (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, company_name: string, dob: string, password: string) => {
        try {
            const response = await axiosInstance.post('/api/users/clients/', { first_name, last_name, email, number, address, postcode, company_name, dob, password });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    const registerBusiness = async (
        first_name: string,
        last_name: string,
        email: string,
        number: string,
        address: string,
        postcode: string,
        company_name: string,
        dob: string,
        company_address: string,
        company_description: string,
        company_postcode: string,
        company_number: string,
        company_type: string,
        company_logo: File,
        subcategories: string,
        password: string
    ) => {
        try {
            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('email', email);
            formData.append('number', number);
            formData.append('address', address);
            formData.append('postcode', postcode);
            formData.append('company_name', company_name);
            formData.append('dob', dob);
            formData.append('company_address', company_address);
            formData.append('company_description', company_description);
            formData.append('company_postcode', company_postcode);
            formData.append('company_number', company_number);
            formData.append('company_type', company_type);
            formData.append('company_logo', company_logo);
            formData.append('subcategories', subcategories);
            formData.append('password', password);
    
            const response = await axiosInstance.post('/api/users/suppliers/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    const changePassword = async (current_password: string, new_password: string) => {
        try {
            const response = await axiosInstance.post('/api/users/user/change-password/', { current_password, new_password });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await axiosInstance.get('/api/users/user/');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || "Failed to fetch user details" };
        }
    };

    const updateUser = async (userData: any) => {
        try {
            const response = await axiosInstance.put('/api/users/user/update/', userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    const deleteUser = async () => {
        try {
            await axiosInstance.delete('/api/users/user/delete/');
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.detail };
        }
    };

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            // Optionally, fetch user data using the stored token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, access_token, refresh_token, login, logout, register, registerBusiness, fetchUserDetails, deleteUser, changePassword, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
