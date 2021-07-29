import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';

export const selectManagedAccount = createSelector(
  (state: RootState) => state.payments,
  payments => payments.managed_account.account.data,
);
