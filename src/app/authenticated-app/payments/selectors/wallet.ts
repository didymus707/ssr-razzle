import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';

export const selectWalletEmail = createSelector(
  (state: RootState) => state.payments,
  payments => payments.wallet.data.email,
);

export const selectWalletID = createSelector(
  (state: RootState) => state.payments,
  payments => payments.wallet.data.id,
);

export const selectCreditBalance = createSelector(
  (state: RootState) => state.payments,
  payments => payments.wallet.data.credit_balance,
);

export const selectPaymentSetupStatus = createSelector(
  (state: RootState) => state.payments,
  payments => payments.wallet.data.payment_setup_status,
);
