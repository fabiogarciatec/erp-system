import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        checkUser();
    }, []);
    async function checkUser() {
        try {
            const user = await authService.getCurrentUser();
            setUser(user);
        }
        catch (error) {
            console.error('Error checking user:', error);
        }
        finally {
            setLoading(false);
        }
    }
    const login = async (email, password) => {
        try {
            setLoading(true);
            const { user } = await authService.login(email, password);
            setUser(user);
            navigate('/dashboard');
        }
        catch (error) {
            if (error.message === 'Invalid login credentials') {
                throw new Error('Email ou senha inválidos. Se você acabou de criar sua conta, confirme seu email antes de fazer login.');
            }
            console.error('Login error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const register = async (data) => {
        try {
            await authService.register(data);
        }
        catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            navigate('/login');
        }
        catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };
    const hasPermission = (permission) => {
        return authService.hasPermission(user, permission);
    };
    const hasRole = (role) => {
        return authService.hasRole(user, role);
    };
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
