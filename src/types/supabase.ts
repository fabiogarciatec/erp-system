export interface Company {
  id: string;
  created_at: string;
  name: string;
  logo_url?: string;
  active: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  company_id: string;
  role: 'master' | 'director' | 'manager' | 'supervisor' | 'seller' | 'intern' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
