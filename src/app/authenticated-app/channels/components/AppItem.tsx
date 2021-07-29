import { Flex, Icon, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { apps } from '../channels.data';

export function AppItem({ name: n }: { name: string }) {
  const { category, name, key, icon } = apps[n];

  return (
    <Flex
      color="#4f4f4f"
      padding=".5rem"
      borderRadius=".375rem"
      flexDirection="row"
      alignItems="center"
      border="1px solid #ddd"
    >
      <Icon name={icon || key} size="2.5rem" />

      <Stack marginLeft="1rem" spacing="0">
        <Text fontSize="0.9375rem" fontWeight={900}>{name}</Text>

        <Text fontSize="0.8125rem">{category}</Text>
      </Stack>
    </Flex>
  );
}
