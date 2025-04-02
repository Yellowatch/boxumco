import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

interface AuthContextType {
    user: any;
    access_token: string | null;
    refresh_token: string | null;
    login: (email: string, password: string) => Promise<{ 
        success: boolean; 
        data?: any; 
        error?: any; 
        mfaRequired?: boolean;
        temp_token?: string;
    }>;
    logout: () => void;
    register: (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, company_name: string, dob: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    registerBusiness: (first_name: string, last_name: string, email: string, number: string, address: string, postcode: string, dob: string, company_name: string, company_address: string, company_description: string, company_postcode: string, company_number: string, company_type: string, company_logo: File, subcategories: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    fetchUserDetails: () => Promise<any>;
    deleteUser: () => Promise<{ success: boolean; error?: any }>;
    changePassword: (current_password: string, new_password: string) => Promise<{ success: boolean; error?: any }>;
    updateUser: (userData: any) => Promise<{ success: boolean; data?: any; error?: any }>;
    checkIfClient: (email: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    verifyMfa: (tempToken: string, mfaCode: string) => Promise<{ success: boolean; error?: string }>;
    initiateMfaSetup: () => Promise<{ success: boolean; qrCode?: string; provisioningUri?: string; error?: string }>;
    confirmMfaSetup: (mfaCode: string) => Promise<{ success: boolean; error?: string }>;
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
            interface LoginResponse {
                refresh: string;
                access: string;
                user_id: number;
                user_type: string;
                temp_token?: string; // Optional property for MFA
            }
            const response = await axiosInstance.post<LoginResponse>('/api/users/token/login/', { email, password });
            // If MFA is required, the backend returns a 202 status with a temporary token
            if (response.status === 202) {
                // You can store the temp_token in state or localStorage (if appropriate)
                // Then navigate to an MFA challenge page or render an MFA form component
                return { success: true, mfaRequired: true, temp_token: response.data.temp_token };
            } else {
                const { refresh, access, user_id, user_type } = response.data as LoginResponse;
                setAccessToken(access);
                setRefreshToken(refresh);
                const user = { user_id, user_type };
                setUser(user);
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user_type', user_type);
                return { success: true, data: response.data };
            }
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    const verifyMfa = async (tempToken: string, mfaCode: string) => {
        try {
            const response = await axiosInstance.post('/api/users/token/mfa/', {
                temp_token: tempToken,
                mfa_code: mfaCode,
            });
            const { refresh, access, user_id, user_type } = response.data as { refresh: string; access: string; user_id: number; user_type: string };
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_type', user_type);
            setAccessToken(access);
            setRefreshToken(refresh);
            setUser({ user_id, user_type });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: 'Invalid MFA code or token expired. Please try again.' };
        }
    };
    

    const checkIfClient = async (email: string) => {
        try {
            const response = await axiosInstance.get(`/api/users/check-if-client/${email}/`);
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

    const initiateMfaSetup = async () => {
        try {
            const response = await axiosInstance.get('/api/users/mfa/enable/');
            const { qr_code, provisioning_uri } = response.data as { qr_code: string; provisioning_uri: string };
            return { success: true, qrCode: qr_code, provisioningUri: provisioning_uri };
        } catch (error: any) {
            return { success: false, error: 'Failed to initiate MFA setup. Please try again.' };
        }
    };

    const confirmMfaSetup = async (mfaCode: string) => {
        try {
            await axiosInstance.post('/api/users/mfa/confirm/', { mfa_code: mfaCode });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: 'Invalid MFA code. Please try again.' };
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
        <AuthContext.Provider value={{ user, access_token, refresh_token, login, logout, register, registerBusiness, fetchUserDetails, deleteUser, changePassword, updateUser, checkIfClient, verifyMfa, initiateMfaSetup, confirmMfaSetup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
