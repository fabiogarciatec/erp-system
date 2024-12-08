import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input, Select, useColorModeValue, useToast, VStack, Heading, Divider, Grid, GridItem, SimpleGrid, Icon, Flex, InputGroup, } from '@chakra-ui/react';
import { FiSave, FiSearch, FiGrid } from 'react-icons/fi';
import { useCep } from '../../hooks/useCep';
import { useCompanyData } from '../../hooks/useCompanyData';
import { GoogleMap } from '../../components/GoogleMap';
import { PageHeader } from '@/components/PageHeader';
import { InputMaskChakra } from '@/components/InputMaskChakra';
function CompanyCard({ company, handleInputChange, styles }) {
    return (_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, children: [_jsx(GridItem, { colSpan: { base: 1, md: 2 }, children: _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome da Empresa" }), _jsx(Input, { value: company.name, onChange: (e) => handleInputChange('name', e.target.value), placeholder: "Nome da empresa" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "CNPJ" }), _jsx(InputGroup, { children: _jsx(InputMaskChakra, { mask: "99.999.999/9999-99", value: company.document, onChange: (e) => handleInputChange('document', e.target.value), placeholder: "00.000.000/0000-00" }) })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Telefone" }), _jsx(InputGroup, { children: _jsx(InputMaskChakra, { mask: "(99) 99999-9999", value: company.phone, onChange: (e) => handleInputChange('phone', e.target.value), placeholder: "(00) 00000-0000" }) })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { value: company.email, onChange: (e) => handleInputChange('email', e.target.value), placeholder: "email@empresa.com" })] }) })] }));
}
function AddressCard({ company, states, handleInputChange, styles }) {
    return (_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, children: [_jsx(GridItem, { colSpan: { base: 1, md: 2 }, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Logradouro" }), _jsx(Input, { value: company.address, onChange: (e) => handleInputChange('address', e.target.value), placeholder: "Rua, Avenida, etc" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "N\u00FAmero" }), _jsx(Input, { value: company.address_number, onChange: (e) => handleInputChange('address_number', e.target.value), placeholder: "123" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Complemento" }), _jsx(Input, { value: company.address_complement || '', onChange: (e) => handleInputChange('address_complement', e.target.value), placeholder: "Apto, Sala, etc" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Bairro" }), _jsx(Input, { value: company.neighborhood, onChange: (e) => handleInputChange('neighborhood', e.target.value), placeholder: "Bairro" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Cidade" }), _jsx(Input, { value: company.city, onChange: (e) => handleInputChange('city', e.target.value), placeholder: "Cidade" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Estado" }), _jsxs(Select, { value: company.state_id?.toString(), onChange: (e) => handleInputChange('state_id', parseInt(e.target.value)), children: [_jsx("option", { value: "", children: "Selecione um estado" }), states.map((state) => (_jsx("option", { value: state.id, children: state.name }, state.id)))] })] }) })] }));
}
function CompanyPage() {
    const { company, states, isLoading, handleInputChange: baseHandleInputChange, handleSave, fetchCompanyData, isSaving } = useCompanyData();
    const toast = useToast();
    const [addressUpdated, setAddressUpdated] = useState(false);
    const { handleCepLookup, isLoading: cepLoading } = useCep({
        onSuccess: async (data) => {
            try {
                // Limpa as coordenadas existentes para forçar nova geocodificação
                await handleInputChange('latitude', 0);
                await handleInputChange('longitude', 0);
                // Atualiza os campos no banco de dados
                const updates = [
                    handleInputChange('address', data.logradouro || ''),
                    handleInputChange('neighborhood', data.bairro || ''),
                    handleInputChange('city', data.localidade || ''),
                    handleInputChange('postal_code', data.cep?.replace(/\D/g, '') || ''),
                    handleInputChange('address_complement', data.complemento || '')
                ];
                // Encontra o ID do estado baseado na UF
                const state = states.find(state => state.uf.toLowerCase() === data.uf.toLowerCase());
                if (state) {
                    updates.push(handleInputChange('state_id', state.id));
                }
                // Aguarda todas as atualizações terminarem
                await Promise.all(updates);
                // Marca que o endereço foi atualizado
                setAddressUpdated(true);
                // Recarrega os dados do banco
                await fetchCompanyData();
                toast({
                    title: "Sucesso",
                    description: "Endereço atualizado com sucesso",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
            catch (error) {
                toast({
                    title: "Erro",
                    description: "Erro ao atualizar endereço",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        },
        onError: (error) => {
            toast({
                title: "Erro",
                description: error.message || "Erro ao buscar endereço",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    });
    // Função para remover máscaras
    const removeMask = (value) => value.replace(/\D/g, '');
    // Wrapper para handleInputChange que remove máscaras quando necessário
    const handleInputChange = (field, value) => {
        if (field === 'phone' || field === 'document' || field === 'postal_code') {
            baseHandleInputChange(field, removeMask(value));
        }
        else {
            baseHandleInputChange(field, value);
        }
    };
    const styles = {
        textColor: useColorModeValue('gray.800', 'white'),
        dividerColor: useColorModeValue('gray.200', 'gray.600'),
        iconColor: useColorModeValue('gray.600', 'gray.400'),
    };
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const titleGradient = useColorModeValue('linear(to-r, blue.400, blue.600)', 'linear(to-r, blue.200, blue.400)');
    const handleCepChange = (value) => {
        // Apenas atualiza o campo com o valor digitado
        handleInputChange('postal_code', value);
    };
    // Reset addressUpdated quando as coordenadas forem atualizadas
    useEffect(() => {
        if (addressUpdated && company?.latitude && company?.longitude) {
            setAddressUpdated(false);
        }
    }, [company?.latitude, company?.longitude]);
    const handleLocationSelect = async (lat, lng) => {
        try {
            await handleInputChange('latitude', lat);
            await handleInputChange('longitude', lng);
            toast({
                title: "Localização atualizada",
                description: "As coordenadas foram atualizadas com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar as coordenadas.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    if (isLoading || !company) {
        return _jsx("div", { children: "Carregando..." });
    }
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Empresa", icon: FiGrid, subtitle: "Gerencie as informa\u00E7\u00F5es da sua empresa", breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Empresa', href: '/configuracoes/empresa' }
                ] }), _jsxs(Box, { display: "flex", flexDirection: { base: "column", xl: "row" }, gap: 4, px: { base: 2, xl: 8 }, pb: 12, mx: { base: 0, xl: "auto" }, maxW: { base: "100%", xl: "86vw" }, w: "full", children: [_jsx(Box, { flex: { base: "1", xl: "1.5" }, children: _jsxs(VStack, { spacing: 6, w: "full", align: "stretch", children: [_jsx(Box, { borderWidth: "2px", borderRadius: { base: "md", md: "lg" }, p: { base: 3, md: 6 }, bg: cardBg, borderColor: borderColor, w: "full", mx: { base: 0, xl: "auto" }, children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsx(Heading, { size: "md", bgGradient: titleGradient, bgClip: "text", children: "Configura\u00E7\u00F5es da Empresa" }), _jsx(Divider, { borderColor: styles.dividerColor }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome da Empresa" }), _jsx(Input, { value: company.name, onChange: (e) => handleInputChange('name', e.target.value), placeholder: "Nome da empresa" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "CNPJ" }), _jsx(InputGroup, { children: _jsx(InputMaskChakra, { mask: "99.999.999/9999-99", value: company.document, onChange: (e) => handleInputChange('document', e.target.value), placeholder: "00.000.000/0000-00" }) })] })] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "E-mail" }), _jsx(Input, { value: company.email, onChange: (e) => handleInputChange('email', e.target.value), placeholder: "email@empresa.com", type: "email" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Telefone" }), _jsx(InputGroup, { children: _jsx(InputMaskChakra, { mask: "(99) 99999-9999", value: company.phone, onChange: (e) => handleInputChange('phone', e.target.value), placeholder: "(00) 00000-0000" }) })] })] })] }) }), _jsx(Box, { borderWidth: "2px", borderRadius: { base: "md", md: "lg" }, p: { base: 3, md: 6 }, bg: cardBg, borderColor: borderColor, w: "full", mx: { base: 0, xl: "auto" }, children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsx(Heading, { size: "md", bgGradient: titleGradient, bgClip: "text", children: "Endere\u00E7o" }), _jsx(Divider, { borderColor: styles.dividerColor }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "CEP" }), _jsxs(HStack, { children: [_jsx(InputGroup, { children: _jsx(InputMaskChakra, { mask: "99999-999", value: company.postal_code, onChange: (e) => handleInputChange('postal_code', e.target.value), placeholder: "00000-000" }) }), _jsx(Button, { onClick: () => {
                                                                            if (!company.postal_code)
                                                                                return;
                                                                            handleCepLookup(company.postal_code);
                                                                        }, isLoading: cepLoading, colorScheme: "blue", leftIcon: _jsx(Icon, { as: FiSearch }), children: "Buscar" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Endere\u00E7o" }), _jsx(Input, { value: company.address, onChange: (e) => handleInputChange('address', e.target.value), placeholder: "Rua, Avenida, etc" })] })] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 3 }, spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "N\u00FAmero" }), _jsx(Input, { value: company.address_number, onChange: (e) => handleInputChange('address_number', e.target.value), placeholder: "N\u00BA" })] }), _jsx(GridItem, { colSpan: 2, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Complemento" }), _jsx(Input, { value: company.address_complement || '', onChange: (e) => handleInputChange('address_complement', e.target.value), placeholder: "Apto, Sala, etc" })] }) })] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 3 }, spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Bairro" }), _jsx(Input, { value: company.neighborhood, onChange: (e) => handleInputChange('neighborhood', e.target.value), placeholder: "Bairro" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Cidade" }), _jsx(Input, { value: company.city, onChange: (e) => handleInputChange('city', e.target.value), placeholder: "Cidade" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Estado" }), _jsx(Select, { value: company.state_id || '', onChange: (e) => handleInputChange('state_id', Number(e.target.value)), placeholder: "Selecione o estado", children: states.map((state) => (_jsx("option", { value: state.id, children: state.name }, state.id))) })] })] })] }) })] }) }), _jsx(Box, { flex: { base: "1", xl: "1" }, w: "full", position: "relative", minH: { base: "400px", xl: "auto" }, h: { base: "400px", xl: "auto" }, children: _jsx(Box, { borderWidth: "2px", borderRadius: "lg", bg: cardBg, borderColor: borderColor, position: { base: "relative", xl: "sticky" }, top: { base: 0, xl: "100px" }, h: "full", overflow: "hidden", p: { base: 2, xl: 3 }, children: _jsxs(VStack, { spacing: 4, align: "stretch", h: "full", children: [_jsx(Heading, { size: "md", bgGradient: titleGradient, bgClip: "text", children: "Localiza\u00E7\u00E3o" }), _jsx(Divider, { borderColor: styles.dividerColor }), _jsx(Box, { flex: "1", borderRadius: "md", overflow: "hidden", position: "relative", minH: { base: "300px", xl: "auto" }, children: _jsx(GoogleMap, { address: `${company.address}, ${company.city}, ${states.find(s => s.id === company.state_id)?.uf}`, latitude: company.latitude, longitude: company.longitude, onLocationSelect: handleLocationSelect, height: "100%", company: company, states: states }) })] }) }) })] }), _jsx(Flex, { width: "100%", justify: "center", mt: -6, mb: 4, children: _jsx(Box, { borderWidth: "2px", borderRadius: "lg", p: { base: 2, xl: 3 }, ml: { base: 2, xl: 6 }, mr: { base: 2, xl: 6 }, bg: cardBg, borderColor: borderColor, maxW: "86vw", w: "full", position: "relative", children: _jsx(VStack, { spacing: 3, align: "stretch", children: _jsx(HStack, { spacing: 3, justify: "center", children: _jsx(Button, { leftIcon: _jsx(FiSave, {}), colorScheme: "blue", onClick: handleSave, isLoading: isSaving, size: "lg", px: 4, children: "Salvar Altera\u00E7\u00F5es" }) }) }) }) })] }));
}
export { CompanyPage as Company };
