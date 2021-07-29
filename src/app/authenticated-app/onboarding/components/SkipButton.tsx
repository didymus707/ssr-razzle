import * as React from 'react';
import { Button, ButtonProps } from '@chakra-ui/core';

export function SkipButton(props: { onClick: ButtonProps['onClick'] }) {
  return (
    <Button
      size="xs"
      border="none"
      color="#bdc1dc"
      height="inherit"
      variant="unstyled"
      fontSize="0.75rem"
      background="#202e96"
      marginBottom="1.5rem"
      padding="0.2rem 0.8rem"
      justifyItems="flex-end"
      onClick={props.onClick}
      _hover={{ color: 'white', backgroundColor: '#414fbb' }}
    >
      Skip this, I’ll do this later
    </Button>
  );
}
