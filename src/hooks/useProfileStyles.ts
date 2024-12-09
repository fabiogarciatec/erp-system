import { useColorModeValue } from '@chakra-ui/react';

export function useProfileStyles() {
  return {
    colors: {
      bg: useColorModeValue('white', 'gray.800'),
      border: useColorModeValue('gray.200', 'gray.700'),
      input: useColorModeValue('white', 'gray.700'),
      inputReadOnly: useColorModeValue('gray.50', 'gray.900'),
      inputDisabled: useColorModeValue('gray.100', 'gray.700'),
      text: useColorModeValue('gray.600', 'gray.300'),
      label: useColorModeValue('gray.700', 'gray.200'),
      icon: useColorModeValue('gray.500', 'gray.400'),
      roleTag: useColorModeValue('gray.100', 'gray.700'),
      button: useColorModeValue('gray.100', 'gray.700'),
      buttonHover: useColorModeValue('gray.200', 'gray.600'),
      placeholder: useColorModeValue('gray.400', 'gray.500')
    },
    components: {
      container: {
        borderWidth: '2px',
        borderRadius: 'lg',
        p: 6,
        w: 'full'
      },
      avatar: {
        size: 'xl',
        borderRadius: 'full',
        borderWidth: '2px'
      },
      input: {
        _hover: {
          borderColor: useColorModeValue('gray.300', 'gray.600')
        },
        _placeholder: {
          color: useColorModeValue('gray.400', 'gray.500')
        }
      },
      iconButton: {
        size: 'xs',
        rounded: 'full',
        boxShadow: 'base',
        _hover: {
          transform: 'scale(1.1)',
          boxShadow: 'md'
        },
        transition: 'all 0.2s'
      },
      saveButton: {
        size: 'lg',
        boxShadow: 'base',
        px: 12,
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: 'md'
        },
        transition: 'all 0.2s'
      },
      roleTag: {
        px: 3,
        py: 1,
        rounded: 'full',
        fontSize: 'sm'
      }
    }
  };
}
