import { Box, IconButton, Stack, Text, Tooltip } from '@chakra-ui/core';
import { format } from 'date-fns';
import React from 'react';
import { APIKey } from '../../settings.types';

export const APIKeyItem = ({
  item,
  isLoading,
  onRevokeKey,
}: {
  item: APIKey;
  isLoading?: boolean;
  onRevokeKey?(apiKey: APIKey): void;
}) => {
  return (
    <Stack
      isInline
      pt="1rem"
      spacing="1rem"
      flexWrap="wrap"
      alignItems="center"
      borderBottomWidth="1px"
    >
      <Box
        marginBottom="1rem"
        width={['calc(50%  - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}
      >
        <Text fontSize="0.875rem" color="gray.600">
          {item.key_prefix}....{item.key_postfix}
        </Text>
      </Box>
      <Box marginBottom="1rem" width={['calc(50% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}>
        <Text fontSize="0.875rem" color={!!item.revoked ? '#FE3636' : 'gray.600'}>
          {!!item.revoked ? 'Revoked' : 'Active'}
        </Text>
      </Box>
      <Box marginBottom="1rem" width={['calc(50% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}>
        <Text fontSize="0.875rem" color="gray.600">
          {format(new Date(item.created_datetime), 'MMM dd, yyyy')}
        </Text>
      </Box>
      {!item.revoked && (
        <Box
          marginBottom="1rem"
          width={['calc(50% - 1rem)', 'calc(50% - 1rem)', 'calc(25% - 1rem)']}
        >
          <Tooltip
            zIndex={10000000}
            placement="right"
            label="Revoke API Key"
            aria-label="Revoke API Key"
          >
            <IconButton
              size="sm"
              //@ts-ignore
              icon="trash"
              fontSize="20px"
              color="#FE3636"
              isLoading={isLoading}
              backgroundColor="white"
              aria-label="revoke key"
              onClick={() => onRevokeKey?.(item)}
            />
          </Tooltip>
        </Box>
      )}
    </Stack>
  );
};
