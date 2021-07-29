import { Box, Flex, ModalBody, Text, Tooltip, useClipboard } from '@chakra-ui/core';
import React from 'react';
import { Button, ModalContainer, ModalContainerOptions } from '../../../../components';

type Props = ModalContainerOptions & { apiKey?: string };

export const NewAPIKeyModal = (props: Props) => {
  const { isOpen, onClose, apiKey } = props;
  const { onCopy, hasCopied } = useClipboard(apiKey);

  return (
    <ModalContainer size="sm" isOpen={isOpen} onClose={onClose} title="Your new API Key">
      <ModalBody pb="2rem">
        <Box mb="2rem">
          <Text pb="0.2rem" fontWeight="500" fontSize="0.875rem">
            Key your key safe
          </Text>
          <Text fontSize="0.8rem" color="gray.600">
            Save and store this new key to a secure place, such as a password manager or secret
            store. You won't be able to see it again.
          </Text>
        </Box>
        <Tooltip
          zIndex={10000000}
          placement="right"
          aria-label="Copy API Key"
          label={hasCopied ? 'Copied API Key' : 'Copy API Key'}
        >
          <Box
            mb="2rem"
            p="0.5rem"
            bg="white"
            color="gray.600"
            cursor="pointer"
            onClick={onCopy}
            borderWidth="1px"
            borderRadius="5px"
            fontSize="0.875rem"
            wordBreak="break-word"
          >
            {apiKey}
          </Box>
        </Tooltip>
        <Flex alignItems="center" justifyContent="flex-end">
          <Button onClick={onClose} size="sm" variantColor="blue">
            Done
          </Button>
        </Flex>
      </ModalBody>
    </ModalContainer>
  );
};
