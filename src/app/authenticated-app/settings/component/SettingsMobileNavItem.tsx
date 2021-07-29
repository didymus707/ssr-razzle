import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Stack, Text } from '@chakra-ui/core';

interface SettingsMobileNavItemProps {
  icon?: any;
  url: string;
  label?: string;
}

export function SettingsMobileNavItem({ url, icon, label }: SettingsMobileNavItemProps) {
  return (
    <NavLink
      to={url}
      activeStyle={{
        color: '#3d50df',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      }}
    >
      <Stack spacing="0" textAlign="center" alignItems="center" justifyContent="center">
        <Icon size="1.2rem" name={icon} marginBottom="0.2rem" />
        <Text fontSize="0.75rem">{label}</Text>
      </Stack>
    </NavLink>
  );
}
