import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

interface AuthContextType {
    user: any;
    access_token: string | null;
    refresh_token: string | null;
    login: (
        email: string,
        password: string
    ) => Promise<{
        success: boolean;
        data?: any;
        error?: any;
        mfaRequired?: boolean;
        temp_token?: string;
    }>;
    logout: () => void;
    register: (
        first_name: string,
        last_name: string,
        email: string,
        number: string,
        address: string,
        postcode: string,
        company_name: string,
        dob: string,
        password: string,
        confirm_password: string
    ) => Promise<{ success: boolean; data?: any; error?: any }>;
    registerBusiness: (
        first_name: string,
        last_name: string,
        email: string,
        number: string,
        address: string,
        postcode: string,
        dob: string,
        company_name: string,
        company_address: string,
        company_description: string,
        company_postcode: string,
        company_number: string,
        company_type: string,
        company_logo: File,
        subcategories: string,
        password: string,
        confirm_password: string
    ) => Promise<{ success: boolean; data?: any; error?: any }>;
    fetchUserDetails: () => Promise<any>;
    deleteUser: () => Promise<{ success: boolean; error?: any }>;
    changePassword: (current_password: string, new_password: string) => Promise<{ success: boolean; error?: any }>;
    updateUser: (userData: any) => Promise<{ success: boolean; data?: any; error?: any }>;
    checkIfClient: (email: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    verifyMfa: (tempToken: string, mfaCode: string) => Promise<{ success: boolean; error?: string }>;
    initiateMfaSetup: () => Promise<{ success: boolean; qrCode?: string; provisioningUri?: string; error?: string }>;
    confirmMfaSetup: (mfaCode: string) => Promise<{ success: boolean; error?: string }>;
    disableMfa: () => Promise<{ success: boolean; data?: any; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [access_token, setAccessToken] = useState(localStorage.getItem("access_token") || "");
    const [refresh_token, setRefreshToken] = useState(localStorage.getItem("refresh_token") || "");

    // Login function using the dj-rest-auth endpoint with MFA check.
    const login = async (email: string, password: string) => {
        try {
            interface LoginResponse {
                refresh: string;
                access: string;
                user_id: number;
                user_type: string;
                temp_token?: string;
            }
            // Updated endpoint: now using '/auth/login/'.
            const response = await axiosInstance.post<LoginResponse>('/api/users/auth/login/', { email, password });

            // If MFA is required, the backend responds with 202 and a temporary token.
            if (response.status === 202) {
                return { success: true, mfaRequired: true, temp_token: response.data.temp_token };
            } else {
                const { refresh, access, user_id, user_type } = response.data as LoginResponse;
                setAccessToken(access);
                setRefreshToken(refresh);
                setUser({ user_id, user_type });
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user_type', user_type);
                return { success: true, data: response.data };
            }
        } catch (error: any) {
            return { success: false, error: error.response?.data };
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

    // Registration for clients with confirm_password included.
    // Updated endpoint: '/auth/registration/'.
    const register = async (
        first_name: string,
        last_name: string,
        email: string,
        number: string,
        address: string,
        postcode: string,
        company_name: string,
        dob: string,
        password: string,
        confirm_password: string
    ) => {
        try {
            const payload = {
                first_name,
                last_name,
                email,
                number,
                address,
                postcode,
                company_name,
                dob,
                user_type: 'client',  // Specify client type.
                password1: password,
                password2: confirm_password,
            };
            const response = await axiosInstance.post('/api/users/auth/registration/', payload);
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    // Registration for suppliers (business) with confirm_password included.
    // Updated endpoint: '/auth/registration/'.
    const registerBusiness = async (
        first_name: string,
        last_name: string,
        email: string,
        number: string,
        address: string,
        postcode: string,
        dob: string,
        company_name: string,
        company_address: string,
        company_description: string,
        company_postcode: string,
        company_number: string,
        company_type: string,
        company_logo: File,
        subcategories: string,
        password: string,
        confirm_password: string
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
            formData.append('user_type', 'supplier');  // Specify supplier type.
            formData.append('password1', password);
            formData.append('password2', confirm_password);

            const response = await axiosInstance.post('/api/users/auth/registration/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    // Change password via dj-rest-auth endpoint.
    // Updated endpoint: '/auth/password/change/'.
    const changePassword = async (current_password: string, new_password: string) => {
        try {
            const response = await axiosInstance.post('/api/users/auth/password/change/', { current_password, new_password });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data };
        }
    };

    // Fetch user details from dj-rest-auth endpoint.
    // Updated endpoint: '/auth/user/'.
    const fetchUserDetails = async () => {
        try {
            const response = await axiosInstance.get('/api/users/auth/user/');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data || 'Failed to fetch user details' };
        }
    };

    // Custom update and delete endpoints remain unchanged.
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

    // MFA setup: updated endpoints for dj‑all‑auth.
    const initiateMfaSetup = async () => {
        try {
            const response = await axiosInstance.get('/api/users/auth/mfa/enable/');
            const { qr_code, provisioning_uri } = response.data as { qr_code: string; provisioning_uri: string };
            return { success: true, qrCode: qr_code, provisioningUri: provisioning_uri };
        } catch (error: any) {
            return { success: false, error: 'Failed to initiate MFA setup. Please try again.' };
        }
    };

    // Updated MFA verification endpoint: '/auth/mfa-verify/'.
    const verifyMfa = async (tempToken: string, mfaCode: string) => {
        try {
            const response = await axiosInstance.post('/api/users/auth/mfa-verify/', {
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

    // Updated MFA confirmation endpoint: '/auth/mfa/confirm/'.
    const confirmMfaSetup = async (mfaCode: string) => {
        try {
            await axiosInstance.post('/api/users/auth/mfa/confirm/', { mfa_code: mfaCode });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: 'Invalid MFA code. Please try again.' };
        }
    };

    // Updated MFA disable endpoint: '/auth/mfa/disable/'.
    const disableMfa = async () => {
        try {
            const response = await axiosInstance.post('/api/users/auth/mfa/disable/');
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || error.message || 'Failed to disable MFA' };
        }
    };

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            // Optionally, fetch user details using the stored token
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            access_token,
            refresh_token,
            login,
            logout,
            register,
            registerBusiness,
            fetchUserDetails,
            deleteUser,
            changePassword,
            updateUser,
            checkIfClient,
            verifyMfa,
            initiateMfaSetup,
            confirmMfaSetup,
            disableMfa
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
