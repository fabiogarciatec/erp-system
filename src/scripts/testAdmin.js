import { testSupabaseAdminConnection } from '../utils/testSupabaseAdmin';
console.log('Iniciando testes de conexão superadmin...\n');
testSupabaseAdminConnection()
    .then((result) => {
    if (result.success) {
        console.log('\n🎉 Sucesso:', result.message);
        process.exit(0);
    }
    else {
        console.error('\n❌ Falha:', result.message);
        process.exit(1);
    }
})
    .catch((error) => {
    console.error('\n❌ Erro inesperado:', error);
    process.exit(1);
});
