import supabase from '../../lib/supabase';
class ProductService {
    async getAll() {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('nome');
        if (error) {
            throw error;
        }
        return data;
    }
    async getById(id) {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            throw error;
        }
        return data;
    }
    async create(product) {
        const { data, error } = await supabase
            .from('produtos')
            .insert(product)
            .select()
            .single();
        if (error) {
            throw error;
        }
        return data;
    }
    async update(id, product) {
        const { data, error } = await supabase
            .from('produtos')
            .update(product)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw error;
        }
        return data;
    }
    async delete(id) {
        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
    }
    async updateStock(id, quantity) {
        const { data, error } = await supabase
            .from('produtos')
            .update({ estoque_atual: quantity })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw error;
        }
        return data;
    }
    async searchByName(query) {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .ilike('nome', `%${query}%`)
            .order('nome');
        if (error) {
            throw error;
        }
        return data;
    }
}
export const productService = new ProductService();
