import React from 'react';
import { MenuItem, MenuItemProps } from '@chakra-ui/core';

export const SidebarFooterMenuItem = (props: MenuItemProps) => {
  const { children, ...rest } = props;
  return (
    <MenuItem
      _hover={{
        color: '#3d50df',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      }}
      _focus={{
        color: '#3d50df',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      }}
      _active={{
        color: '#3d50df',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      }}
      {...rest}
    >
      {children}
    </MenuItem>
  );
};
