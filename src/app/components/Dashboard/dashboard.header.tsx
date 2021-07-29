import * as React from 'react';
import { DashboardHeaderWrapper as Wrapper } from './dashboard.header.styles';
import { Box, BoxProps, Image, Divider, Avatar, Icon } from '@chakra-ui/core';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { DashboardSideSheet } from './dashboard.sidesheet';
import { OnboardingTasksInfo, User, UserProfile } from '../../unauthenticated-app/authentication';
import { Organization } from '../../authenticated-app/settings/settings.types';
import { HeadwayWidget } from '../HeadwayWidget';

type Props = {
  profile?: UserProfile | null;
  user?: User | null;
  organizations: Organization[];
  logout?(): void;
  onboarding_task_info: OnboardingTasksInfo;
} & BoxProps;

const links = [
  { label: 'Dashboard', url: '/s/home' },
  { label: 'Inbox', url: '/s/inbox' },
  { label: 'Marketing', url: '/s/marketing' },
  { label: 'Data', url: '/s/lists' },
  { label: 'Payments', url: '/s/payments' },
  { label: 'Developers', url: '/s/developers' },
];

export const DashboardHeader = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const router_location = useLocation();

  const { profile, user, logout, onboarding_task_info, organizations } = props;

  const closeDialog = () => {
    setShowDialog(false);
  };

  const show_header = router_location.pathname !== '/s/payments/onboarding';

  return (
    <>
      {show_header && (
        <Wrapper>
          <div className="section">
            <NavLink to="/s/home">
              <Image className="simpu-logo" src="/images/logo.svg" />
            </NavLink>
            <div className="nav-items">
              {links.map((link: any, index: number) => (
                <Box display="flex" key={index}>
                  <NavLink to={link.url}>
                    <div
                      className={`item ${router_location.pathname.includes(link.url) && 'active'}`}
                    >
                      {link.label}
                    </div>
                  </NavLink>
                  {index === 3 && (
                    <Divider
                      orientation="vertical"
                      color="#FFFFFF"
                      height="20px"
                      style={{
                        opacity: 0.3,
                      }}
                    />
                  )}
                </Box>
              ))}
            </div>
          </div>
          <div className="section">
            <HeadwayWidget />
            <Box
              display="flex"
              alignItems="center"
              cursor="pointer"
              onClick={() => setShowDialog(!showDialog)}
            >
              <Avatar
                name={`${profile?.first_name} ${profile?.last_name}`}
                size="sm"
                marginRight="7px"
                color="white"
              />
              <Icon name="chevron-down" size="20px" />
            </Box>
          </div>
        </Wrapper>
      )}

      <DashboardSideSheet
        onboarding_task_info={onboarding_task_info}
        user={user}
        profile={profile}
        logout={logout}
        isOpen={showDialog}
        close={closeDialog}
        organizations={organizations}
      />
    </>
  );
};
