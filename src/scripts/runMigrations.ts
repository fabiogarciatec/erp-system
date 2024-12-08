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
    const fixSchemaSQL = await readFile(
      join(__dirname, '../../supabase/migrations/20240311000000_fix_schema.sql'),
      'utf8'
    );
    const removeRlsSQL = await readFile(
      join(__dirname, '../../supabase/migrations/20240311004000_remove_all_rls.sql'),
      'utf8'
    );

    // Executar setup
    console.log('Configurando funções...');
    try {
      const { data: setupData, error: setupError } = await supabaseAdmin.rpc('exec_sql', {
        sql_string: setupSQL
      });

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
      const { data: cleanupData, error: cleanupError } = await supabaseAdmin.rpc('exec_sql', {
        sql_string: cleanupSQL
      });

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
      const { data: schemaData, error: schemaError } = await supabaseAdmin.rpc('exec_sql', {
        sql_string: schemaSQL
      });

      if (schemaError) {
        console.error('Erro na criação do schema:', schemaError);
        return;
      }

      console.log('Schema criado com sucesso');
    } catch (error) {
      console.error('Erro na criação do schema:', error);
      return;
    }

    // Executar correções no schema
    console.log('Aplicando correções no schema...');
    try {
      const { data: fixSchemaData, error: fixSchemaError } = await supabaseAdmin.rpc('exec_sql', {
        sql_string: fixSchemaSQL
      });

      if (fixSchemaError) {
        console.error('Erro na correção do schema:', fixSchemaError);
        return;
      }

      console.log('Correções do schema aplicadas com sucesso');
    } catch (error) {
      console.error('Erro na correção do schema:', error);
      return;
    }

    // Remover RLS
    console.log('Removendo RLS...');
    try {
      const { data: removeRlsData, error: removeRlsError } = await supabaseAdmin.rpc('exec_sql', {
        sql_string: removeRlsSQL
      });

      if (removeRlsError) {
        console.error('Erro ao remover RLS:', removeRlsError);
        return;
      }

      console.log('RLS removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover RLS:', error);
      return;
    }

    console.log('Migrações concluídas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
  }
}

runMigrations();
