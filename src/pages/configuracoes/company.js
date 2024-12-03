import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input, Select, Text, useColorModeValue, useToast, VStack, Heading, Divider, Grid, GridItem, SimpleGrid, Icon, InputGroup, } from '@chakra-ui/react';
import { FiSave, FiSearch } from 'react-icons/fi';
import { useCep } from '../../hooks/useCep';
import { useCompanyData } from '../../hooks/useCompanyData';
import { GoogleMap } from '../../components/GoogleMap';
import { PageHeader } from '@/components/PageHeader';
import InputMask from 'react-input-mask';
function CompanyCard({ company, handleInputChange, styles }) {
    return (_jsxs(Grid, { templateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: 6, children: [_jsx(GridItem, { colSpan: { base: 1, md: 2 }, children: _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome da Empresa" }), _jsx(Input, { value: company.name, onChange: (e) => handleInputChange('name', e.target.value), placeholder: "Nome da empresa" })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "CNPJ" }), _jsx(InputGroup, { children: _jsx(Input, { as: InputMask, mask: "99.999.999/9999-99", value: company.document, onChange: (e) => handleInputChange('document', e.target.value), placeholder: "00.000.000/0000-00" }) })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Telefone" }), _jsx(InputGroup, { children: _jsx(Input, { as: InputMask, mask: "(99) 99999-9999", value: company.phone, onChange: (e) => handleInputChange('phone', e.target.value), placeholder: "(00) 00000-0000" }) })] }) }), _jsx(GridItem, { children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { value: company.email, onChange: (e) => handleInputChange('email', e.target.value), placeholder: "email@empresa.com" })] }) })] }));
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
    if (isLoading || !company) {
        return _jsx("div", { children: "Carregando..." });
    }
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Configura\u00E7\u00F5es da Empresa", subtitle: "Gerencie as informa\u00E7\u00F5es da sua empresa", breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Empresa', href: '/configuracoes/empresa' }
                ] }), _jsxs(Box, { display: "flex", mt: "-10px", px: 8, flexDirection: { base: "column", xl: "row" }, w: "86vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: [_jsxs(VStack, { flex: "1", spacing: 6, align: "stretch", children: [_jsx(Box, { borderWidth: "2px", borderRadius: "lg", p: 6, bg: cardBg, borderColor: borderColor, width: "45vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsx(Heading, { size: "lg", bgGradient: titleGradient, bgClip: "text", children: "Configura\u00E7\u00F5es da Empresa" }), _jsx(Divider, { borderColor: styles.dividerColor }), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsx(Heading, { size: "md", bgGradient: titleGradient, bgClip: "text", children: "Dados da Empresa" }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome da Empresa" }), _jsx(Input, { value: company.name, onChange: (e) => handleInputChange('name', e.target.value), placeholder: "Nome da empresa" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "CNPJ" }), _jsx(InputGroup, { children: _jsx(Input, { as: InputMask, mask: "99.999.999/9999-99", value: company.document, onChange: (e) => handleInputChange('document', e.target.value), placeholder: "00.000.000/0000-00" }) })] })] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "E-mail" }), _jsx(Input, { value: company.email, onChange: (e) => handleInputChange('email', e.target.value), placeholder: "email@empresa.com", type: "email" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Telefone" }), _jsx(InputGroup, { children: _jsx(Input, { as: InputMask, mask: "(99) 99999-9999", value: company.phone, onChange: (e) => handleInputChange('phone', e.target.value), placeholder: "(00) 00000-0000" }) })] })] })] })] }) }), _jsx(Box, { borderWidth: "2px", borderRadius: "lg", p: 6, bg: cardBg, borderColor: borderColor, width: "45vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsx(Heading, { size: "md", bgGradient: titleGradient, bgClip: "text", children: "Endere\u00E7o" }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "CEP" }), _jsxs(HStack, { children: [_jsx(InputGroup, { children: _jsx(Input, { as: InputMask, mask: "99999-999", value: company.postal_code, onChange: (e) => handleInputChange('postal_code', e.target.value), placeholder: "00000-000" }) }), _jsx(Button, { onClick: () => {
                                                                        if (!company.postal_code)
                                                                            return;
                                                                        handleCepLookup(company.postal_code);
                                                                    }, isLoading: cepLoading, colorScheme: "blue", leftIcon: _jsx(Icon, { as: FiSearch }), children: "Buscar" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Endere\u00E7o" }), _jsx(Input, { value: company.address, onChange: (e) => handleInputChange('address', e.target.value), placeholder: "Rua, Avenida, etc" })] })] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 3 }, spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "N\u00FAmero" }), _jsx(Input, { value: company.address_number, onChange: (e) => handleInputChange('address_number', e.target.value), placeholder: "N\u00BA" })] }), _jsx(GridItem, { colSpan: 2, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Complemento" }), _jsx(Input, { value: company.address_complement || '', onChange: (e) => handleInputChange('address_complement', e.target.value), placeholder: "Apto, Sala, etc" })] }) })] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 3 }, spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Bairro" }), _jsx(Input, { value: company.neighborhood, onChange: (e) => handleInputChange('neighborhood', e.target.value), placeholder: "Bairro" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Cidade" }), _jsx(Input, { value: company.city, onChange: (e) => handleInputChange('city', e.target.value), placeholder: "Cidade" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Estado" }), _jsx(Select, { value: company.state_id || '', onChange: (e) => handleInputChange('state_id', Number(e.target.value)), placeholder: "Selecione o estado", children: states.map((state) => (_jsx("option", { value: state.id, children: state.name }, state.id))) })] })] })] }) }), _jsx(Box, { borderWidth: "2px", borderRadius: "lg", p: 6, bg: cardBg, borderColor: borderColor, children: _jsx(VStack, { spacing: 4, align: "stretch", children: _jsx(HStack, { spacing: 4, justify: "center", children: _jsx(Button, { leftIcon: _jsx(FiSave, {}), colorScheme: "blue", onClick: handleSave, isLoading: isSaving, children: "Salvar Altera\u00E7\u00F5es" }) }) }) })] }), _jsx(Box, { display: { base: "none", xl: "block" }, borderWidth: "2px", borderRadius: "lg", w: "900px", h: "805px", position: "sticky", top: "24px", bg: cardBg, borderColor: borderColor, p: 4, children: _jsxs(VStack, { spacing: 4, align: "stretch", h: "full", children: [_jsx(Heading, { size: "md", bgGradient: titleGradient, bgClip: "text", children: "Localiza\u00E7\u00E3o no Mapa" }), _jsx(Text, { fontSize: "sm", color: useColorModeValue('gray.600', 'gray.300'), children: "Clique no mapa ou arraste o marcador para atualizar a localiza\u00E7\u00E3o" }), company && (_jsx(Box, { flex: "1", children: _jsx(GoogleMap, { company: company, states: states, latitude: company.latitude, longitude: company.longitude, height: "100%", onMapClick: async (lat, lng) => {
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
                                        } }, `${company.address}-${company.city}-${company.state_id}-${addressUpdated}`) }))] }) })] })] }));
}
export { CompanyPage as Company };
