export interface Customer {
  id?: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  created_at?: string
  last_purchase?: string | null
}
