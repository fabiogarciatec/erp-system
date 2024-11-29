import { supabaseAdmin } from '../lib/supabaseAdmin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    console.log('Iniciando migrações...');

    // Ler os arquivos SQL
    const setupSQL = await readFile(
      join(__dirname, '../../supabase/migrations/20240128000000_setup_functions.sql'),
      'utf8'
    );
    const cleanupSQL = await readFile(
      join(__dirname, '../../supabase/migrations/20240128000000_cleanup.sql'),
      'utf8'
    );
    const schemaSQL = await readFile(
      join(__dirname, '../../supabase/migrations/20240128000000_initial_schema.sql'),
      'utf8'
    );

    // Executar setup
    console.log('Configurando funções...');
    try {
      const { data: setupData, error: setupError } = await supabaseAdmin
        .from('_sql')
        .insert({ query: setupSQL })
        .select()
        .single();

      if (setupError) {
        console.error('Erro na configuração:', setupError);
        return;
      }

      console.log('Funções configuradas com sucesso');
    } catch (error) {
      console.error('Erro na configuração:', error);
      return;
    }

    // Executar cleanup
    console.log('Executando limpeza...');
    try {
      const { data: cleanupData, error: cleanupError } = await supabaseAdmin
        .from('_sql')
        .insert({ query: cleanupSQL })
        .select()
        .single();

      if (cleanupError) {
        console.error('Erro na limpeza:', cleanupError);
      } else {
        console.log('Limpeza concluída com sucesso');
      }
    } catch (error) {
      console.error('Erro na limpeza:', error);
      // Continuar mesmo se houver erro na limpeza
    }

    // Executar schema inicial
    console.log('Criando novo schema...');
    try {
      const { data: schemaData, error: schemaError } = await supabaseAdmin
        .from('_sql')
        .insert({ query: schemaSQL })
        .select()
        .single();

      if (schemaError) {
        console.error('Erro na criação do schema:', schemaError);
        return;
      }

      console.log('Schema criado com sucesso');
    } catch (error) {
      console.error('Erro na criação do schema:', error);
      return;
    }

    console.log('Migrações concluídas com sucesso!');

  } catch (error) {
    console.error('Erro ao executar migrações:', error);
  }
}

runMigrations();
