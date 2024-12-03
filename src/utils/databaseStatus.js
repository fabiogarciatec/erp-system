import { supabaseAdmin } from '../services/supabaseAdmin';
export async function checkDatabaseStatus() {
    try {
        // Testar conexão básica
        const { data: healthCheck, error: healthError } = await supabaseAdmin
            .from('usuarios')
            .select('count')
            .limit(1);
        if (healthError) {
            return {
                isConnected: false,
                tables: {
                    empresas: false,
                    usuarios: false,
                    customers: false
                },
                error: `Erro na conexão: ${healthError.message}`
            };
        }
        // Testar acesso às tabelas
        const tables = {
            empresas: false,
            usuarios: false,
            customers: false
        };
        // Verificar tabela empresas
        const { error: empresasError } = await supabaseAdmin
            .from('empresas')
            .select('count')
            .limit(1);
        tables.empresas = !empresasError;
        // Verificar tabela usuarios
        const { error: usuariosError } = await supabaseAdmin
            .from('usuarios')
            .select('count')
            .limit(1);
        tables.usuarios = !usuariosError;
        // Verificar tabela customers
        const { error: customersError } = await supabaseAdmin
            .from('customers')
            .select('count')
            .limit(1);
        tables.customers = !customersError;
        return {
            isConnected: true,
            tables,
            error: undefined
        };
    }
    catch (error) {
        return {
            isConnected: false,
            tables: {
                empresas: false,
                usuarios: false,
                customers: false
            },
            error: `Erro inesperado: ${error.message}`
        };
    }
}
