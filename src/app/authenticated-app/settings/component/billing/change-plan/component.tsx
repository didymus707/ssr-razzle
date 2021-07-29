import React, { useState } from 'react';
import { Wrapper } from './component.styles';
import { HelpPrompt } from './components';
import { UpgradeSubscriptionStages } from './components/stages';
import { useSelector } from 'react-redux';
import { selectActiveSubscription, selectSubscriptionPlans } from '../../../selectors';
import { useHistory } from 'react-router-dom';
import { Button } from 'app/components';

export const ChangePlanComponent = (props: any) => {
  const [selectedCard, setSelectedCard] = useState<any>(props.cards?.[0]?.id);
  const [stage, setStage] = useState<'select-plan' | 'checkout'>('select-plan');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { cards, fetchSubscription, fetchWallet, fetchCards, createSubscription } = props;
  const subscription_plans = useSelector(selectSubscriptionPlans);
  const active_subscription = useSelector(selectActiveSubscription);

  const router_history = useHistory();

  return (
    <Wrapper>
      <Button
        size="sm"
        variant="ghost"
        position="absolute"
        variantColor="blue"
        leftIcon="chevron-left"
        onClick={() => router_history.goBack()}
      >
        Back
      </Button>
      <UpgradeSubscriptionStages
        {...{
          stage,
          setStage,
          subscription_plans,
          selectedPlan,
          setSelectedPlan,
          active_subscription,
          cards,
          selectedCard,
          setSelectedCard,
          fetchSubscription,
          fetchWallet,
          fetchCards,
          createSubscription,
        }}
      />
      <HelpPrompt />
    </Wrapper>
  );
};
