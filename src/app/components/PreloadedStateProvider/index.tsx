import { Box, Flex, Heading, Image, Text } from '@chakra-ui/core';
import Cookie from 'js-cookie';
import * as React from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../root';
import { clearState, loadState } from '../../../utils';
import { fetchSupportedChannels } from '../../authenticated-app/channels';
import {
  fetchAudiences,
  fetchDataModels,
  fetchListFavorites,
  fetchLists,
  fetchListTrash,
  fetchResources,
  fetchSegments,
  fetchSmartLists,
} from '../../authenticated-app/lists';
import {
  fetchBankAccounts,
  fetchPaymentSetup,
  fetchWallet,
} from '../../authenticated-app/payments';
import {
  fetchAPIKeys,
  fetchCards,
  fetchOrganisationMembers,
  fetchOrganizations,
  fetchSubscription,
  fetchSubscriptionPlans,
  fetchTeams,
} from '../../authenticated-app/settings';
import {
  fetchTemplateCategories,
  fetchTemplates,
} from '../../authenticated-app/marketing/templates';
import { authLoading, fetchProfile } from '../../unauthenticated-app/authentication';
import { Button } from '../Button';
import { FullPageSpinner } from '../FullPageSpinner';
import { Props } from './types';

export const connector = connect(
  (state: RootState) => ({
    profile: state.auth.profile,
    isLoading: state.auth.loading,
  }),
  {
    fetchTeams,
    fetchLists,
    fetchCards,
    fetchWallet,
    authLoading,
    fetchProfile,
    fetchTemplates,
    fetchListTrash,
    fetchSmartLists,
    fetchBankAccounts,
    fetchListFavorites,
    fetchOrganizations,
    fetchSupportedChannels,
    fetchOrganisationMembers,
    fetchSubscription,
    fetchTemplateCategories,
    fetchSubscriptionPlans,
    fetchPaymentSetup,
    fetchAudiences,
    fetchAPIKeys,
    fetchResources,
    fetchDataModels,
    fetchSegments,
  },
);

export function ProviderComponent(props: Props) {
  const {
    children,
    isLoading,
    fetchTeams,
    fetchCards,
    fetchLists,
    fetchWallet,
    authLoading,
    fetchProfile,
    fetchListTrash,
    fetchTemplates,
    fetchSmartLists,
    fetchBankAccounts,
    fetchListFavorites,
    fetchOrganizations,
    fetchSupportedChannels,
    fetchOrganisationMembers,
    fetchSubscription,
    fetchTemplateCategories,
    fetchSubscriptionPlans,
    fetchPaymentSetup,
    fetchAudiences,
    fetchAPIKeys,
    fetchResources,
    fetchDataModels,
    fetchSegments,
  } = props;
  const [error, setError] = React.useState<boolean>(false);

  const state = loadState();

  const router_location = useLocation();

  React.useEffect(() => {
    const auth_period = Cookie.get('auth_period');
    const auth_valid = sessionStorage.getItem('auth_valid');
    if (!auth_period) fetchData();
    else if (auth_period && auth_valid) {
      fetchData();
    } else {
      clearState();
      Cookie.remove('auth_period');
      sessionStorage.removeItem('auth_valid');
      window.location.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    if (!!loadState()) {
      authLoading(true);
      try {
        // @ts-ignore
        const { organisations } = await fetchOrganizations();
        // if no profile, use the profile of the last organization
        const organisation_id = state?.profile
          ? state?.profile.organisation_id
          : organisations[organisations.length - 1].id;

        const promiseFn: {
          fn: any;
          params?: any;
          isPromise?: boolean;
        }[] = [
          { fn: fetchTemplates },
          { fn: fetchBankAccounts },
          { fn: fetchCards },
          { fn: fetchLists },
          { fn: fetchAudiences },
          { fn: fetchSmartLists },
          { fn: fetchListFavorites },
          { fn: fetchListTrash },
          { fn: fetchSubscription, params: organisation_id },
          { fn: fetchTeams, params: organisation_id },
          { fn: fetchProfile, params: organisation_id, isPromise: true },
          { fn: fetchWallet, params: organisation_id },
          { fn: fetchSubscriptionPlans },
          { fn: fetchSupportedChannels, isPromise: true },
          { fn: fetchOrganisationMembers, params: organisation_id },
          { fn: fetchTemplateCategories },
          { fn: fetchAPIKeys },
          { fn: fetchResources },
          { fn: fetchDataModels },
          { fn: fetchSegments },
        ];

        if (router_location.pathname === '/s/payments/onboarding') {
          promiseFn.push({ fn: fetchPaymentSetup, params: organisation_id, isPromise: true });
        }

        await Promise.all(
          promiseFn.map(({ fn, params, isPromise }) =>
            isPromise ? fn(params).catch((e: any) => console.log(e)) : fn(params),
          ),
        );

        setError(false);
      } catch (e) {
        console.log(e);
      }
      authLoading(false);
    }
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error && !isLoading) {
    return (
      <Flex
        height="100vh"
        textAlign="center"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Box width="100px" marginBottom="0.5rem">
          <Image src="/images/sad.png" />
        </Box>
        <Heading>oops!</Heading>
        <Text marginBottom="0.5rem">
          An error occurred <br />
          while setting up your account.
        </Text>
        <Button variantColor="blue" onClick={fetchData}>
          Try again
        </Button>
      </Flex>
    );
  }

  return <>{children}</>;
}

export const PreloadedStateProvider = connector(ProviderComponent);
