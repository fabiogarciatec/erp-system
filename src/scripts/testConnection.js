import { testSupabaseConnection } from '../utils/testConnection';
console.log('Testando conexão com Supabase...\n');
testSupabaseConnection()
    .then((result) => {
    if (result.success) {
        console.log('✅ Sucesso:', result.message);
        if (result.data) {
            console.log('\nDados de teste:', result.data);
        }
        process.exit(0);
    }
    else {
        console.error('❌ Falha:', result.message);
        if (result.error) {
            console.error('\nDetalhes do erro:', result.error);
        }
        process.exit(1);
    }
})
    .catch((error) => {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
});
