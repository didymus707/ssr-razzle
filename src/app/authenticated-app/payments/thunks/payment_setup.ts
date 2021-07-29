import { buildPaymentURL, client } from '../../../../utils';
import {
  setPaymentSetupData,
  setPaymentSetupLoading,
  setPaymentSetupUpdateLoading,
} from '../reducers';
import { AppThunk } from '../../../../root';
import { sendAmplitudeData } from '../../../../utils/amplitude';

export const fetchPaymentSetup = (organization_id: string): AppThunk => async dispatch => {
  dispatch(setPaymentSetupLoading({ loading: true }));
  try {
    const response = await client('', {
      url: buildPaymentURL(`/payment_setup/${organization_id}`),
      method: 'GET',
    });
    dispatch(setPaymentSetupData(response.data));
    dispatch(setPaymentSetupLoading({ loading: false }));
  } catch (e) {
    dispatch(setPaymentSetupLoading({ loading: false }));
    return null;
  }
};

export const updatePaymentSetup = (values: { [key: string]: any }): AppThunk => async dispatch => {
  if (values?.status === 'submitted') sendAmplitudeData('submitPaymentSetup');
  else sendAmplitudeData('updatePaymentSetup');
  dispatch(setPaymentSetupUpdateLoading({ loading: true }));
  const payload: FormData = new FormData();
  Object.keys(values).forEach((key: string) => {
    payload.append(key, values[key]);
  });
  try {
    const response = await client('', {
      url: buildPaymentURL(`/payment_setup/`),
      method: 'PATCH',
      data: payload,
    });
    dispatch(setPaymentSetupData(response.data));
    dispatch(setPaymentSetupUpdateLoading({ loading: false }));
    return response.data;
  } catch (e) {
    dispatch(setPaymentSetupUpdateLoading({ loading: false }));
    return null;
  }
};
