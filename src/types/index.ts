export interface BaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerData extends BaseRecord {
  name: string;
  email: string;
  phone: string;
  address: string;
  company_id?: string;
}

export interface ProductData extends BaseRecord {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  company_id?: string;
}

export interface CompanyData extends BaseRecord {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  website: string;
  foundation_date: string;
  logo_url?: string;
}

export interface Product extends BaseRecord {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Service extends BaseRecord {
  name: string;
  description: string;
  price: number;
}

export interface ServiceOrder extends BaseRecord {
  customer_id: string;
  service_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  scheduled_date: string;
  completed_date?: string;
}

export interface Sale extends BaseRecord {
  customer_id: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'pix';
  payment_status: 'pending' | 'paid' | 'refunded';
}

export interface SaleItem extends BaseRecord {
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface ShippingOrder extends BaseRecord {
  sale_id: string;
  customer_id: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_code?: string;
  estimated_delivery_date?: string;
  delivered_date?: string;
  shipping_address: string;
}

export interface User extends BaseRecord {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar_url?: string;
  last_login?: string;
}

export interface BackupMetadata extends BaseRecord {
  filename: string;
  size: number;
  tables: string[];
  record_count: number;
  created_by: string;
}

export interface OrderBy {
  column: string;
  ascending: boolean;
}

export interface GetRecordsOptions {
  orderBy?: OrderBy;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}
