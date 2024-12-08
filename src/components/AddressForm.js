import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FormControl, FormLabel, Input, VStack, Button, Grid, GridItem, HStack } from '@chakra-ui/react';
import { useCep } from '../hooks/useCep';
export function AddressForm() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const { handleCepLookup, isLoading } = useCep({
        onSuccess: (data) => {
            setEndereco(data.logradouro);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setUf(data.uf);
        }
    });
    const handleCepChange = (e) => {
        const value = e.target.value;
        setCep(value);
        // Busca o endereço quando o CEP tiver 8 dígitos
        if (value.replace(/\D/g, '').length === 8) {
            handleCepLookup(value);
        }
    };
    return (_jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsx(Grid, { templateColumns: "repeat(6, 1fr)", gap: 4, children: _jsx(GridItem, { colSpan: 2, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "CEP" }), _jsxs(HStack, { children: [_jsx(Input, { value: cep, onChange: handleCepChange, maxLength: 8, placeholder: "Digite o CEP" }), _jsx(Button, { onClick: () => {
                                            if (!cep)
                                                return;
                                            // Remove caracteres não numéricos antes de enviar
                                            const cleanCep = cep.replace(/\D/g, '');
                                            handleCepLookup(cleanCep);
                                        }, isLoading: isLoading, colorScheme: "blue", size: "sm", children: "Buscar CEP" })] })] }) }) }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Endere\u00E7o" }), _jsx(Input, { value: endereco, onChange: (e) => setEndereco(e.target.value), placeholder: "Endere\u00E7o" })] }), _jsxs(Grid, { templateColumns: "repeat(6, 1fr)", gap: 4, children: [_jsx(GridItem, { colSpan: 3, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Bairro" }), _jsx(Input, { value: bairro, onChange: (e) => setBairro(e.target.value), placeholder: "Bairro" })] }) }), _jsx(GridItem, { colSpan: 2, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Cidade" }), _jsx(Input, { value: cidade, onChange: (e) => setCidade(e.target.value), placeholder: "Cidade" })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "UF" }), _jsx(Input, { value: uf, onChange: (e) => setUf(e.target.value), placeholder: "UF" })] }) })] })] }));
}
