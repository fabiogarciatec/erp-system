export interface Company {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  address_number: string;
  address_complement?: string;
  neighborhood: string;
  city: string;
  state_id: number;
  postal_code: string;
  created_at: string;
  updated_at: string;
  latitude?: number | null;
  longitude?: number | null;
}
