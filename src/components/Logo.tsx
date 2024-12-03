import { Box, useColorModeValue } from '@chakra-ui/react';

export function Logo() {
  const logoColor = useColorModeValue('#0066cc', '#4299E1');
  const subtitleColor = useColorModeValue('#666666', '#A0AEC0');
  const erpColor = useColorModeValue('#E53E3E', '#FC8181'); // Vermelho para modo claro e escuro

  return (
    <Box maxW="360px" w="100%" position="relative">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(35, 20)">
          {/* FATEC */}
          <text
            x="0"
            y="25"
            fill={logoColor}
            style={{ 
              fontSize: '41px', 
              fontWeight: 'bold', 
              fontFamily: 'Arial',
              letterSpacing: '1px'
            }}
          >
            FATEC
          </text>

          {/* Seta característica */}
          <path
            d="M132 8 L145 8 L145 -2 L165 18 L145 35 L145 25 L132 25 Z"
            fill={logoColor}
          />

          {/* ERP */}
          <text
            x="155"
            y="25"
            fill={erpColor}
            style={{ 
              fontSize: '41px', 
              fontWeight: 'bold', 
              fontFamily: 'Arial'
            }}
          >
            ERP
          </text>
        </g>

        {/* Subtítulo */}
        <text
          x="150"
          y="65"
          textAnchor="middle"
          fill={subtitleColor}
          style={{ 
            fontSize: '17px', 
            fontFamily: 'Arial',
            letterSpacing: '0.5px'
          }}
        >
          Gestão Empresarial Inteligente
        </text>
      </svg>
    </Box>
  );
}
