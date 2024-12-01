import supabase from '../../lib/supabase';
import { Product, ProductInsert, ProductUpdate } from '../../types/supabase';

class ProductService {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome');

    if (error) {
      throw error;
    }

    return data as Product[];
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  }

  async create(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from('produtos')
      .insert(product)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  }

  async update(id: string, product: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from('produtos')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const { data, error } = await supabase
      .from('produtos')
      .update({ estoque_atual: quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  }

  async searchByName(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .ilike('nome', `%${query}%`)
      .order('nome');

    if (error) {
      throw error;
    }

    return data as Product[];
  }
}

export const productService = new ProductService();
