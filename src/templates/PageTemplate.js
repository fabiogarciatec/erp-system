import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, useColorModeValue } from '@chakra-ui/react';
import { PageHeader } from '../components/PageHeader';
// Hook customizado (se necessário)
function usePageLogic() {
    // Lógica específica da página
    return {
    // Retornar estados e funções necessárias
    };
}
// Componentes internos (se necessário)
function InternalComponent() {
    return (
    // JSX do componente interno
    _jsx(_Fragment, {}));
}
// Componente principal da página
function PageNameComponent() {
    // Hooks e estados
    const bgColor = useColorModeValue('white', 'gray.50');
    // Lógica do componente
    const pageLogic = usePageLogic();
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "T\u00EDtulo da P\u00E1gina", subtitle: "Subt\u00EDtulo opcional", breadcrumbs: [
                    { label: 'Home', href: '/' },
                    { label: 'Título da Página', href: '/caminho-da-pagina' }
                ] }), _jsx(Box, { bg: bgColor, borderRadius: "lg", p: 6 })] }));
}
// Exportação - Sempre usar named export com alias se necessário
export { PageNameComponent as PageName };
