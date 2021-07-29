import { buildPaymentURL, client } from '../../../../utils';
import {
  setManagedAccountData,
  setManagedAccountLoading,
  setWalletData,
  setManagedAccountTransactionsLoading,
  setManagedAccountTransactionsData,
} from '../reducers';
import { AppThunk } from '../../../../root';
import { ManagedAccountTransaction, Meta } from '../payments.types';
import { sendAmplitudeData } from '../../../../utils/amplitude';

const initial_meta: Meta = {
  page: 0,
  per_page: 10,
  count_total: 0,
  page_total: 1,
  prev_page: false,
  next_page: true,
};

export const fetchManagedAccount = (): AppThunk => async dispatch => {
  dispatch(setManagedAccountLoading(true));
  try {
    const response = await client('', {
      url: buildPaymentURL(`/bank_account/managed/`),
      method: 'GET',
    });
    dispatch(setManagedAccountData({ data: response.data }));
    dispatch(setManagedAccountLoading(false));
    return response.data;
  } catch (e) {
    dispatch(setManagedAccountLoading(false));
    return null;
  }
};

export const requestCreateManagedAccount = (): AppThunk => async () => {
  try {
    const response = await client('', {
      url: buildPaymentURL('/bank_account/managed/request'),
      method: 'POST',
    });
    return response.data;
  } catch (e) {
    return null;
  }
};

export const validateCreateManagedAccount = (
  transaction_ref: string,
  otp: string,
): AppThunk => async dispatch => {
  try {
    const payload = { transaction_ref, otp };
    const response = await client('', {
      url: buildPaymentURL('/bank_account/managed/validate'),
      method: 'POST',
      data: payload,
    });

    const updated_wallet_payload = {
      payment_setup_status: 'completed',
      managed_bank_account_id: response.data['id'],
    };

    dispatch(setWalletData(updated_wallet_payload));
    dispatch(setManagedAccountData({ data: response.data }));
    return response.data;
  } catch (e) {
    return null;
  }
};

export const fetchManagedAccountTransactions = (
  page = 1,
  trx_type = 'all',
  search_query = '',
  date_range = { from: null, to: null, on: null },
): AppThunk => async dispatch => {
  dispatch(setManagedAccountTransactionsLoading(true));
  dispatch(resetManagedAccountTransactionsData());

  try {
    const params: { [key: string]: any } = {
      page,
      per_page: 15,
      query: search_query,
      trx_type,
    };

    if (date_range['from']) params['date_from'] = date_range['from'];
    if (date_range['to']) params['date_to'] = date_range['to'];
    if (date_range['on']) params['date_on'] = date_range['on'];

    const response = await client('', {
      url: buildPaymentURL(`/bank_account/managed/transactions`),
      method: 'GET',
      params,
    });

    const { meta } = response;
    const data: { [key: string]: ManagedAccountTransaction } = {};
    const by_id: string[] = [];

    response.data.forEach((i: ManagedAccountTransaction) => {
      data[i.id] = i;
      if (!by_id.includes(i.id)) by_id.push(i.id);
    });

    dispatch(setManagedAccountTransactionsData({ data, by_id, meta }));
    dispatch(setManagedAccountTransactionsLoading(false));
    return response['data'];
  } catch (e) {
    dispatch(setManagedAccountTransactionsLoading(false));
    return null;
  }
};

export const resetManagedAccountTransactionsData = (): AppThunk => async dispatch => {
  dispatch(setManagedAccountTransactionsData({ data: {}, by_id: [], meta: initial_meta }));
};

export const transferFunds = (payload: {
  account_number: string;
  bank_code: string;
  bank_name: string;
  amount: number;
  save_beneficiary: boolean;
}): AppThunk => async dispatch => {
  sendAmplitudeData('transferFunds');
  try {
    const response = await client('', {
      url: buildPaymentURL('/bank_account/managed/transfer'),
      method: 'POST',
      data: payload,
    });
    dispatch(fetchManagedAccount());
    return response.data;
  } catch (e) {
    return null;
  }
};
