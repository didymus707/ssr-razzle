import * as React from 'react';
import { Input, Button, Flex, ButtonProps, InputProps } from '@chakra-ui/core';
import { SearchProps } from './search.types';

export function SearchButton({ onClick, children, ...props }: ButtonProps) {
  return (
    <Button {...props} leftIcon="search" onClick={onClick}>
      {children}
    </Button>
  );
}

export function SearchInput({
  value,
  onBlur,
  onChange,
  inputRef,
  ...props
}: InputProps & { inputRef: React.Ref<HTMLInputElement> }) {
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!value) {
      onBlur && onBlur(e);
    }
  }

  return (
    <Input
      {...props}
      border={0}
      type="search"
      value={value}
      ref={inputRef}
      borderRadius={0}
      onBlur={handleBlur}
      onChange={onChange}
      placeholder="Search"
      borderBottom="1px solid"
    />
  );
}

export function Search({ value: valueProp, onChange }: SearchProps) {
  const [showInput, setShowInput] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>(valueProp || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (showInput) {
      inputRef && inputRef.current && inputRef.current.focus();
    }
  }, [showInput]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    setValue(value);
    onChange && onChange(value);
  }

  function handleShowInput() {
    setShowInput(true);
  }

  function handleHideInput() {
    setShowInput(false);
  }

  return (
    <Flex>
      {!showInput && (
        <SearchButton size="xs" variant="ghost" onClick={handleShowInput}>
          Search
        </SearchButton>
      )}
      {showInput && (
        <SearchInput
          size="sm"
          value={value}
          variant="flushed"
          inputRef={inputRef}
          onChange={handleChange}
          onBlur={handleHideInput}
          focusBorderColor="blue.400"
        />
      )}
    </Flex>
  );
}
