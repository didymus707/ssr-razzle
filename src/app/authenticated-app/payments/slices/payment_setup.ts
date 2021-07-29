import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';

const initialSlice = {
  data: {
    id: null,
    owner_first_name: null,
    owner_last_name: null,
    owner_middle_name: null,
    owner_job_title: null,
    owner_home_address_street: null,
    owner_home_address_apartment: null,
    owner_home_address_city: null,
    owner_home_address_state: null,
    owner_phone: null,
    owner_email: null,
    owner_id_type: 'nin',
    owner_bvn: null,
    owner_nin: null,
    owner_passport_number: null,
    owner_voters_card_number: null,
    owner_drivers_license_number: null,
    owner_dob: null,
    owner_nin_doc: null,
    owner_passport_doc: null,
    owner_voters_card_doc: null,
    owner_drivers_license_doc: null,
    business_type: 'individual',
    industry: null,
    country: 'Nigeria',
    website: null,
    linkedin: null,
    instagram: null,
    twitter: null,
    facebook: null,
    phone: null,
    email: null,
    bank_account_id: null,
    bn_number: null,
    cac_doc: null,
    bn_doc: null,
    terms_accepted: false,
    status: 'pending',
    approval_status: 'pending',
    approval_comment: null,
  },
  loading: false,
  update_loading: false,
};

export const paymentSetupSlice = createSlice({
  name: 'payment_setup',
  initialState: initialSlice,
  reducers: {
    setPaymentSetupData: (state, action) => {
      const data = action.payload;
      state.data = {
        ...state.data,
        ...data,
      };
    },
    setPaymentSetupLoading: (state, action) => {
      const { loading } = action.payload;
      state.loading = loading;
    },
    setPaymentSetupUpdateLoading: (state, action) => {
      const { loading } = action.payload;
      state.update_loading = loading;
    },
  },
});

export const selectApprovalStatus = createSelector(
  (state: RootState) => state,
  state => state.payments.payment_setup.data.approval_status,
);

export const selectPaymentSetupStatus = createSelector(
  (state: RootState) => state,
  state => state.payments.wallet.data.payment_setup_status,
);
