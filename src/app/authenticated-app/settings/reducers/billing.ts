import { billingSlice } from '../slices';

export const {
  setSubscription,
  setSubscriptionPlans,
  setSubscriptionLoading,
  setSubscriptionPlansLoading,
} = billingSlice.actions;

export const billingReducer = billingSlice.reducer;
