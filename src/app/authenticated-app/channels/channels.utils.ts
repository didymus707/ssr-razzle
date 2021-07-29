import { buildConversationUrl, formUrlQueryFromObject } from '../../../utils';

export const getErrorMessage = (name: string, code?: string) => {
  const messages: any = {
    600: `Failed to connect to ${name}. Please try again`,
    601: `The ${`${name} `}account has already been added by another user`,
    602: 'it seems acct has been connected before',
  };

  return messages[code || '600'];
};

export const getBtnText = (which: string) => {
  switch (which) {
    case 'messenger':
      return 'Install in 15 Mins';

    case 'twitter':
    case 'sms':
    case 'voice':
    case 'phone':
    case 'whatsapp':
      return 'Install in 5 Mins';

    case 'instagram':
      return 'Request for Access';

    default:
      return 'Coming Soon';
  }
};

export const getIntegrationUrl = ({
  key,
  channel,
  ...rest
}: {
  key: string;
  channel: string;
  organisation_id: string;
  token: string;
}) => {
  const { origin, pathname } = window.location;
  const baseUrl = origin;
  const success_url = `${baseUrl}/s/inbox/settings/channels/${key}`;
  const restOfUrl = `auth/channel/${channel}?${formUrlQueryFromObject({
    ...rest,
    success_url,
    is_redirect: true,
    failure_url: `${origin}${pathname}`,
  })}`;

  if (process.env.NODE_ENV === 'development' && channel === 'messenger') {
    return `http://localhost:5556/api/v1/${restOfUrl}`;
  }

  return buildConversationUrl(restOfUrl);
};
