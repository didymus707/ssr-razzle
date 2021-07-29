import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';

export const selectActiveSubscription = createSelector(
  (state: RootState) => state.billing,
  billing => billing.subscription.data,
);

export const selectSubscriptionPlans = createSelector(
  (state: RootState) => state.billing,
  billing => billing.subscription_plans.data,
);

export const selectActiveSubscriptionPlan = createSelector(
  selectActiveSubscription,
  selectSubscriptionPlans,
  (active_subscription, subscription_plans) => {
    // @ts-ignore
    return subscription_plans[active_subscription?.subscription_plan_id];
  },
);
