import {
  Box,
  BoxProps,
  FormControl,
  FormErrorMessage,
  FormLabel as ChakraFormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputProps as ChakraInputProps,
  InputRightElement,
} from '@chakra-ui/core';
import { FormLabelProps } from '@chakra-ui/core/dist/FormLabel';
import styled from '@emotion/styled';
import { FormikErrors } from 'formik';
import * as React from 'react';

export type InputProps = BoxProps &
  ChakraInputProps & {
    labelColor?: string;
    labelBackground?: string;
    label?: string | React.ReactNode;
    leftIcon?: React.ReactNode | string;
    rightIcon?: React.ReactNode | string;
    errorMessage?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  };

export const InputContainer = styled(Box)`
  width: 100%;
  position: relative;
`;

export const SimpuInput = React.forwardRef(
  (
    {
      id,
      type,
      name,
      size,
      label,
      value,
      onBlur,
      onFocus,
      onChange,
      onKeyDown,
      onKeyUp,
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
        <ChakraInput
          id={id}
          ref={ref}
          name={name}
          type={type}
          size={size}
          value={value}
          rounded="8px"
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyUp={onKeyUp}
          onChange={onChange}
          onKeyDown={onKeyDown}
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

export const Input = React.forwardRef((props: InputProps, ref: any) => {
  const {
    m,
    ml,
    mr,
    mb,
    mt,
    mx,
    my,
    size,
    leftIcon,
    rightIcon,
    isInvalid,
    isDisabled,
    errorMessage,
    ...rest
  } = props;
  let pl = '1rem';
  let pr = '1rem';

  switch (size) {
    case 'sm':
      pl = leftIcon ? '2rem' : '0.75rem';
      pr = rightIcon ? '2rem' : '0.75rem';
      break;
    case 'lg':
      pl = leftIcon ? '2.5rem' : '1rem';
      pr = rightIcon ? '2.5rem' : '1rem';
      break;
    default:
      pl = leftIcon ? '2.5rem' : '1rem';
      pr = rightIcon ? '2.5rem' : '1rem';
      break;
  }

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
      <InputGroup width="100%" size={size}>
        {leftIcon && <InputLeftElement>{leftIcon}</InputLeftElement>}
        <SimpuInput ref={ref} pl={pl} pr={pr} {...rest} />
        {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
      </InputGroup>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
});

export const FormLabel = (props: FormLabelProps) => {
  const { children, ...rest } = props;
  return (
    <ChakraFormLabel fontWeight="400" fontSize="0.75rem" {...rest}>
      {children}
    </ChakraFormLabel>
  );
};
