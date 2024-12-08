export interface BaseRecord {
  id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Company extends BaseRecord {
  name: string;
  document?: string;
  email?: string;
  phone?: string;
}

export interface User extends BaseRecord {
  auth_id: string;
  name: string;
  email: string;
}

export interface Product extends BaseRecord {
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
}

export interface Customer extends BaseRecord {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
}

export interface Service extends BaseRecord {
  name: string;
  description?: string;
  price: number;
}

export interface Profile extends BaseRecord {
  name: string;
  description?: string;
}

export interface GetRecordsOptions {
  orderBy?: {
    column: string;
    ascending: boolean;
  };
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}
