import { buildPaymentURL, client } from '../../../../utils';
import { AppThunk } from '../../../../root';
import {
  setBanksData,
  setBankAccountsData,
  setBankAccountsCreateLoading,
  setBankAccountsLoading,
  setBankAccountsDeleteLoading,
} from '../reducers';
import { sendAmplitudeData } from '../../../../utils/amplitude';

export const fetchBanks = (): AppThunk => async dispatch => {
  const country = 'Nigeria';
  const provider = 'paystack';
  const response = await client('', {
    url: buildPaymentURL(`/bank/${provider}/${country}`),
    method: 'GET',
  });
  dispatch(setBanksData(response.data));
  return response.data;
};

export const resolveBankAccount = (values: {
  bank_code: string;
  account_number: string;
}): AppThunk => async dispatch => {
  sendAmplitudeData('resolveBankAccount');
  const provider = 'paystack';
  try {
    const response = await client('', {
      url: buildPaymentURL(`/bank/resolve/${provider}`),
      method: 'POST',
      data: values,
    });
    return response.data;
  } catch (e) {
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
    const data: { [key: string]: any } = {};
    const by_id: string[] = [];

    response.data.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });
    const { meta } = response;
    dispatch(setBankAccountsData({ data, by_id, meta }));
    dispatch(setBankAccountsLoading({ loading: true }));
    return response.data;
  } catch (e) {
    dispatch(setBankAccountsLoading({ loading: false }));
    return null;
  }
};

export const addBankAccount = (values: {
  bank_code: string;
  account_number: string;
}): AppThunk => async (dispatch, getState) => {
  sendAmplitudeData('addBankAccount');
  const provider = 'paystack';
  dispatch(setBankAccountsCreateLoading({ loading: true }));

  try {
    const response = await client('', {
      url: buildPaymentURL(`/bank_account/beneficiary/${provider}`),
      method: 'POST',
      data: values,
    });
    dispatch(setBankAccountsCreateLoading({ loading: false }));

    const {
      payments: {
        bank_accounts: { data, by_id, meta },
      },
    } = getState();

    const bank_account = response.data;
    const updated_data = { ...data, [bank_account.id]: bank_account };
    const updated_by_id = [...by_id, bank_account.id];
    dispatch(setBankAccountsData({ data: updated_data, by_id: updated_by_id, meta }));
    return response.data;
  } catch (e) {
    dispatch(setBankAccountsCreateLoading({ loading: false }));
    return null;
  }
};

export const deleteBankAccount = (bank_account_id: string): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('deleteBankAccount');
  const {
    payments: {
      bank_accounts: { data, by_id, meta },
    },
  } = getState();

  dispatch(setBankAccountsDeleteLoading({ loading: true }));
  try {
    await client('', {
      url: buildPaymentURL(`/bank_account/beneficiary/${bank_account_id}`),
      method: 'DELETE',
    });
    const updated_by_id = by_id.filter((i: string) => i !== bank_account_id);
    const updated_data = {};
    updated_by_id.forEach((i: string) => {
      // @ts-ignore
      updated_data[i] = data[i];
    });
    dispatch(setBankAccountsData({ data: updated_data, by_id: updated_by_id, meta }));
    return true;
  } catch (e) {
    dispatch(setBankAccountsDeleteLoading({ loading: false }));
    return null;
  }
};
