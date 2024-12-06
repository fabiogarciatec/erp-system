import { testSupabaseAdminConnection } from '../utils/testSupabaseAdmin';

interface TestResult {
  success: boolean;
  message: string;
}

console.log('Iniciando testes de conexão superadmin...\n');

testSupabaseAdminConnection()
  .then((result: TestResult) => {
    if (result.success) {
      console.log('\n🎉 Sucesso:', result.message);
      process.exit(0);
    } else {
      console.error('\n❌ Falha:', result.message);
      process.exit(1);
    }
  })
  .catch((error: Error) => {
    console.error('\n❌ Erro inesperado:', error);
    process.exit(1);
  });
