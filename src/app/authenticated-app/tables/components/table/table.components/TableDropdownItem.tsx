import * as React from 'react';
import styled from '@emotion/styled';
import { TableDropdownItemProps } from '../table.types';
import { PseudoBox, Flex, Text, IconButton, Icon } from '@chakra-ui/core';

const Container = styled.div`
  .GroupDropdownItem {
    transition: opacity 0.2s ease-in;

    button {
      opacity: 0;
    }

    &:hover {
      button {
        opacity: 1;
      }
    }
  }
`;

export function TableDropdownItem({
  table,
  onClick,
  onDelete,
  isActive,
}: TableDropdownItemProps) {
  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  }

  return (
    <Container>
      <PseudoBox
        display="flex"
        paddingX="1rem"
        cursor="pointer"
        paddingY="0.4rem"
        alignItems="center"
        onClick={onClick}
        _hover={{ bg: 'gray.100' }}
        justifyContent="space-between"
        bg={isActive ? 'gray.100' : 'transparent'}
      >
        <Flex alignItems="center" flex={1}>
          <Icon size="0.75rem" name="grid" />
          <Text fontSize="12px" marginLeft="0.5rem" color="#212242">
            {table.name}
          </Text>
        </Flex>
        <IconButton
          size="xs"
          icon="delete"
          variant="ghost"
          fontSize="0.75rem"
          aria-label="delete"
          onClick={handleDelete}
        />
      </PseudoBox>
    </Container>
  );
}
