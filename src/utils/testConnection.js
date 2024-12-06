import { supabaseAdmin } from '../services/supabaseAdmin';
export async function testSupabaseConnection() {
    try {
        // Test database access
        const { data, error } = await supabaseAdmin
            .from('empresas')
            .select('id')
            .limit(1);
        if (error) {
            return {
                success: false,
                message: `Erro no acesso ao banco de dados: ${error.message}`,
                error
            };
        }
        return {
            success: true,
            message: 'Conexão com Supabase estabelecida com sucesso!',
            data
        };
    }
    catch (error) {
        return {
            success: false,
            message: `Erro inesperado: ${error.message}`,
            error
        };
    }
}
