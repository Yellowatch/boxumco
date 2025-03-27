import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import Navbar from '@/components/navbar/Navbar';
import ProfilePage from '@/pages/ProfilePage';
import HomePage from '@/pages/HomePage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import PrivateRoute from './context/PrivateRoute';



function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthProvider>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route element={<PrivateRoute />}>
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>
                        </Routes>
                    </Router>
                    <Toaster />
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}

export default App
