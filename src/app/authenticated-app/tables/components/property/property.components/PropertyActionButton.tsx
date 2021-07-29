import * as React from 'react';
import { PseudoBox, Icon, Text } from '@chakra-ui/core';

export function PropertyActionButton(props: {
  icon?: any;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <PseudoBox
      as="button"
      width="100%"
      outline="none"
      display="flex"
      fontSize="14px"
      paddingX="1rem"
      paddingY="0.5rem"
      alignItems="center"
      onClick={props.onClick}
      _hover={{ bg: 'gray.100' }}
    >
      <Icon size="0.75rem" name={props.icon} />
      <Text fontSize="0.875rem" paddingLeft="0.5rem">
        {props.children}
      </Text>
    </PseudoBox>
  );
}
