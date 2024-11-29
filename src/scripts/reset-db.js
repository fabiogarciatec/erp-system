import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('As variáveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
  process.exit(1);
}

// Criar cliente Supabase com a service key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetDatabase() {
  try {
    console.log('Iniciando reset do banco de dados...');

    // Ler o arquivo SQL
    const sqlPath = resolve(__dirname, '../db/reset.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');

    // Executar o SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql_string: sqlContent
    });

    if (error) {
      console.error('Erro ao executar SQL:', error);
      process.exit(1);
    }

    console.log('Banco de dados resetado com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

resetDatabase();
