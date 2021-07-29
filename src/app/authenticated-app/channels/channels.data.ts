import { ChannelDataSchema, AppSchema, ErrorModalProps } from './channels.types';

export const requestAccessUrls: any = {
  whatsapp: 'https://forms.gle/LcDebAAqEzPHcYUaA',
  instagram: 'https://forms.gle/rncDX3qxxSNzy4f77',
};

export const channelData: ChannelDataSchema[] = [
  {
    title: 'Social Channels',
    data: [
      {
        name: 'Messenger',
        which: 'messenger',
        description: 'Connect Messenger directly to Simpu, to receive DMs.',
        pathname: '/s/integrations',
      },
      {
        name: 'WhatsApp',
        which: 'whatsapp',
        description: 'Connect WhatsApp directly to Simpu, to receive DMs.',
        pathname: '/s/integrations',
      },
      {
        name: 'Instagram',
        which: 'instagram',
        description: 'Connect Instagram directly to Simpu, to receive DMs.',
        pathname: '/s/integrations',
      },
      {
        name: 'Twitter',
        which: 'twitter',
        description: 'Reply customers reaching out to you on Twitter directly from Simpu.',
      },
    ],
  },
  {
    title: 'From Simpu',
    data: [
      {
        name: 'SMS',
        which: 'sms',
        description: 'Send and receive SMS.',
        pathname: '/s/integrations',
      },
      {
        name: 'Phone Number',
        which: 'voice',
        description: 'Buy a business line for voice calls.',
        pathname: '/s/integrations',
      },
      {
        name: 'Website Live Chat',
        which: 'web-chat',
        description: 'Embed live chat into your website.',
        pathname: '/s/integrations',
      },
      {
        name: 'iOS SDK',
        which: 'ios',
        description: 'Embed live chat into your app.',
        pathname: '/s/integrations',
      },
      {
        name: 'Android SDK',
        which: 'android',
        description: 'Embed live chat into your app.',
        pathname: '/s/integrations',
      },
    ],
  },
];

export const appCategories = {
  social: 'Simpu Integration',
  fromSimpu: 'Simpu Custom Integrations',
  payment: 'Payment Integrations',
  commerce: 'eCommerce',
  bank: 'Core Banking System',
  database: 'Databases',
  crm: 'CRM/CDP',
  marketing: 'Marketing Tools',
  tag: 'Tag Managers',
};

export const apps: { [k: string]: AppSchema } = {
  whatsapp: {
    name: 'Whatsapp',
    key: 'whatsapp',
    icon: 'whatsapp',
    caption: 'Simple. Reliable. Secure',
    description:
      'With your WhatsApp connected to Simpu, you can seamlessly sync all of your chats together. \n\n With simpu, you get access to all your messages, old and new, even group messages. You can schedule messages and have them sent whenever you want. Whatsapp in Simpu gives you access to every feature whatsapp has and more.',
    category: appCategories.social,
    status: 'ready',
    isMultipleClick: true,
    previewImages: [],
    permissions: [],
  },
  twitter: {
    name: 'Twitter',
    key: 'twitter',
    status: 'ready',
    icon: 'twitter',
    caption: 'Social Networking',
    category: appCategories.social,
    description: 'Reply customers reaching out to you on Twitter directly from Simpu.',
    previewImages: [],
    permissions: [],
  },
  sms: {
    name: 'Simpu Number',
    key: 'sms',
    status: 'ready',
    icon: 'inbox-sms',
    isMultipleClick: true,
    caption: 'Simple. Reliable. Secure',
    description: 'Send and receive SMS.',
    category: appCategories.social,
    previewImages: [],
    permissions: [],
  },
  messenger: {
    name: 'Messenger',
    key: 'messenger',
    icon: 'messenger',
    caption: 'Text, Voice, & Video chat',
    description: 'Connect Messenger directly to Simpu, to receive DMs.',
    category: appCategories.social,
    status: 'ready',
    previewImages: [],
    permissions: [],
  },
  gmail: {
    name: 'Gmail',
    key: 'gmail',
    caption: 'Email',
    icon: 'gmail',
    description: 'Connect Gmail directly to Simpu, to receive emails.',
    category: appCategories.social,
    status: 'ready',
    previewImages: [],
    permissions: [],
  },
  outlook: {
    name: 'Microsoft Outlook',
    key: 'outlook',
    icon: 'outlook',
    caption: 'Email',
    description: 'Connect Outlook directly to Simpu, to receive emails.',
    category: appCategories.social,
    status: 'ready',
    previewImages: [],
    permissions: [],
  },
  instagram: {
    name: 'Instagram',
    key: 'instagram',
    icon: 'instagram',
    caption: 'Social Networking',
    description: 'Connect Instagram directly to Simpu, to receive DMs.e',
    category: appCategories.social,
    status: 'request',
    previewImages: [],
    permissions: [],
  },
  iMessage: {
    name: 'iMessage',
    key: 'iMessage',
    icon: 'iMessage',
    caption: 'Chat',
    category: appCategories.social,
    status: 'undone',
    previewImages: [],
    permissions: [],
    description: `Connect [iMessage](https://support.apple.com/en-ng/HT206906) on Simpu to collaborate with others in a conversation`,
  },
  telegram: {
    name: 'Telegram',
    key: 'telegram',
    icon: 'telegram',
    category: appCategories.social,
    status: 'undone',
    previewImages: [],
    permissions: [],
    caption: 'Fast. Secure. Powerful',
    description: `Connect [Telegram](https://telegram.org/) on Simpu to collaborate with others in a conversation`,
  },
  weChat: {
    name: 'WeChat',
    key: 'weChat',
    icon: 'weChat',
    category: appCategories.social,
    status: 'undone',
    caption: 'Simple. Reliable. Secure',
    description: `Connect [WeChat](https://www.wechat.com/) on Simpu to connect to a billion people with chats and more.`,
    previewImages: [],
    permissions: [],
  },
  'web-chat': {
    name: 'Website Live Chat',
    key: 'web-chat',
    icon: 'web-chat',
    description: 'Embed live chat into your website.',
    category: appCategories.fromSimpu,
    status: 'undone',
    previewImages: [],
    permissions: [],
  },
  ios: {
    name: 'iOS Chat SDK',
    key: 'ios',
    icon: 'ios',
    category: appCategories.fromSimpu,
    status: 'undone',
    description: `Embed live chat into your app.`,
    previewImages: [],
    permissions: [],
  },
  android: {
    name: 'Android Chat SDK',
    key: 'android',
    icon: 'android',
    category: appCategories.fromSimpu,
    status: 'undone',
    description: `Embed live chat into your app.`,
    previewImages: [],
    permissions: [],
  },
  stripe: {
    name: 'Stripe',
    key: 'stripe',
    category: appCategories.payment,
    status: 'undone',
    description: `Millions of companies of all sizes—from startups to Fortune 500s—use Stripe’s software and APIs to accept payments, send payouts, and manage their businesses online.
Connect [Stripe](https://stripe.com/) on Simpu`,
  },
  flutterwave: {
    name: 'Flutterwave',
    key: 'flutterwave',
    category: appCategories.payment,
    status: 'undone',
    description: ``,
  },
  paystack: {
    name: 'Paystack',
    key: 'paystack',
    category: appCategories.payment,
    status: 'undone',
    description: ``,
  },
  shopify: {
    name: 'Shopify',
    key: 'shopify',
    category: appCategories.commerce,
    status: 'undone',
    description: ``,
  },
  wooCommerce: {
    name: 'WooCommerce',
    key: 'wooCommerce',
    category: appCategories.commerce,
    status: 'undone',
    description: ``,
  },
  shopifyPro: {
    name: 'Shopify Pro',
    key: 'shopifyPro',
    icon: 'shopify',
    category: appCategories.commerce,
    status: 'undone',
    description: ``,
  },
  bigCommerce: {
    name: 'BigCommerce',
    key: 'bigCommerce',
    category: appCategories.commerce,
    status: 'undone',
    description: ``,
  },
  magneto: {
    name: 'Magneto',
    key: 'magneto',
    category: appCategories.commerce,
    status: 'undone',
    description: ``,
  },
  mambu: {
    name: 'Mambu',
    key: 'mambu',
    category: appCategories.bank,
    status: 'undone',
    description: ``,
  },
  temenos: {
    name: 'Temenos',
    key: 'temenos',
    category: appCategories.bank,
    status: 'undone',
    description: ``,
  },
  // finacle: {
  //   name: 'Finacle',
  //   key: 'finacle',
  //   description: ``,
  //   category: appCategories.bank,
  //   status: 'undone',
  // },
  mySql: {
    name: 'MySQL',
    key: 'mySql',
    category: appCategories.database,
    status: 'undone',
    description: ``,
  },
  postgreSql: {
    name: 'PostgreSQL',
    key: 'postgreSql',
    category: appCategories.database,
    status: 'undone',
    description: ``,
  },
  sqlServer: {
    name: 'SQL Server',
    key: 'sqlServer',
    category: appCategories.database,
    status: 'undone',
    description: ``,
  },
  redshift: {
    name: 'Redshift',
    key: 'redshift',
    category: appCategories.database,
    status: 'undone',
    description: ``,
  },
  mongoDb: {
    name: 'MongoDB',
    key: 'mongoDb',
    category: appCategories.database,
    status: 'undone',
    description: ``,
  },
  oracleDatabase: {
    name: 'Oracle Database',
    key: 'oracleDatabase',
    category: appCategories.database,
    status: 'undone',
    description: ``,
  },
  hubspot: {
    name: 'Hubspot',
    key: 'hubspot',
    category: appCategories.crm,
    status: 'undone',
    description: ``,
  },
  segment: {
    name: 'Segment',
    key: 'segment',
    category: appCategories.crm,
    status: 'undone',
    description: ``,
  },
  salesforce: {
    name: 'Salesforce',
    key: 'salesforce',
    category: appCategories.crm,
    status: 'undone',
    description: ``,
  },
  intercom: {
    name: 'Intercom',
    key: 'intercom',
    category: appCategories.marketing,
    status: 'undone',
    description: ``,
  },
  sendGrid: {
    name: 'SendGrid',
    key: 'sendGrid',
    category: appCategories.marketing,
    status: 'undone',
    description: ``,
  },
  mailchimp: {
    name: 'Mailchimp',
    key: 'mailchimp',
    category: appCategories.marketing,
    status: 'undone',
    description: ``,
  },
  // drip: {
  //   name: 'Drip',
  //   key: 'drip',
  //   description: ``,
  //   category: appCategories.marketing,
  //   status: 'undone',
  // },
  facebookLeadAds: {
    name: 'Facebook Lead Ads',
    key: 'facebookLeadAds',
    icon: 'facebook',
    category: appCategories.marketing,
    status: 'undone',
    description: ``,
  },
  twilio: {
    name: 'Twilio',
    key: 'twilio',
    category: appCategories.marketing,
    status: 'undone',
    description: ``,
  },
  braze: {
    name: 'Braze',
    key: 'braze',
    category: appCategories.marketing,
    status: 'undone',
    description: ``,
  },
  googleTag: {
    name: 'Google Tag Manager',
    key: 'googleTag',
    category: appCategories.tag,
    status: 'undone',
    description: ``,
  },
  shopifyTag: {
    name: 'Shopify Tag Integrations',
    key: 'shopifyTag',
    icon: 'shopify',
    category: appCategories.tag,
    status: 'undone',
    description: ``,
  },
};

export function getCategoryDetail(category: string, search?: string) {
  if (search) {
    return [
      {
        title: 'Search',
        items: Object.values(apps)
          .filter(({ name }) => name.toLowerCase().includes(search))
          .map(({ key }) => key),
      },
    ];
  }

  if (category === 'All') {
    return Object.values(appCategories).map(item => ({
      title: item,
      items: Object.values(apps)
        .filter(({ category }) => item === category)
        .map(({ key }) => key),
    }));
  }

  return [
    {
      title: (appCategories as any)[category],
      items: Object.values(apps)
        .filter(({ category: c }) => c === (appCategories as any)[category])
        .map(({ key }) => key),
    },
  ];
}

const errors: {
  [k: string]: Pick<ErrorModalProps, 'title' | 'description'>;
} = {
  '000003': {
    title: 'Error Creating A Channel',
    description:
      'You have reach the limit of the channels you can add. Please upgrade your account to add more channels',
  },
  '000004': {
    title: 'Error Creating A Channel',
    description: '',
  },
  '000005': {
    title: 'Error Creating A Channel',
    description: '',
  },
};

export function getErrorDetail(code: string, message?: string) {
  const description = message || errors[code]?.description;

  return { ...errors[code], description };
}

export function getErrorFromQuery(search: string) {
  const urlQuery = new URLSearchParams(search);
  const code = urlQuery.get('code') || '';
  const message = urlQuery.get('message') || '';

  return getErrorDetail(code, message);
}
