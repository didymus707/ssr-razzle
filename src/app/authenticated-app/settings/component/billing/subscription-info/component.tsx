import React from 'react';
import { Wrapper } from './component.styles';
import { Heading, Stack } from '@chakra-ui/core';
import { CurrentSubscription, AddonPrompt } from './components';
import { useSelector } from 'react-redux';
import { selectActiveSubscription, selectActiveSubscriptionPlan } from '../../../settings.reducers';

export const SubscriptionInfoComponent = () => {
  const active_subscription = useSelector(selectActiveSubscription);
  const active_plan = useSelector(selectActiveSubscriptionPlan);

  if (!active_plan) return <div />;

  return (
    <Wrapper>
      <Stack isInline alignItems="center" marginBottom="3.5rem" justifyContent="space-between">
        <Heading size="sm" color="#333333" fontWeight="semibold">
          Billing and Subscription Settings
        </Heading>
      </Stack>
      <CurrentSubscription
        // @ts-ignore
        subscription={active_subscription}
        plan={active_plan}
      />
      <AddonPrompt />
    </Wrapper>
  );
};
