import { BoxProps, Flex, Icon, Text } from '@chakra-ui/core';
import React from 'react';

export function CIcon({ iconName, text, ...rest }: any & BoxProps ) {
  return (
    <Flex alignItems="center">
      <Icon name={iconName} size="1rem" color="#4F4F4F"/>

      <Text
        color="#828282"
        fontWeight="bold"
        fontSize=".875rem"
        marginLeft=".25rem"
        lineHeight=".875rem"
        {...rest}
      >
        {text}
      </Text>
    </Flex>
  );
}
