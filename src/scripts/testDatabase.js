import { checkDatabaseStatus } from '../utils/databaseStatus';
import { testSupabaseConnection } from '../utils/testConnection';
async function runTests() {
    console.log('🔍 Iniciando testes de conexão com o Supabase...\n');
    // Teste de conexão básica
    console.log('1. Testando conexão básica...');
    const connectionTest = await testSupabaseConnection();
    console.log(connectionTest.success
        ? `✅ ${connectionTest.message}`
        : `❌ ${connectionTest.message}`);
    if (connectionTest.error) {
        console.error('\nDetalhes do erro:', connectionTest.error);
    }
    // Teste de status do banco
    console.log('\n2. Verificando status do banco de dados...');
    const dbStatus = await checkDatabaseStatus();
    console.log(`Status da conexão: ${dbStatus.isConnected ? '✅ Conectado' : '❌ Desconectado'}`);
    console.log('\nStatus das tabelas:');
    Object.entries(dbStatus.tables).forEach(([table, status]) => {
        console.log(`${status ? '✅' : '❌'} ${table}`);
    });
    if (dbStatus.error) {
        console.error('\nErro:', dbStatus.error);
    }
    // Finalização
    if (connectionTest.success && dbStatus.isConnected) {
        console.log('\n✅ Todos os testes completados com sucesso!');
        process.exit(0);
    }
    else {
        console.error('\n❌ Alguns testes falharam. Por favor, verifique os erros acima.');
        process.exit(1);
    }
}
runTests().catch(error => {
    console.error('Erro inesperado:', error);
    process.exit(1);
});
