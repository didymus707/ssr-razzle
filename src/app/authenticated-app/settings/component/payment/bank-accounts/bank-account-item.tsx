//@ts-nocheck
import React from 'react';
import { Box, IconButton, Text } from '@chakra-ui/core';

export const BankAccountItem = props => {
  const {
    id,
    bank_name,
    account_name,
    account_number,
    currency,
    isLoading,
    handleDeleteBankAccount,
  } = props;
  return (
    <Box className="item">
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box width="50%">
          <Text className="text-primary">{account_name}</Text>
          <Text className="text-secondary">{currency}</Text>
        </Box>

        <Box width="50%">
          <Text className="text-primary">{account_number}</Text>
          <Text className="text-secondary">{bank_name}</Text>
        </Box>
      </Box>
      <IconButton
        aria-label="delete bank account"
        icon="trash"
        color="#FE3636"
        backgroundColor="white"
        size="sm"
        fontSize="20px"
        marginRight="10px"
        isLoading={isLoading}
        onClick={() => handleDeleteBankAccount(id)}
      />
    </Box>
  );
};
