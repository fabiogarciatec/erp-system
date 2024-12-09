import axios from 'axios';

const API_URL = 'http://localhost:5000'; // URL do nosso backend Flask

export interface User {
    id: string;
    email: string;
    name: string;
    company_id?: string;
    role_id?: string;
    is_active: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            
            // Salva o token no localStorage
            localStorage.setItem('token', response.data.token);
            
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Email ou senha inválidos');
            }
            throw new Error('Erro ao fazer login. Tente novamente.');
        }
    },

    async register(data: { 
        email: string; 
        password: string; 
        name: string;
        company_id?: string;
    }): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, data);
            
            // Salva o token no localStorage
            localStorage.setItem('token', response.data.token);
            
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Erro ao criar conta');
            }
            throw new Error('Erro ao criar conta. Tente novamente.');
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};

// Configuração global do axios para incluir o token em todas as requisições
axios.interceptors.request.use(config => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
