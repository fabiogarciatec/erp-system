import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../services/authService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (data: { 
        email: string; 
        password: string; 
        name: string;
        company_id?: string;
    }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);
            setUser(response.user);
            navigate('/');
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    }, [navigate]);

    const register = useCallback(async (data: { 
        email: string; 
        password: string; 
        name: string;
        company_id?: string;
    }) => {
        try {
            const response = await authService.register(data);
            setUser(response.user);
            navigate('/');
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        }
    }, [navigate]);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        // Verificar token existente e validar sessão
        const token = authService.getToken();
        if (!token) {
            setLoading(false);
            if (window.location.pathname !== '/login') {
                navigate('/login');
            }
            return;
        }

        // Aqui você pode implementar uma verificação do token com o backend
        setLoading(false);
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
