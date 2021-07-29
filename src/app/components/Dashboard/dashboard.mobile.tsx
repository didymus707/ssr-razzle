import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Icon,
  IconButton,
  IModal,
  Stack,
  Text,
} from '@chakra-ui/core';
import * as React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Logo from '../Logo';
import { Dashboard } from './dashboard';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
} from './dashboard.sidebar';
import { DashboardLinks } from './types';
import { SimpuDashboardContainer } from './dashboard.ui';
import { TablePropertiesOptions } from '../../authenticated-app/tables';

type Props = {
  theme?: any;
  isOpen?: boolean;
  onClose(): void;
  links?: DashboardLinks[];
  openCreateTableModal?(): void;
  tables?: TablePropertiesOptions[];
  finalFocusRef?: IModal['finalFocusRef'];
  logout?: () => void;
};

const ActionItem = (props: { label: string; icon: string; onClick: () => void }) => {
  return (
    <Box
      onClick={props.onClick}
      padding="10px"
      fontSize="12px"
      display="flex"
      flexDirection="row"
      alignItems="center"
      cursor="pointer"
    >
      <Icon name={props.icon} marginRight="10px" /> {props.label}
    </Box>
  );
};

export const DashboardMobile = ({
  theme,
  links,
  isOpen,
  onClose,
  finalFocusRef,
  logout,
}: Props) => {
  const router_history = useHistory();

  const nav = (url: string) => {
    router_history.push(url);
    onClose();
  };

  return (
    <Drawer
      size="xs"
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <SimpuDashboardContainer>
          <Dashboard theme={theme}>
            <Sidebar width="100%" display="block">
              <SidebarHeader>
                <Stack isInline width="100%" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Logo />
                  </Box>
                  <Box>
                    <IconButton
                      size="xs"
                      icon="close"
                      variant="ghost"
                      onClick={onClose}
                      aria-label="close"
                    />
                  </Box>
                </Stack>
              </SidebarHeader>
              <SidebarContent
                height="calc(100vh - 60px)"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <SidebarMenu>
                  {links?.map((link, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuLink
                        //@ts-ignore
                        as={NavLink}
                        to={link.url}
                      >
                        <Stack isInline alignItems="center">
                          <Icon name={link.icon} size="1.2rem" />
                          <Text fontSize="0.875rem" fontWeight="normal">
                            {link.label}
                          </Text>
                        </Stack>
                      </SidebarMenuLink>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                <Box display="flex" flexDirection="column" padding="1.2rem 0.75rem">
                  <ActionItem
                    icon="personal"
                    label="Edit Profile"
                    onClick={() => nav('/s/settings/me/profile')}
                  />
                  <ActionItem
                    icon="team"
                    label="Manage Team"
                    onClick={() => nav('/s/settings/organization/teams')}
                  />
                  <ActionItem
                    icon="dollar"
                    label="Manage Billing"
                    onClick={() => nav('/s/settings/organization/billing')}
                  />
                  <ActionItem
                    icon="credit-card"
                    label="Cards/Beneficiaries"
                    onClick={() => nav('/s/settings/organization/payment')}
                  />
                  <ActionItem
                    icon="external-link"
                    label="Sign Out"
                    onClick={() => {
                      if (logout) {
                        logout();
                      }
                      onClose();
                    }}
                  />
                </Box>
              </SidebarContent>
            </Sidebar>
          </Dashboard>
        </SimpuDashboardContainer>
      </DrawerContent>
    </Drawer>
  );
};
