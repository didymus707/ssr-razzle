import { createSlice } from '@reduxjs/toolkit';

const billingInitialSlice = {
  subscription: {
    data: null,
    loading: true,
  },
  subscription_plans: {
    data: {},
    by_id: [],
    loading: false,
  },
};

export const billingSlice = createSlice({
  name: 'billing',
  initialState: billingInitialSlice,
  reducers: {
    setSubscription: (state, action: any) => {
      state.subscription.data = action.payload;
    },
    setSubscriptionPlans: (state, action: any) => {
      const { data, by_id } = action.payload;
      state.subscription_plans.data = data;
      state.subscription_plans.by_id = by_id;
    },
    setSubscriptionLoading: (state, action: any) => {
      state.subscription.loading = action.payload;
    },
    setSubscriptionPlansLoading: (state, action: any) => {
      state.subscription_plans.loading = action.payload;
    },
  },
});
