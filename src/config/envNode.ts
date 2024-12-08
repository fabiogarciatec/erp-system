import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Configurações do Supabase
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Configurações do banco de dados
export const DB_HOST = process.env.SUPABASE_DB_HOST;
export const DB_PORT = process.env.SUPABASE_DB_PORT;
export const DB_NAME = process.env.SUPABASE_DB_NAME;
export const DB_USER = process.env.SUPABASE_DB_USER;
export const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

// Validação das variáveis obrigatórias
const requiredEnvVars = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não está definida`);
  }
});
