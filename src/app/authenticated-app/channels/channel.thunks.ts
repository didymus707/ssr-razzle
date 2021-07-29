import { createAsyncThunk } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import { CustomerSchema } from '../inbox';
import * as channelService from './channel.service'
import { ConnectivitySchema, CredentialSchema } from './channels.types';

const customerStruct = new schema.Entity<CustomerSchema>('customers', {}, { idAttribute: 'uuid' });
const connectivityStruct = new schema.Entity<ConnectivitySchema>('connectivities', {}, { idAttribute: 'uuid' });
const credentialStruct = new schema.Entity<CredentialSchema>('credentials', {
  user: customerStruct,
  connectivities: [connectivityStruct],
}, { idAttribute: 'uuid' });

export const fetchSupportedChannels = createAsyncThunk<
any
>(
  'credentials/fetch', async () => {
    const response = await channelService.fetchCredentials();
    const normalized = normalize(response.data.credentials, [credentialStruct]);

    return normalized.entities;
  }
);

export const disconnectCredential = createAsyncThunk<
any, any
>(
  'credentials/disconnect', async (params) => {
    const response = await channelService.removeCredential(params);
    const normalized = normalize(response.data.disconnected_credential, credentialStruct);

    return normalized.entities;
  }
);

export const getPotentialAccts = createAsyncThunk<
any, any, any
>(
  'potential-accts/list', async (params) => {
    const response = await channelService.fetchPotentialAccts(params);

    return response.data;
  }
);

export const connectChannelAcct = createAsyncThunk<
any, any, any
>(
  'potential-accts/connect', async (params) => {
    const response = await channelService.connectCredential(params);

    if (!response.data.credentials) {
      return {};
    }

    const normalized = normalize(response.data.credentials, [credentialStruct]);

    return normalized.entities;
  }
);

export const getSupportedCountries = createAsyncThunk<
any
>(
  'supported-countries/list', async () => {
    const response = await channelService.fetchSupportedCountries();

    return response.data;
  }
);

export const setChannelName = createAsyncThunk<
any, any, any
>(
  'credentials/update/name', async (params) => {
    const response = await channelService.updateChannelName(params);
    const normalized = normalize(response.data.customer, customerStruct);

    return normalized.entities;
  }
);

export const submitDetailToBeNotify = createAsyncThunk<
any, any, any
>(
  'channel/notiftForm/submit', async (params) => {
    const response = await channelService.registerToBeNotify(params);

    return response;
  }
);

export const useChannelInstance = createAsyncThunk<
any, any, any
>(
  'channel/use-here', async (params) => {
    const response = await channelService.useHere(params);

    return response.data;
  }
);
