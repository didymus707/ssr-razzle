import {
  Avatar,
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserProfile } from '../../../unauthenticated-app/authentication';
import { SidebarFooterMenuItem } from './SidebarFooterMenuItem';

export type SecondaryNavMenuProps = {
  onLogout?(): void;
  isCollapsed?: boolean;
  profile?: UserProfile | null;
  menuButtonProps?: MenuButtonProps;
};

export const SecondaryNavMenu = ({
  profile,
  onLogout,
  isCollapsed,
  menuButtonProps,
}: SecondaryNavMenuProps) => {
  return (
    <Menu>
      <MenuButton {...menuButtonProps} outline="0">
        <Stack isInline alignItems="center" justifyContent="space-between">
          <Stack isInline alignItems="center">
            <Box>
              <Avatar
                size="xs"
                color="white"
                bg="blue.500"
                name={`${profile?.first_name} ${profile?.last_name}`}
              />
            </Box>
            {!isCollapsed && (
              <Box fontSize="0.75rem" display="flex">
                <Text color="black">
                  {profile?.first_name ? `${profile?.first_name} ${profile?.last_name}` : `User name`}
                </Text>
              </Box>
            )}
          </Stack>
          {!isCollapsed && <Icon name="chevron-down" color="black" />}
        </Stack>
      </MenuButton>
      <MenuList minWidth="11rem">
        <SidebarFooterMenuItem
          as={NavLink}
          //@ts-ignore
          to="/s/settings/organization/teams"
        >
          <Stack isInline alignItems="center">
            <Icon name="team" size="1.2rem" />
            <Text fontSize="0.875rem" fontWeight="normal">
              Teams
            </Text>
          </Stack>
        </SidebarFooterMenuItem>
        <SidebarFooterMenuItem
          as={NavLink}
          //@ts-ignore
          to="/s/settings/me/profile"
        >
          <Stack isInline alignItems="center">
            <Icon name="user" size="1.2rem" />
            <Text fontSize="0.875rem" fontWeight="normal">
              Profile
            </Text>
          </Stack>
        </SidebarFooterMenuItem>
        <SidebarFooterMenuItem
          as={NavLink}
          //@ts-ignore
          to="/s/settings/organization/billing"
        >
          <Stack isInline alignItems="center">
            <Icon name="dollar" size="1.2rem" />
            <Text fontSize="0.875rem" fontWeight="normal">
              Billing
            </Text>
          </Stack>
        </SidebarFooterMenuItem>
        <SidebarFooterMenuItem
          as={NavLink}
          //@ts-ignore
          to="/s/settings/organization/payment"
        >
          <Stack isInline alignItems="center">
            <Icon name="credit-card" size="1rem" />
            <Text fontSize="0.875rem" fontWeight="normal">
              Payment
            </Text>
          </Stack>
        </SidebarFooterMenuItem>
        <SidebarFooterMenuItem onClick={onLogout}>
          <Stack isInline alignItems="center">
            <Icon name="sign-out" size="1.2rem" />
            <Text fontSize="0.875rem" fontWeight="normal">
              Sign out
            </Text>
          </Stack>
        </SidebarFooterMenuItem>
      </MenuList>
    </Menu>
  );
};
