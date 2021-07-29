import { AxiosRequestConfig } from 'axios';
import { client, buildConversationUrl, loadState } from '../../../utils';

//////////////////////////////////////////////////////////////
// Channels API Integration
async function getUserChannels() {
  const response = await client('', { url: buildConversationUrl('auth/channel-accounts') });
  return response.data.credentials;
}

async function getUserChannelConnectedAccounts(channelName: string) {
  const response = await client('', {
    url: buildConversationUrl(`auth/channel-accounts/${channelName}`),
  });
  return response.data.credentials;
}

function getSupportedChannels(params?: AxiosRequestConfig['params']) {
  return client('', { url: buildConversationUrl(`channels/${params.organisation_id}`) });
}

async function fetchCredentials() {
  const response = await client('', { url: buildConversationUrl(`channels`) });
  return response.data;
}

function unlinkChannel(params?: AxiosRequestConfig['params']) {
  const { id, disconnector_id } = params;

  return client('', {
    url: buildConversationUrl(`auth/revoke/${id}`),
    method: 'POST',
    data: { disconnector_id },
  });
}

function removeCredential(params?: AxiosRequestConfig['params']) {
  const { credential_id } = params;

  return client('', {
    url: buildConversationUrl(`auth/revoke/${credential_id}`),
    method: 'PATCH',
  });
}

function fetchPotentialAccts(params?: AxiosRequestConfig['params']) {
  const { channel, ...rest } = params;
  const query = new URLSearchParams();
  Object.keys(rest).forEach(key => {
    const value = rest[key];
    value && query.append(key, key === 'phoneTypes' ? JSON.stringify(value) : value);
  });

  return client('', {
    url: buildConversationUrl(`auth/potential-accounts/${channel}?${query.toString()}`),
  });
}

function connectCredential(params?: AxiosRequestConfig['params']) {
  const { channel, ...data } = params;

  return client('', {
    method: 'POST',
    data: data ? data : null,
    url: buildConversationUrl(`auth/potential-accounts/${channel}`),
  });
}

function registerToBeNotify(params?: AxiosRequestConfig['params']) {
  const { channel, email } = params;

  return client('', {
    method: 'POST',
    data: { channel, email, type: 'notify-about-new-channel' },
    url: 'https://mailchimp-list-subscribe-app.herokuapp.com/subscribe',
  });
}

function fetchSupportedCountries() {
  return client('', {
    url: buildConversationUrl('auth/phones/supported-countries'),
  });
}

function updateChannelName(params?: AxiosRequestConfig['params']) {
  const { credential_id, platform_name } = params;

  return client('', {
    method: 'PATCH',
    data: { platform_name },
    url: buildConversationUrl(`auth/${credential_id}`),
  });
}

function useHere(params?: AxiosRequestConfig['params']) {
  const { credentialID } = params;

  return client('', {
    method: 'POST',
    url: buildConversationUrl(`auth/use-here/${credentialID}`),
  });
}

function generateQRCode(id: string) {
  const url = buildConversationUrl(`auth/channel/generateQrCode/${id}`);

  const localData = loadState();
  const headers = {} as {
    Authorization: string;
    organisationID: string;
  };
  const token = localData && localData.token;
  const { organisations, profile } = localData || { organisations: null, profile: null };
  if (token) {
    headers.Authorization = token;
  }
  if (profile || organisations) {
    // if no profile, use the organisationID of the last organization
    headers.organisationID = profile
      ? profile.organisation_id
      : organisations[organisations.length - 1].id;
  }

  return fetch(url, {
    headers,
    method: 'POST',
  });
}

export {
  useHere,
  unlinkChannel,
  getUserChannels,
  fetchCredentials,
  removeCredential,
  connectCredential,
  updateChannelName,
  registerToBeNotify,
  fetchPotentialAccts,
  getSupportedChannels,
  fetchSupportedCountries,
  getUserChannelConnectedAccounts,
  generateQRCode,
};
