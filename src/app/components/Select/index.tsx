import React from 'react';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/core';
import { FormikErrors } from 'formik';

type SelectProps = ChakraSelectProps & {
  label?: string;
  labelColor?: string;
  errorMessage?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
};

export const SelectArrow = () => <Icon name="select-arrow-up" />;

export const SimpuSelect = (props: SelectProps) => {
  const { labelColor = 'gray.900', id, label, ...rest } = props;
  return (
    <Box width="100%" position="relative">
      <ChakraSelect
        id={id}
        rounded="8px"
        backgroundColor="white"
        borderColor="gray.500"
        _disabled={{
          opacity: 0.5,
          cursor: 'not-allowed',
          borderColor: 'gray.500',
        }}
        icon={SelectArrow}
        {...rest}
      />
      {label && (
        <FormLabel
          p="0 8px"
          top="-4px"
          left="16px"
          zIndex={2}
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
        </FormLabel>
      )}
    </Box>
  );
};

export const Select = (props: SelectProps) => {
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
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      <SimpuSelect {...rest} />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};
