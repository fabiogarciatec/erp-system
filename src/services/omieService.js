import axios from 'axios';
const api = axios.create({
    baseURL: '/api'
});
export const omieService = {
    async listCustomers(page = 1, pageSize = 50) {
        try {
            const response = await api.get('/clientes', {
                params: { page, pageSize }
            });
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return {
                success: false,
                error: 'Erro ao buscar clientes da Omie'
            };
        }
    },
    async searchCustomers(query) {
        try {
            const response = await api.get('/clientes/busca', {
                params: { q: query }
            });
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return {
                success: false,
                error: 'Erro ao buscar clientes da Omie'
            };
        }
    }
};
