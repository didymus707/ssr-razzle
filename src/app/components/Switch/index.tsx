import React from 'react';
import { Switch as ChakraSwitch, SwitchProps } from '@chakra-ui/core';

export const Switch = (props: SwitchProps) => {
  return <ChakraSwitch color="blue" {...props} />;
};
