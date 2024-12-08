import { supabase } from './supabase';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
export async function createBackup(companyId) {
    try {
        const backupData = {
            company: null,
            employees: [],
            customers: [],
            suppliers: [],
            products: [],
            services: [],
            categories: [],
            sales: [],
            serviceOrders: [],
            shippingOrders: [],
        };
        // Buscar dados da empresa
        const { data: company, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .single();
        if (companyError)
            throw companyError;
        backupData.company = company;
        // Buscar funcionários da empresa
        const { data: employees, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('company_id', companyId);
        if (employeesError)
            throw employeesError;
        backupData.employees = employees || [];
        // Buscar clientes da empresa
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*')
            .eq('company_id', companyId);
        if (customersError)
            throw customersError;
        backupData.customers = customers || [];
        // Buscar fornecedores da empresa
        const { data: suppliers, error: suppliersError } = await supabase
            .from('suppliers')
            .select('*')
            .eq('company_id', companyId);
        if (suppliersError)
            throw suppliersError;
        backupData.suppliers = suppliers || [];
        // Buscar produtos da empresa
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('company_id', companyId);
        if (productsError)
            throw productsError;
        backupData.products = products || [];
        // Buscar serviços da empresa
        const { data: services, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .eq('company_id', companyId);
        if (servicesError)
            throw servicesError;
        backupData.services = services || [];
        // Buscar categorias da empresa
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .eq('company_id', companyId);
        if (categoriesError)
            throw categoriesError;
        backupData.categories = categories || [];
        // Buscar vendas da empresa
        const { data: sales, error: salesError } = await supabase
            .from('sales')
            .select('*')
            .eq('company_id', companyId);
        if (salesError)
            throw salesError;
        backupData.sales = sales || [];
        // Buscar ordens de serviço da empresa
        const { data: serviceOrders, error: serviceOrdersError } = await supabase
            .from('service_orders')
            .select('*')
            .eq('company_id', companyId);
        if (serviceOrdersError)
            throw serviceOrdersError;
        backupData.serviceOrders = serviceOrders || [];
        // Buscar ordens de entrega da empresa
        const { data: shippingOrders, error: shippingOrdersError } = await supabase
            .from('shipping_orders')
            .select('*')
            .eq('company_id', companyId);
        if (shippingOrdersError)
            throw shippingOrdersError;
        backupData.shippingOrders = shippingOrders || [];
        // Criar arquivo de backup
        const backupJson = JSON.stringify(backupData, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup_${company.name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.json`;
        // Comprimir dados
        const zip = new JSZip();
        zip.file(fileName, backupJson);
        const content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });
        const zipFileName = fileName.replace('.json', '.zip');
        saveAs(content, zipFileName);
        return {
            fileName: zipFileName,
            size: content.size
        };
    }
    catch (error) {
        console.error('Erro ao criar backup:', error);
        throw error;
    }
}
export async function restoreBackup(file, companyId) {
    try {
        let backupData;
        if (file.name.endsWith('.zip')) {
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(file);
            const jsonFile = Object.values(zipContent.files)[0];
            const jsonContent = await jsonFile.async('string');
            backupData = JSON.parse(jsonContent);
        }
        else {
            const jsonContent = await file.text();
            backupData = JSON.parse(jsonContent);
        }
        // Verificar se o backup pertence à empresa correta
        if (backupData.company.id !== companyId) {
            throw new Error('Este backup pertence a outra empresa');
        }
        // Restaurar dados na ordem correta para manter integridade referencial
        const { error: employeesError } = await supabase
            .from('employees')
            .upsert(backupData.employees);
        if (employeesError)
            throw employeesError;
        const { error: customersError } = await supabase
            .from('customers')
            .upsert(backupData.customers);
        if (customersError)
            throw customersError;
        const { error: suppliersError } = await supabase
            .from('suppliers')
            .upsert(backupData.suppliers);
        if (suppliersError)
            throw suppliersError;
        const { error: categoriesError } = await supabase
            .from('categories')
            .upsert(backupData.categories);
        if (categoriesError)
            throw categoriesError;
        const { error: productsError } = await supabase
            .from('products')
            .upsert(backupData.products);
        if (productsError)
            throw productsError;
        const { error: servicesError } = await supabase
            .from('services')
            .upsert(backupData.services);
        if (servicesError)
            throw servicesError;
        const { error: salesError } = await supabase
            .from('sales')
            .upsert(backupData.sales);
        if (salesError)
            throw salesError;
        const { error: serviceOrdersError } = await supabase
            .from('service_orders')
            .upsert(backupData.serviceOrders);
        if (serviceOrdersError)
            throw serviceOrdersError;
        const { error: shippingOrdersError } = await supabase
            .from('shipping_orders')
            .upsert(backupData.shippingOrders);
        if (shippingOrdersError)
            throw shippingOrdersError;
    }
    catch (error) {
        console.error('Erro ao restaurar backup:', error);
        throw error;
    }
}
