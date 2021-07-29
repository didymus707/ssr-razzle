import { Box, ControlBox, PseudoBox, RadioProps, VisuallyHidden } from '@chakra-ui/core';
import React from 'react';

export const Radio = React.forwardRef((props: RadioProps, ref) => {
  const { children, size: sizeProp, isChecked, isDisabled, ...rest } = props;
  let size = '1rem';

  switch (sizeProp) {
    case 'sm':
      size = '0.75rem';
      break;
    case 'lg':
      size = '1.25rem';
      break;
    default:
      size = '1rem';
      break;
  }

  return (
    <PseudoBox
      as="label"
      display="flex"
      alignItems="center"
      _disabled={isDisabled ? { opacity: 0.5 } : {}}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
    >
      <VisuallyHidden
        //@ts-ignore
        type="radio"
        as="input"
        checked={isChecked}
        disabled={isDisabled}
        aria-checked={isChecked}
        aria-disabled={isDisabled}
        {...rest}
      />
      <ControlBox
        bg="white"
        size={size}
        border="1px"
        type="radio"
        rounded="full"
        borderColor="inherit"
        _disabled={{ opacity: 0.5 }}
        _focus={{ boxShadow: 'none' }}
        _hover={{ borderColor: 'gray.300' }}
        _checked={{ bg: 'blue.500', borderColor: 'blue.500' }}
      >
        <Box size={!!sizeProp && sizeProp === 'sm' ? '40%' : '60%'} bg="white" rounded="full" />
      </ControlBox>
      <Box pl="0.5rem">{children}</Box>
    </PseudoBox>
  );
});
