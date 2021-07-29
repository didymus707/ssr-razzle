import {
  FormControl,
  FormErrorMessage,
  FormLabel as ChakraFormLabel,
  Textarea as ChakraTextarea,
} from '@chakra-ui/core';
import * as React from 'react';
import { InputContainer, InputProps } from '../Input';

export const SimpuTextarea = React.forwardRef(
  (
    {
      id,
      type,
      name,
      size,
      label,
      value,
      onBlur,
      onChange,
      isInvalid,
      isDisabled,
      placeholder,
      labelColor = 'gray.900',
      ...props
    }: InputProps,
    ref: any,
  ) => {
    return (
      <InputContainer>
        <ChakraTextarea
          id={id}
          ref={ref}
          name={name}
          type={type}
          size={size}
          value={value}
          rounded="8px"
          onBlur={onBlur}
          onChange={onChange}
          isDisabled={isDisabled}
          placeholder={placeholder}
          backgroundColor="white"
          borderColor="gray.500"
          _disabled={{
            opacity: 0.5,
            cursor: 'not-allowed',
            borderColor: 'gray.500',
          }}
          {...props}
        />
        {label && (
          <ChakraFormLabel
            p="0 8px"
            top="-4px"
            left="16px"
            zIndex={2}
            opacity={1}
            htmlFor={id}
            rounded="8px"
            fontWeight="400"
            color={labelColor}
            fontSize="0.75rem"
            position="absolute"
            transition="all 200ms"
            backgroundColor="white"
            transform="translate3d(0, -30%, 0)"
          >
            {label}
          </ChakraFormLabel>
        )}
      </InputContainer>
    );
  },
);

export const Textarea = React.forwardRef((props: InputProps, ref: any) => {
  const { m, ml, mr, mb, mt, mx, my, isInvalid, isDisabled, errorMessage, ...rest } = props;

  return (
    <FormControl
      m={m}
      mx={mx}
      my={my}
      mb={mb}
      ml={ml}
      mr={mr}
      mt={mt}
      width="100%"
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      <SimpuTextarea ref={ref} {...rest} />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
});
