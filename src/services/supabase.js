import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Configurações do cliente Supabase
const STORAGE_KEY = 'app_session';
const AUTO_REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutos
const CONNECTION_CHECK_INTERVAL = 30 * 1000; // 30 segundos

// Cria o cliente Supabase com configurações otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error('Erro ao ler sessão:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Erro ao salvar sessão:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Erro ao remover sessão:', error);
        }
      },
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Classe para gerenciar a conexão
class ConnectionManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.refreshTimer = null;
    this.connectionTimer = null;
    this.reconnectAttempts = 0;
    this.maxAttempts = 5;
    this.listeners = new Set();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Monitora estado da conexão
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Monitora visibilidade da página
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    
    // Inicia timers
    this.startRefreshTimer();
    this.startConnectionTimer();
  }

  handleOnline() {
    console.log('Conexão restabelecida');
    this.isOnline = true;
    this.reconnectAttempts = 0;
    this.refreshSession();
    this.notifyListeners('online');
  }

  handleOffline() {
    console.log('Conexão perdida');
    this.isOnline = false;
    this.notifyListeners('offline');
  }

  handleVisibilityChange() {
    if (!document.hidden) {
      console.log('Página visível, verificando conexão...');
      this.checkConnection();
    }
  }

  async checkConnection() {
    if (!this.isOnline) return;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (!session) {
        console.log('Sessão expirada, tentando reconectar...');
        await this.refreshSession();
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      this.handleConnectionError();
    }
  }

  async refreshSession() {
    if (!this.isOnline || this.reconnectAttempts >= this.maxAttempts) return;

    try {
      console.log('Atualizando sessão...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data?.session) {
        this.reconnectAttempts = 0;
        this.notifyListeners('refreshed');
        return data.session;
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      this.handleConnectionError();
    }
  }

  handleConnectionError() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts >= this.maxAttempts) {
      this.notifyListeners('max_attempts');
    }
  }

  startRefreshTimer() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => this.refreshSession(), AUTO_REFRESH_INTERVAL);
  }

  startConnectionTimer() {
    if (this.connectionTimer) clearInterval(this.connectionTimer);
    this.connectionTimer = setInterval(() => this.checkConnection(), CONNECTION_CHECK_INTERVAL);
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(event) {
    this.listeners.forEach(callback => callback(event));
  }

  cleanup() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    if (this.connectionTimer) clearInterval(this.connectionTimer);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Instância global do gerenciador de conexão
export const connectionManager = new ConnectionManager();

// Funções de autenticação melhoradas
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    connectionManager.cleanup();
    return { data: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const session = await connectionManager.refreshSession();
    if (!session) return null;

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    return user;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};

export const checkSession = async () => {
  try {
    const session = await connectionManager.refreshSession();
    if (!session) return null;

    // Verifica se o token está expirado
    const expiresAt = new Date(session.expires_at * 1000);
    if (expiresAt <= new Date()) {
      console.log('Sessão expirada');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return null;
  }
};

// Função para registrar callbacks de mudança de estado
export const onAuthStateChange = (callback) => {
  console.log('Configurando listener de autenticação...');
  
  // Adiciona listener para eventos de conexão
  connectionManager.addListener((event) => {
    if (event === 'max_attempts') {
      // Força logout após máximo de tentativas
      signOut();
    }
  });

  // Retorna a subscription do Supabase
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Mudança de estado:', event, session?.user?.id);
    callback(event, session);
  });
};
