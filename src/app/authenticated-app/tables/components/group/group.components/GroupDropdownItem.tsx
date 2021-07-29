import { Flex, Icon, IconButton, PseudoBox, Text } from '@chakra-ui/core';
import * as React from 'react';
import styled from '@emotion/styled';
import { GroupItemProps } from '../group.types';

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

export function GroupDropdownItem({
  group,
  onEdit,
  onClick,
  isActive,
  onDelete,
}: GroupItemProps) {
  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  }

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
        className="GroupDropdownItem"
        justifyContent="space-between"
        bg={isActive ? 'gray.100' : 'transparent'}
      >
        <Flex alignItems="center" flex={1}>
          <Icon size="0.75rem" color="lightBlack" name="folder" />
          <Text fontSize="12px" marginLeft="0.5rem" color="#212242">
            {group.name}
          </Text>
        </Flex>
        {onEdit && (
          <IconButton
            size="xs"
            icon="edit"
            variant="ghost"
            aria-label="edit"
            fontSize="0.75rem"
            onClick={handleEdit}
          />
        )}
        {onDelete && (
          <IconButton
            size="xs"
            icon="delete"
            variant="ghost"
            fontSize="0.75rem"
            aria-label="delete"
            onClick={handleDelete}
          />
        )}
      </PseudoBox>
    </Container>
  );
}
