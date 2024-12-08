import { extendTheme } from '@chakra-ui/react';
const formStyles = {
    variants: {
        floating: {
            container: {
                position: 'relative',
                _focusWithin: {
                    label: {
                        transform: 'scale(0.85) translateY(-24px)',
                        color: 'blue.500',
                    },
                },
                'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label': {
                    transform: 'scale(0.85) translateY(-24px)',
                },
                label: {
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    position: 'absolute',
                    backgroundColor: 'white',
                    pointerEvents: 'none',
                    mx: 3,
                    px: 1,
                    my: 2,
                    transformOrigin: 'left top',
                    transition: 'transform 0.2s',
                },
            },
        },
    },
};
export const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    styles: {
        global: (props) => ({
            'html, body': {
                color: props.colorMode === 'dark' ? 'white' : 'gray.900',
                bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
            },
            '#root': {
                minHeight: '100vh',
                bg: 'inherit'
            }
        }),
    },
    fonts: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
    },
    colors: {
        brand: {
            50: '#E3F2FD',
            100: '#BBDEFB',
            200: '#90CAF9',
            300: '#64B5F6',
            400: '#42A5F5',
            500: '#2196F3',
            600: '#1E88E5',
            700: '#1976D2',
            800: '#1565C0',
            900: '#0D47A1',
        },
    },
    components: {
        Form: formStyles,
    }
});
