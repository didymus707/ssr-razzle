import React from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/core';

export const Button = React.forwardRef((props: ButtonProps, ref: any) => {
  return (
    <ChakraButton
      ref={ref}
      borderRadius="8px"
      _focus={{ boxShadow: '0' }}
      _active={{ boxShadow: '0' }}
      {...props}
    />
  );
});
