import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
export function useCep({ onSuccess, onError, onComplete } = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const validateCep = (cep) => {
        // Remove caracteres não numéricos
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            throw new Error('CEP deve conter 8 dígitos');
        }
        return cleanCep;
    };
    const fetchAddress = async (cep) => {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
            throw new Error('Erro ao buscar CEP');
        }
        const data = await response.json();
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        // Garante que todos os campos estejam presentes
        return {
            cep: data.cep || '',
            logradouro: data.logradouro || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            localidade: data.localidade || '',
            uf: data.uf || '',
            ibge: data.ibge || '',
            gia: data.gia || '',
            ddd: data.ddd || '',
            siafi: data.siafi || ''
        };
    };
    const handleCepLookup = async (cep) => {
        setIsLoading(true);
        try {
            const validCep = validateCep(cep);
            const addressData = await fetchAddress(validCep);
            onSuccess?.(addressData);
            toast({
                title: 'Sucesso',
                description: 'Endereço encontrado com sucesso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            return addressData;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao buscar CEP';
            toast({
                title: 'Erro',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            if (onError && error instanceof Error) {
                onError(error);
            }
            throw error;
        }
        finally {
            setIsLoading(false);
            onComplete?.();
        }
    };
    return {
        handleCepLookup,
        isLoading
    };
}
