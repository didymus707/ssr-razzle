import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../../../root';
import { IntegrationState } from './integrations.type';
import { getSupportedChannels, getAllSupportedChannels } from '../channels'
import {
  getSupportedCountries, getRandomPhone, filterPhones, provisionPhone, getFBPages,
  choseAcctItem, getTemp, forceAdd
} from './integrations.service';

const integrationInitialState: IntegrationState = {
  channel: '',
  supported_countries: [],
  random_phone: {
    friendly_name: '',
    phone_number: '',
    capabilities: [],
    type: '',
    region: '',
    iso_country: ''
  },
  selected_phone_types: [],
  phones: [],
  use_case_data: {
    company_name: '',
    industry: '',
    role: '',
    company_size: ''
  }
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState: integrationInitialState,
  reducers: {
    setChannel(
      state,
      action: PayloadAction<{ channel: IntegrationState['channel'] }>
    ){
      const { channel } = action.payload;

      state.channel = channel;
    },
    setSupportedCountries(
      state,
      action: PayloadAction<{ supported_countries: IntegrationState['supported_countries'] }>
    ) {
      const { supported_countries } = action.payload;

      if (supported_countries && supported_countries.length > 0) {
        state.supported_countries = supported_countries;
      }
    },
    setRandomPhone(
      state,
      action: PayloadAction<{
        random_phone: IntegrationState['random_phone'];
        selected_phone_types?: IntegrationState['selected_phone_types'];
      }>
    ) {
      const { random_phone, selected_phone_types } = action.payload;

      if (random_phone) {
        state.random_phone = random_phone;
      } else {
        state.random_phone = integrationInitialState.random_phone
      }

      if (selected_phone_types) {
        state.selected_phone_types = selected_phone_types;
      }
    },
    resetRandomPhone(state){
      state.random_phone = integrationInitialState.random_phone
    },
    setPhones(
      state,
      action: PayloadAction<{ phones: IntegrationState['phones'] }>
    ) {
      const { phones } = action.payload;

      if (phones && phones.length > 0) {
        state.phones = phones;
      }
    },
    resetPhones(state) {
      state.phones = integrationInitialState.phones;
    },
    setUseCaseData(
      state,
      action: PayloadAction<{ data: IntegrationState['use_case_data'] }>
    ) {
      state.use_case_data = action.payload.data;
    },
    resetUseCaseData(state) {
      state.use_case_data = integrationInitialState.use_case_data;
    },
  }
});

export const integrationReducer = integrationSlice.reducer;

export const {
  setChannel, setSupportedCountries, setRandomPhone, resetRandomPhone,
  setPhones, resetPhones, setUseCaseData, resetUseCaseData
} = integrationSlice.actions;

export const fetchSupportedCountries = (params?: any) => async (
  dispatch: AppDispatch
) => {
  const response = await getSupportedCountries(params);
  const { supported_countries } = response.data;

  dispatch(setSupportedCountries({ supported_countries }));

  return response.data;
};

export const fetchRandomPhone = (params?: any) => async (
  dispatch: AppDispatch
) => {
  const response = await getRandomPhone(params);
  const { random_phone, subResources } = response.data;

  dispatch(setRandomPhone({ random_phone, selected_phone_types: subResources }));

  return response.data;
};

export const searchPhones = (params?: any) => async (
  dispatch: AppDispatch
) => {
  const response = await filterPhones(params);
  const { phones } = response.data;

  dispatch(setPhones({ phones }));

  return response.data;
};


export const buyPhone = (params?: any) => async (
  dispatch: AppDispatch
) => {
  const response = await provisionPhone(params);
  const { purchasedPhone } = response.data;

  if (purchasedPhone) {
    const result = await getSupportedChannels(params);
    const { supportedChannels } = result.data
    dispatch(getAllSupportedChannels({ supportedChannels }))
  }

  return response.data;
};

export const fetchFBPages = (params?: any) => async () => {
  const response = await getFBPages(params);

  return response.data;
};

export const selectAcctItem = (params?: any) => async () => {
  const response = await choseAcctItem(params);

  return response.data;
};

export const fetchTemp = (params?: any) => async () => {
  const response = await getTemp(params);

  return response.data;
};

export const forceConnect = (params?: any) => async () => {
  const response = await forceAdd(params);

  return response.data;
};
