import * as React from 'react';
import { Flex } from '@chakra-ui/core';
import { Button } from 'app/components';

export function StepActionButtons({
  onConfirm,
  onCancel,
}: {
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <Flex margin="auto" width="fit-content">
      <Button
        size="sm"
        fontSize="sm"
        color="#2034c5"
        marginRight="1rem"
        background="white"
        onClick={onConfirm}
      >
        Yes, I do
      </Button>
      <Button
        size="sm"
        fontSize="sm"
        color="#bdc1dc"
        onClick={onCancel}
        background="#202e96"
        _hover={{ color: 'white', backgroundColor: '#414fbb' }}
        _active={{ color: 'white', backgroundColor: '#414fbb' }}
        _focus={{ color: 'white', backgroundColor: '#414fbb' }}
      >
        Not Now!
      </Button>
    </Flex>
  );
}
