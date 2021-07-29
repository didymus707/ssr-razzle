import { Box, Flex, Stack, useDisclosure } from '@chakra-ui/core';
import { Divider, PseudoBox } from '@chakra-ui/core/dist';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { version } from '../../../../package.json';
import { Button, ConfirmModal, ContentWrapper, XSmallText } from '../../components';
import { selectOrganisationID } from '../../unauthenticated-app/authentication';
import {
  ChangePlan,
  Organization,
  Payment,
  People,
  Profile,
  SettingsMobileNavItem,
  SubscriptionInfo,
  TeamsContainer,
  WorkSpaces,
} from './component';
import { SettingsProps } from './settings.container';
import { selectOrganisations } from './slices';

const SidebarOption = ({ label, active, onClick }: any) => {
  return (
    <PseudoBox
      fontSize="14px"
      fontWeight={active ? '600' : '400'}
      color={active ? '#333333' : '#ababab'}
      paddingY="8px"
      cursor="pointer"
      transition="all 0.1s ease-in"
      _hover={{
        color: '#333333',
      }}
      onClick={onClick}
    >
      {label}
    </PseudoBox>
  );
};

export default function Settings(props: SettingsProps) {
  const {
    user,
    match,
    team,
    teams,
    cards,
    banks,
    getBanks,
    addBankAccount,
    fetchCards,
    cards_loading,
    banks_loading,
    default_card,
    bank_accounts,
    resolveBankAccount,
    bank_account_form_loading,
    default_bank_account,
    deleteBankAccount,
    delete_bank_account_loading,
    initializeCard,
    card_form_loading,
    changeDefaultCard,
    change_default_card_loading,
    deleteCard,
    delete_card_loading,
    addTeam,
    profile,
    editTeam,
    removeTeam,
    editProfile,
    editPassword,
    fetchTeamMembers,
    createTeamMember,
    onInviteTeamMembers,
    deleteMemberInvite,
    deleteTeamMember,
    organisationMembers,
    wallet_id,
    wallet_email,
    openNoSubscriptionModal,
    // @ts-ignore
    reloadOrganization,
  } = props;

  const handleLogout = () => {
    openLogoutDialog();
  };

  const organization_settings = [
    {
      icon: 'user',
      url: `${match.url}/organization`,
      label: 'Organization',
    },
    {
      icon: 'user',
      url: `${match.url}/organization/people`,
      label: 'People',
    },
    {
      icon: 'user',
      url: `${match.url}/organization/teams`,
      label: 'Teams',
    },
    {
      icon: 'user',
      url: `${match.url}/organization/billing`,
      label: 'Billing',
    },
    {
      icon: 'credit-card',
      url: `${match.url}/organization/payment`,
      label: 'Cards/Beneficiaries',
    },
  ];

  const personal_settings = [
    {
      icon: 'user',
      url: `${match.url}/me/profile`,
      label: 'My Settings',
    },
    {
      icon: 'user',
      url: `${match.url}/me/workspaces`,
      label: 'Workspaces',
    },
    {
      icon: 'user',
      url: null,
      action: handleLogout,
      label: 'Logout',
    },
  ];

  const links = [
    {
      icon: 'user',
      url: `${match.url}/profile`,
      heading: 'Profile',
      subheading: 'Update your profile',
    },
    {
      icon: 'team',
      url: `${match.url}/teams`,
      heading: 'Teams',
      subheading: 'Setup your teams',
    },
    {
      icon: 'dollar',
      url: `${match.url}/billing`,
      heading: 'Billing',
      subheading: 'Setup your subscriptions and billing',
    },
    {
      icon: 'credit-card',
      url: `${match.url}/payment`,
      heading: 'Cards/Beneficiaries',
      subheading: 'Manage your debit cards and bank accounts',
    },
  ];

  const mobileLinks = [
    {
      icon: 'user',
      url: `${match.url}/me/profile`,
      label: 'Profile',
    },
    {
      icon: 'team',
      url: `${match.url}/organization/teams`,
      label: 'Teams',
    },
    {
      icon: 'dollar',
      url: `${match.url}/organization/billing`,
      label: 'Billing',
    },
    {
      icon: 'credit-card',
      url: `${match.url}/organization/payment`,
      label: 'Payment',
    },
  ];

  const router_history = useHistory();

  const organizations = useSelector(selectOrganisations);
  const organizationID = useSelector(selectOrganisationID);
  const currentOrganization = organizations.find((i: any) => i.id === organizationID);

  const {
    isOpen: isLogoutDialogOpen,
    onClose: closeLogoutDialog,
    onOpen: openLogoutDialog,
  } = useDisclosure();

  return (
    <>
      <ConfirmModal
        isOpen={isLogoutDialogOpen}
        onClose={closeLogoutDialog}
        title="Logout confirmation"
        onConfirm={() => {
          // @ts-ignore
          props.handleLogout();
          closeLogoutDialog();
        }}
      />
      <Flex minHeight="100vh">
        <Box
          width={'280px'}
          paddingY="0.75rem"
          backgroundColor="#fbfbfb"
          borderLeft="solid 1px rgba(0, 0, 0, 0.08)"
          display={['none', 'none', 'none', 'block']}
        >
          <Box width="100%" paddingX="40px" paddingTop="15px">
            <Button
              size="xs"
              variant="solid"
              variantColor="blue"
              leftIcon="chevron-left"
              onClick={() => router_history.push('/s/home')}
            >
              Back
            </Button>

            <Box fontWeight="600" fontSize="22px" marginTop="15px" color="#757575">
              Settings
            </Box>
          </Box>

          <Box display="flex" marginX="40px" marginY="25px">
            <Box
              fontWeight="500"
              fontSize="14px"
              textTransform="uppercase"
              marginRight="20px"
              width="-webkit-fill-available"
            >
              {currentOrganization?.name}
            </Box>
            <Divider width="100%" />
          </Box>

          <Box display="flex" flexDirection="column" paddingX="40px" marginTop="10px">
            <Box display="flex" flexDirection="column">
              {organization_settings.map((i: any, index: number) => (
                <SidebarOption
                  key={index}
                  {...i}
                  active={i.url === router_history.location.pathname}
                  onClick={() => {
                    if (i.url) router_history.push(i.url);
                    else i.action();
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box display="flex" marginX="40px" marginY="25px">
            <Box fontWeight="500" fontSize="14px" textTransform="uppercase" marginRight="20px">
              {profile?.first_name}
            </Box>
            <Divider width="100%" />
          </Box>

          <Box display="flex" flexDirection="column" paddingX="40px">
            <Box display="flex" flexDirection="column">
              {personal_settings.map((i: any, index: number) => (
                <SidebarOption
                  key={index}
                  {...i}
                  active={i.url === router_history.location.pathname}
                  onClick={() => {
                    if (i.url) router_history.push(i.url);
                    else i.action();
                  }}
                />
              ))}
            </Box>
          </Box>
          <XSmallText pt="100px" px="40px" color="gray.500">
            V {version}
          </XSmallText>
        </Box>
        <ContentWrapper
          flex={1}
          paddingTop="2rem"
          paddingBottom="2rem"
          backgroundColor="white"
          paddingX={['1rem', '1rem', '2rem', '4rem']}
        >
          <Switch>
            <Route
              path={`${match.path}/organization/teams`}
              render={routeProps => (
                <TeamsContainer
                  {...{
                    team,
                    teams,
                    profile,
                    addTeam,
                    editTeam,
                    removeTeam,
                    fetchTeamMembers,
                    createTeamMember,
                    onInviteTeamMembers,
                    organisationMembers,
                    deleteMemberInvite,
                    deleteTeamMember,
                    openNoSubscriptionModal,
                    ...routeProps,
                  }}
                />
              )}
            />
            <Route
              path={`${match.path}/me/profile`}
              render={routeProps => (
                <Profile {...{ profile, user, editProfile, editPassword, ...routeProps }} />
              )}
            />
            <Route
              path={`${match.path}/organization/billing/upgrade`}
              render={routeProps => <ChangePlan routeProps={routeProps} />}
            />
            <Route
              path={`${match.path}/organization/billing`}
              render={routeProps => <SubscriptionInfo routeProps={routeProps} />}
            />
            <Route
              path={`${match.path}/organization/payment`}
              render={() => (
                <Payment
                  {...{
                    fetchCards,
                    cards_loading,
                    changeDefaultCard,
                    change_default_card_loading,
                    deleteCard,
                    delete_card_loading,
                    initializeCard,
                    card_form_loading,
                    cards,
                    user,
                    profile,
                    default_card,
                    default_bank_account,
                    banks,
                    bank_accounts,
                    getBanks,
                    banks_loading,
                    bank_account_form_loading,
                    addBankAccount,
                    resolveBankAccount,
                    deleteBankAccount,
                    delete_bank_account_loading,
                    wallet_id,
                    wallet_email,
                  }}
                />
              )}
            />
            <Route
              path={`${match.path}/organization/people`}
              render={routeProps => <People routeProps={routeProps} />}
            />
            <Route
              exact
              path={`${match.path}/organization`}
              render={routeProps => <Organization routeProps={routeProps} />}
            />
            <Route
              path={`${match.path}/me/workspaces`}
              render={routeProps => (
                <WorkSpaces {...routeProps} reloadOrganization={reloadOrganization} />
              )}
            />
          </Switch>
        </ContentWrapper>
        <Stack
          isInline
          bottom="0"
          width="100%"
          zIndex={1000}
          spacing="14px"
          paddingX="1rem"
          position="fixed"
          paddingY="0.8rem"
          background="white"
          boxShadow="0 0px 22px rgba(0,0,0,0.1)"
          display={['flex', 'flex', 'flex', 'none']}
        >
          {mobileLinks.map((link, index) => {
            return (
              <Box key={index} width={`${100 / links.length}%`}>
                <SettingsMobileNavItem {...link} />
              </Box>
            );
          })}
        </Stack>
      </Flex>
    </>
  );
}
