import { buildPaymentURL, client } from '../../../../utils';
import {
  setCardFormLoading,
  setCardsLoading,
  setCards,
  setChangeDefaultCardLoading,
  setDeleteCardLoading,
  removeDeleteCardLoading,
  removeCard,
  setBanksLoading,
  setBanks,
  setBankAccountFormLoading,
  setBankAccountsLoading,
  setBankAccounts,
} from '../settings.reducers';
import { setDefaultCard } from '../../payments/reducers';

import { AppThunk } from '../../../../root';
import { sendAmplitudeData } from '../../../../utils/amplitude';

export const changeDefaultCard = (card_id: string): AppThunk => async dispatch => {
  dispatch(setChangeDefaultCardLoading({ card_id }));
  try {
    await client('', {
      url: buildPaymentURL(`/card/set_default/${card_id}`),
      method: 'POST',
    });
    dispatch(setDefaultCard(card_id));
    dispatch(setChangeDefaultCardLoading({ card_id: null }));
    return true;
  } catch (e) {
    dispatch(setChangeDefaultCardLoading({ card_id: null }));
    return null;
  }
};

export const initializeCard = (provider: string): AppThunk => async dispatch => {
  dispatch(setCardFormLoading({ loading: true }));
  try {
    const response = await client('', {
      url: buildPaymentURL(`/card/initialize/${provider}`),
      method: 'GET',
    });
    dispatch(setCardFormLoading({ loading: false }));
    return response.data;
  } catch (e) {
    dispatch(setCardFormLoading({ loading: false }));
    return null;
  }
};

export const deleteCard = (card_id: string): AppThunk => async dispatch => {
  sendAmplitudeData('deleteCard');
  dispatch(setDeleteCardLoading({ card_id }));
  try {
    await client('', {
      url: buildPaymentURL(`/card/${card_id}`),
      method: 'DELETE',
    });
    dispatch(removeDeleteCardLoading({ card_id }));
    dispatch(removeCard({ card_id }));
    return true;
  } catch (e) {
    dispatch(removeDeleteCardLoading({ card_id }));
    return null;
  }
};

export const fetchCards = (): AppThunk => async dispatch => {
  dispatch(setCardsLoading({ loading: true }));
  try {
    const response = await client('', {
      url: buildPaymentURL('/card/'),
      method: 'GET',
    });
    dispatch(setCardsLoading({ loading: false }));
    dispatch(setCards({ cards: response.data }));
    return response.data;
  } catch (e) {
    dispatch(setCardsLoading({ loading: false }));
  }
};

export const getBanks = (): AppThunk => async dispatch => {
  dispatch(setBanksLoading({ loading: true }));
  const country = 'Nigeria';
  const provider = 'paystack';
  const response = await client('', {
    url: buildPaymentURL(`/bank/${provider}/${country}`),
    method: 'GET',
  });
  dispatch(setBanks({ banks: response.data.filter((i: any) => i.currency === 'NGN') }));
  dispatch(setBanksLoading({ loading: false }));
  return response.data;
};

export const resolveBankAccount = (values: any): AppThunk => async dispatch => {
  sendAmplitudeData('resolveBankAccount');
  dispatch(setBankAccountFormLoading({ loading: true }));
  const provider = 'paystack';
  try {
    const response = await client('', {
      url: buildPaymentURL(`/bank/resolve/${provider}`),
      method: 'POST',
      data: values,
    });
    dispatch(setBankAccountFormLoading({ loading: false }));
    return response.data;
  } catch (e) {
    dispatch(setBankAccountFormLoading({ loading: false }));
    return null;
  }
};

export const fetchBankAccounts = (): AppThunk => async dispatch => {
  dispatch(setBankAccountsLoading({ loading: true }));
  try {
    const response = await client('', {
      url: buildPaymentURL(`/bank_account/beneficiary/`),
      method: 'GET',
    });
    dispatch(setBankAccounts({ bank_accounts: response.data }));
    dispatch(setBankAccountsLoading({ loading: false }));
    return response.data;
  } catch (e) {
    dispatch(setBankAccountsLoading({ loading: false }));
    return null;
  }
};
