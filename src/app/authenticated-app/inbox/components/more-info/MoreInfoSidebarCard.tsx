import { PseudoBox, PseudoBoxProps } from '@chakra-ui/core';
import React from 'react';

export const MoreInfoSidebarCard = (props: PseudoBoxProps) => {
  const { children, ...rest } = props;
  return (
    <PseudoBox
      bg="white"
      py="1.25rem"
      rounded="12px"
      style={{ mixBlendMode: 'normal' }}
      border="7px solid rgba(245, 245, 245, 0.6)"
      boxShadow="0px 18px 35px rgba(0, 0, 0, 0.13)"
      {...rest}
    >
      {children}
    </PseudoBox>
  );
};
