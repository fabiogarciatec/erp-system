import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

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

// Definição das tabelas necessárias
const requiredTables = {
  empresas: {
    columns: [
      { name: 'id', type: 'uuid', constraints: ['primary key'] },
      { name: 'nome', type: 'character varying', constraints: ['not null'] },
      { name: 'email', type: 'character varying', constraints: ['not null', 'unique'] },
      { name: 'created_at', type: 'timestamp with time zone' },
      { name: 'updated_at', type: 'timestamp with time zone' }
    ]
  },
  usuarios: {
    columns: [
      { name: 'id', type: 'uuid', constraints: ['primary key'] },
      { name: 'email', type: 'character varying', constraints: ['not null', 'unique'] },
      { name: 'nome', type: 'character varying', constraints: ['not null'] },
      { name: 'empresa_id', type: 'uuid', constraints: ['not null', 'references empresas(id)'] },
      { name: 'created_at', type: 'timestamp with time zone' },
      { name: 'updated_at', type: 'timestamp with time zone' }
    ]
  },
  customers: {
    columns: [
      { name: 'id', type: 'uuid', constraints: ['primary key'] },
      { name: 'nome', type: 'character varying', constraints: ['not null'] },
      { name: 'email', type: 'character varying' },
      { name: 'telefone', type: 'character varying' },
      { name: 'empresa_id', type: 'uuid', constraints: ['not null', 'references empresas(id)'] },
      { name: 'created_at', type: 'timestamp with time zone' },
      { name: 'updated_at', type: 'timestamp with time zone' }
    ]
  }
};

async function checkTables() {
  try {
    // Obter lista de tabelas existentes
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      throw tablesError;
    }

    console.log('\n=== Verificação de Tabelas ===\n');

    // Verificar cada tabela necessária
    for (const [tableName, tableSpec] of Object.entries(requiredTables)) {
      const tableExists = tables?.some(t => t.table_name === tableName);
      console.log(`\nTabela: ${tableName}`);
      console.log(`Status: ${tableExists ? '✅ Existe' : '❌ Não existe'}`);

      if (tableExists) {
        // Verificar colunas
        const { data: columns, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_schema', 'public')
          .eq('table_name', tableName);

        if (columnsError) {
          throw columnsError;
        }

        console.log('\nColunas:');
        for (const expectedColumn of tableSpec.columns) {
          const existingColumn = columns?.find(c => c.column_name === expectedColumn.name);
          
          if (existingColumn) {
            console.log(`  ✅ ${expectedColumn.name} (${existingColumn.data_type})`);
          } else {
            console.log(`  ❌ ${expectedColumn.name} (faltando)`);
          }
        }

        // Verificar índices
        const { data: indexes, error: indexesError } = await supabase
          .rpc('get_table_indexes', { table_name: tableName });

        if (indexesError) {
          throw indexesError;
        }

        console.log('\nÍndices:');
        if (indexes && indexes.length > 0) {
          indexes.forEach((idx: any) => {
            console.log(`  ✅ ${idx.indexname}`);
          });
        } else {
          console.log('  ❌ Nenhum índice encontrado');
        }
      }
    }

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

// Criar função para listar índices
async function createIndexFunction() {
  const { error } = await supabase.rpc('exec_sql', {
    sql_string: `
      CREATE OR REPLACE FUNCTION get_table_indexes(table_name text)
      RETURNS TABLE (
        indexname name,
        indexdef text
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          i.relname AS indexname,
          pg_get_indexdef(i.oid) AS indexdef
        FROM
          pg_index x
          JOIN pg_class c ON c.oid = x.indrelid
          JOIN pg_class i ON i.oid = x.indexrelid
          LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE
          c.relkind = 'r'
          AND n.nspname = 'public'
          AND c.relname = table_name;
      END;
      $$;
    `
  });

  if (error) {
    console.error('Erro ao criar função get_table_indexes:', error);
    process.exit(1);
  }
}

// Executar verificação
async function main() {
  await createIndexFunction();
  await checkTables();
}

main();
