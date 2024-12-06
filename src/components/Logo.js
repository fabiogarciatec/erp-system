import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, useColorModeValue } from '@chakra-ui/react';
export function Logo() {
    const logoColor = useColorModeValue('#0066cc', '#4299E1');
    const subtitleColor = useColorModeValue('#666666', '#A0AEC0');
    const erpColor = useColorModeValue('#E53E3E', '#FC8181'); // Vermelho para modo claro e escuro
    return (_jsx(Box, { maxW: "360px", w: "100%", position: "relative", children: _jsxs("svg", { width: "100%", height: "100%", viewBox: "0 0 300 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet", children: [_jsxs("g", { transform: "translate(35, 20)", children: [_jsx("text", { x: "0", y: "25", fill: logoColor, style: {
                                fontSize: '41px',
                                fontWeight: 'bold',
                                fontFamily: 'Arial',
                                letterSpacing: '1px'
                            }, children: "FATEC" }), _jsx("path", { d: "M132 8 L145 8 L145 -2 L165 18 L145 35 L145 25 L132 25 Z", fill: logoColor }), _jsx("text", { x: "155", y: "25", fill: erpColor, style: {
                                fontSize: '41px',
                                fontWeight: 'bold',
                                fontFamily: 'Arial'
                            }, children: "ERP" })] }), _jsx("text", { x: "150", y: "65", textAnchor: "middle", fill: subtitleColor, style: {
                        fontSize: '17px',
                        fontFamily: 'Arial',
                        letterSpacing: '0.5px'
                    }, children: "Gest\u00E3o Empresarial Inteligente" })] }) }));
}
