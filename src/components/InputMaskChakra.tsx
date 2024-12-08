import { Input, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface InputMaskChakraProps extends InputProps {
  mask: string;
}

export const InputMaskChakra = forwardRef<HTMLInputElement, InputMaskChakraProps>(
  ({ mask, value, onChange, ...props }, ref) => {
    const formatValue = (val: string) => {
      if (!val) return '';
      
      // Remove caracteres não numéricos
      const digits = val.replace(/\D/g, '');
      
      if (mask === '99999-999') {
        // Formata CEP
        const cep = digits.slice(0, 8);
        if (cep.length <= 5) {
          return cep;
        }
        return `${cep.slice(0, 5)}-${cep.slice(5)}`;
      }
      
      // Para outras máscaras
      let result = '';
      let maskIndex = 0;
      let valueIndex = 0;
      
      while (maskIndex < mask.length && valueIndex < digits.length) {
        if (mask[maskIndex] === '9') {
          result += digits[valueIndex];
          valueIndex++;
        } else {
          result += mask[maskIndex];
        }
        maskIndex++;
      }
      
      return result;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = formatValue(e.target.value);
      
      if (onChange) {
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue
          }
        };
        onChange(newEvent);
      }
    };

    // Formata o valor inicial se existir
    const formattedValue = value ? formatValue(value.toString()) : '';

    return (
      <Input
        ref={ref}
        value={formattedValue}
        onChange={handleChange}
        maxLength={mask.length}
        {...props}
      />
    );
  }
);

InputMaskChakra.displayName = 'InputMaskChakra';
