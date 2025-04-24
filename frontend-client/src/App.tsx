import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import PrivateRoute from './context/PrivateRoute';
import Navbar from '@/components/navbar/Navbar';
import ProfilePage from '@/pages/ProfilePage';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';

import ConfirmHandler from '@/handlers/ConfirmHandler';

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        <Router>
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/api/users/confirm-email"
                                    element={<ConfirmHandler />}
                                />
                                <Route element={<PrivateRoute />}>
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Route>
                            </Routes>
                        </Router>
                        <Toaster />
                    </QueryClientProvider>
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}

export default App
