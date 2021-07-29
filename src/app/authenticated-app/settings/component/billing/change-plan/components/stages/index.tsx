import React, { useState } from 'react';
import { Box, Select, Switch } from '@chakra-ui/core/dist';
import { SelectSubscriptionPlan } from './select-plan';
import { ChangePlanStageNavigator } from '../stage-navigator';
import { CheckoutSubscriptionPlan } from './checkout';

export const UpgradeSubscriptionStages = (props: any) => {
  const [billing_period, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [billing_currency, setBillingCurrency] = useState<'ngn' | 'usd'>('ngn');

  const {
    stage,
    setStage,
    subscription_plans,
    setSelectedPlan,
    cards,
    selectedCard,
    setSelectedCard,
    fetchSubscription,
    fetchWallet,
    fetchCards,
    createSubscription,
  } = props;

  const handleCheckoutProceed = (plan: any) => {
    setSelectedPlan(plan.id);
    setStage('checkout');
  };

  const selectedPlan = subscription_plans[props.selectedPlan];

  return (
    <Box>
      <ChangePlanStageNavigator allowCheckout={!!selectedPlan} setStage={setStage} stage={stage} />
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="center"
        marginTop="10px"
        marginBottom="20px"
        fontSize="14px"
        alignItems="center"
      >
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <Box
            fontWeight={billing_period === 'monthly' ? '600' : '400'}
            color={billing_period === 'monthly' ? '#3525e6' : '#757575'}
            opacity={billing_period === 'monthly' ? 1 : 0.5}
          >
            Monthly Billing
          </Box>
          <Switch
            size="md"
            mx="10px"
            isChecked={billing_period === 'yearly'}
            onChange={(e: any) => {
              if (e.target.checked) setBillingPeriod('yearly');
              else setBillingPeriod('monthly');
            }}
          />
          <Box
            fontWeight={billing_period === 'yearly' ? '600' : '400'}
            color={billing_period === 'yearly' ? '#3525e6' : '#757575'}
            opacity={billing_period === 'yearly' ? 1 : 0.5}
          >
            Yearly Billing
          </Box>
        </Box>

        <Box marginLeft="35px">
          <Select
            size="sm"
            fontWeight="500"
            borderRadius="7.5px"
            variant="filled"
            onChange={(e: any) => setBillingCurrency(e.target.value)}
            value={billing_currency}
          >
            <option value="ngn">NGN</option>
            <option value="usd">USD</option>
          </Select>
        </Box>
      </Box>
      {stage === 'select-plan' && (
        <SelectSubscriptionPlan
          plans={Object.values(subscription_plans).filter((i: any) => i.type !== 'free')}
          billing_period={billing_period}
          billing_currency={billing_currency}
          checkout={handleCheckoutProceed}
        />
      )}
      {stage === 'checkout' && (
        <CheckoutSubscriptionPlan
          plan={selectedPlan}
          billing_period={billing_period}
          billing_currency={billing_currency}
          cards={cards}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          fetchSubscription={fetchSubscription}
          fetchWallet={fetchWallet}
          fetchCards={fetchCards}
          createSubscription={createSubscription}
        />
      )}
    </Box>
  );
};
