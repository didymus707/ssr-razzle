import { Icon, InputGroupProps } from '@chakra-ui/core';
import { Input } from 'app/components';
import * as React from 'react';
import { useSearch } from '../../../hooks';

type SearchProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  minWidth?: string;
  inputBackground?: string;
  inputFontSize?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
} & Omit<InputGroupProps, 'onChange' | 'children'>;

export function Search({
  value,
  onChange,
  placeholder,
  inputBackground,
  inputFontSize,
  inputRef,
  ...rest
}: SearchProps) {
  const { input, handleChange } = useSearch({ initialValue: value, onChange });
  return (
    <Input
      size="sm"
      type="search"
      ref={inputRef}
      value={input}
      border="none"
      borderRadius="0.25rem"
      onChange={handleChange}
      placeholder={placeholder}
      fontSize={inputFontSize || '.875rem'}
      _hover={{ backgroundColor: '#E2E8F0' }}
      background={inputBackground || '#EDF2F7'}
      leftIcon={<Icon name="search" color="#c0c3cc" />}
      _focus={{ backgroundColor: 'transparent', border: '1px solid #EEEEEE' }}
    />
  );
}
