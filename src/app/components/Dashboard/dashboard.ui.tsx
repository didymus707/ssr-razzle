import { useDisclosure, Stack, Box, Icon } from '@chakra-ui/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { Dashboard } from './dashboard';
import { Content } from './dashboard.content';
import { DashboardHeader } from './dashboard.header';
import { DashboardMobile } from './dashboard.mobile';
import { simpuThemeFull } from './dashboard.theme';
import { DashboardLinks, DashboardProps } from './types';
import Logo from '../Logo';
import { Button } from '../Button';

export const SimpuDashboardContainer = styled.div`
  a {
    &.active {
      color: #3d50df !important;
      background-color: rgba(61, 80, 223, 0.06);
    }
  }
`;

const links: DashboardLinks[] = [
  { icon: 'home', label: 'Home', url: '/s/home' },
  { icon: 'mail-box', label: 'Inbox', url: '/s/inbox' },
  { icon: 'time-schedule', label: 'Marketing', url: '/s/marketing' },
  { icon: 'hamburger', label: 'Data', url: '/s/lists' },
  { icon: 'dollar', label: 'Payments', url: '/s/payments' },
  { icon: 'code', label: 'Developers', url: '/s/developers' },
];

export const SimpuDashboard = (props: DashboardProps) => {
  const { profile, tables, children, onLogout, user, onboarding_task_info, organizations } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnRef = React.useRef(null);

  const theme = simpuThemeFull;

  return (
    <>
      <Dashboard theme={theme}>
        <DashboardHeader
          onboarding_task_info={onboarding_task_info}
          profile={profile}
          user={user}
          organizations={organizations}
          logout={onLogout}
        />
        <Box
          padding="20px 10px"
          backgroundColor="rgb(246 250 253)"
          display={['block', 'block', 'none', 'none']}
        >
          <Stack width="100%" isInline alignItems="center">
            <Box>
              <Button
                size="xs"
                ref={btnRef}
                onClick={onOpen}
                variant="ghost"
                display={['block', 'block', 'none', 'none']}
              >
                <Icon name="hamburger" size="16px" />
              </Button>
            </Box>
            <Logo />
          </Stack>
        </Box>
        <Content>{children}</Content>
      </Dashboard>

      <DashboardMobile
        links={links}
        isOpen={isOpen}
        tables={tables}
        onClose={onClose}
        theme={simpuThemeFull}
        finalFocusRef={btnRef}
        logout={onLogout}
      />
    </>
  );
};
