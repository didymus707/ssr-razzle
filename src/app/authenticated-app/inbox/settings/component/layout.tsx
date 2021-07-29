import { Box, Icon, LinkProps, Stack } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { BodyText, Button, PreTitle, Subtitle } from 'app/components';
import React, { ReactNode } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

export type InboxSettingsSidebarProps = {
  onClose?(): void;
  children?: ReactNode;
};

export const InboxSettingsSidebar = (props: InboxSettingsSidebarProps) => {
  const { onClose, children } = props;

  return (
    <InboxSettingsSidebarContainer>
      <Box width="305px" height="100%" py="1.5rem" pl="1rem" pr="0.875rem" bg="#f9f8fe">
        <Box pb="3rem">
          <Button onClick={onClose} variant="unstyled">
            <Stack isInline alignItems="center">
              <Icon name="inbox-close" size="1.4rem" />
              <PreTitle color="gray.700">close</PreTitle>
            </Stack>
          </Button>
        </Box>
        <PreTitle color="gray.500" pb="1.25rem">
          Settings
        </PreTitle>
        {children}
      </Box>
    </InboxSettingsSidebarContainer>
  );
};

export type InboxSettingsPanelProps = {
  children?: ReactNode;
};

export const InboxSettingsPanel = (props: InboxSettingsPanelProps) => {
  const { children } = props;

  return (
    <Box height="100%" flex={1} pt="1.5rem" px="3rem" bg="white">
      {children}
    </Box>
  );
};

export type InboxSettingsSidebarLinkProps = {
  to: string;
  icon?: string;
  children?: string | ReactNode;
} & LinkProps;

export const InboxSettingsSidebarLink = (props: InboxSettingsSidebarLinkProps) => {
  const { to, icon, children } = props;

  return (
    <NavLink to={to} className="inbox-settings-link" activeClassName="inbox-settings-link--active">
      <Stack isInline alignItems="center">
        <Icon size="1.5rem" name={icon} />
        <BodyText>{children}</BodyText>
      </Stack>
    </NavLink>
  );
};

export const PageBack = (props: {
  title: string;
  textColor?: string;
  iconColor?: string;
  onClick?(): void;
}) => {
  const history = useHistory();
  const {
    title,
    textColor = 'black',
    iconColor = 'gray.700',
    onClick = () => history.goBack(),
  } = props;

  return (
    <Box mb="2rem" pb="0.875rem" borderBottomWidth="1px">
      <Button variant="ghost" onClick={onClick}>
        <Stack isInline alignItems="center">
          <Icon name="inbox-chevron-left" size="1rem" color={iconColor} />
          <Subtitle color={textColor}>{title}</Subtitle>
        </Stack>
      </Button>
    </Box>
  );
};

const InboxSettingsSidebarContainer = styled(Box)`
  .inbox-settings-link {
    height: 40px;
    display: block;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    border-radius: 50px;
    text-decoration: none;
    margin-bottom: 0.5rem;
    background-color: transparent;
    color: #858c94;

    &:hover {
      text-decoration: none;
      background-color: #ebeef2;
    }
  }

  .inbox-settings-link--active {
    color: #3525e6;
    background-color: #ebeef2;
  }
`;
