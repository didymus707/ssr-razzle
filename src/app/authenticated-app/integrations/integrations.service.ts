import { AxiosRequestConfig } from 'axios'
import { client, buildConversationUrl } from '../../../utils'

export function getSupportedCountries(params?: AxiosRequestConfig['params']) {
  return client('', { url: buildConversationUrl('phones/supported-countries') })
}

export function getRandomPhone(params?: AxiosRequestConfig['params']) {
  const { countryCode } = params;

  return client('', {
    url: buildConversationUrl('phones/random'),
    data: { countryCode },
    method: 'POST'
  });
}

export function filterPhones(params?: AxiosRequestConfig['params']) {
  const {
    inRegion, areaCode, contains, type, countryCode, country
  } = params;

  return client('', {
    url: buildConversationUrl('phones/search'),
    data: {
      inRegion, areaCode, type, contains, countryCode, country
    },
    method: 'POST'
  });
}

export function provisionPhone(params?: AxiosRequestConfig['params']) {
  const {
    useCaseData, phone, user_id, organisation_id
  } = params;

  return client('', {
    url: buildConversationUrl(`phones/buy/${organisation_id}`),
    data: { useCaseData, phone, user_id },
    method: 'POST'
  });
}

export function getFBPages(params?: AxiosRequestConfig['params']) {
  const { id } = params;

  return client('', { url: buildConversationUrl(`auth/facebook-messenger/fb-pages/${id}`) });
}

export function choseAcctItem(params?: AxiosRequestConfig['params']) {
  const { id, itemID } = params;

  return client('', {
    url: buildConversationUrl(`auth/accounts/${id}`),
    data: { itemID },
    method: 'POST'
  });
}

export function forceAdd(params?: AxiosRequestConfig['params']) {
  const { id, channel } = params;

  return client('', {
    url: buildConversationUrl(`auth/temps/${id}`),
    data: { channel },
    method: 'POST'
  });
}

export function getTemp(params?: AxiosRequestConfig['params']) {
  const { id, channel } = params;

  return client('', { url: buildConversationUrl(`auth/temps/${id}?channel=${channel}`) });
}
