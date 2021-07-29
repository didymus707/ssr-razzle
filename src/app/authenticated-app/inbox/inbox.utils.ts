import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  isToday,
  isYesterday,
  format,
} from 'date-fns';
import emojiRegex from 'emoji-regex';
import { capitalize, isEmpty } from 'lodash';
import { loadState } from '../../../utils';
import { TablePropertiesOptions } from '../tables';
import { PropertySchema } from '../tables/components';
import { channelGroups } from './inbox.data';
import {
  AssignmentSchema,
  ContactColumnSchema,
  CustomerSchema,
  MessageSchema,
} from './inbox.types';

export function removeTemplateHtmlTags(text: string) {
  let content = text;
  content = content.includes('<span class="contact-column">')
    ? content.replace(new RegExp(`<span class="contact-column">`, 'g'), '')
    : content;
  content = content.includes('</span>') ? content.replace(new RegExp(`</span>`, 'g'), '') : content;

  return content;
}

export function aggregate(lol: any[]) {
  return lol.reduce((a, item) => {
    if (isEmpty(item)) {
      return a;
    }

    const [payload, meta] = item;
    const [type] = Object.keys(payload);
    let value = payload[type];

    if (isEmpty(value)) {
      return a;
    }

    if (!a[type]) {
      a[type] = [];
    }

    if (meta && !Array.isArray(value)) {
      value = { ...meta, ...value };
    }

    a[type] = a[type].concat(value);

    return a;
  }, {});
}

export const dAttachment = (attachments: any, message_id: string) => {
  const pAttachment: any[] = [];

  (attachments || []).forEach((item: any, index: number) => {
    const { data: attachmentData, ...attachment } = item || {};
    const id = attachment.id || `${index}-${message_id}`;

    pAttachment.push([{ attachmentData }, { attachment_id: id }]);
    pAttachment.push([{ attachment }, { id, message_id }]);
  });

  return pAttachment;
};

export function destrutureMessage(params: any = {}) {
  const {
    attachments: as,
    meta: messageMeta,
    author,
    notification,
    notifications,
    ...message
  } = params;
  const attachments = dAttachment(as, message.uuid);
  const { userInfo, ...inboxUser } = author || {};
  const customer = inboxUser.is_customer ? userInfo : null;

  return [
    ...attachments,
    [{ messageMeta }, { message_id: message.uuid }],
    [{ notification }],
    [{ notification: notifications || [] }],
    [{ message }],
    [{ inboxUser }],
    [{ customer }],
  ];
}

export function destructureAssignment(params: any) {
  const { notes: note, ...assignment } = params;

  return [[{ note }], [{ assignment }]];
}

export function dContactList(params: any = {}) {
  const { columns, ...contact } = params;

  return [[{ column: columns }, { contact_id: contact.id }], [{ contact }]];
}

export function destructureThread(params: any) {
  const {
    sender,
    receiver: r,
    lastMessage,
    addressBookDetail,
    contactDetail,
    assignments,
    ...thread
  } = params;

  const assignment = assignments?.map((item: any) => destructureAssignment(item))?.flat() || [];
  const message = destrutureMessage(lastMessage);
  const { userDetail, ...receiver } = r || {};
  const { columns, ...contact } = contactDetail || {};

  return [
    ...assignment,
    ...message,
    [{ customer: sender }],
    [{ customer: userDetail }],
    [{ credential: receiver }],
    [{ column: columns }, { contact_id: contact.id }],
    [{ addressBook: addressBookDetail }],
    [{ contact }],
    [{ thread }, { last_message_id: lastMessage?.uuid }],
  ];
}

export function destructureThreads(params: any[]) {
  return params.map(item => destructureThread(item)).flat();
}

export function extractor(fn: any, payload: any) {
  return aggregate(fn(payload));
}

export const threadSorter = (a: string = '', b: string) => {
  const createdA = a.toUpperCase();
  const createdB = b && b.toUpperCase();
  if (createdA > createdB) {
    return -1;
  }
  if (createdA < createdB) {
    return 1;
  }

  // createdDatetime must be equal
  return 0;
};

export const getChannelComposeRules = (channel?: string) => {
  if (!channel) {
    return null;
  }

  const rules: {
    [key: string]: {
      fileType?: string;
      multiple: boolean;
      meta: {
        [key: string]: {
          size: number;
          duration?: number;
        };
      };
    };
  } = {
    twitter: {
      fileType: 'image/*, video/*',
      multiple: false,
      meta: {
        video: {
          size: 536870912,
          duration: 260,
        },
        image: {
          size: 3072000,
        },
      },
    },
    messenger: {
      multiple: false,
      meta: {
        default: {
          size: 26214400,
          duration: Infinity,
        },
      },
    },
    whatsapp: {
      multiple: false,
      meta: {
        default: {
          size: 26214400,
          duration: Infinity,
        },
      },
    },
    whatsappWeb: {
      multiple: false,
      meta: {
        default: {
          size: 26214400,
          duration: Infinity,
        },
      },
    },
    email: {
      multiple: true,
      meta: {
        default: {
          size: 26214400,
          duration: Infinity,
        },
      },
    },
  };

  return rules[channel] || rules.twitter;
};

export const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatTime = (time: Date): any => {
  const now = new Date();
  switch (true) {
    case differenceInSeconds(now, time) < 60:
      return 'Just Now';
    case differenceInMinutes(now, time) < 60:
      return `${differenceInMinutes(now, time)}m`;
    case differenceInHours(now, time) < 24:
      return `${differenceInHours(now, time)}h`;
    case differenceInDays(now, time) < 7:
      return `${differenceInDays(now, time)}d`;
    case differenceInWeeks(now, time) < 4:
      return `${differenceInWeeks(now, time)}w`;
    case differenceInMonths(now, time) < 12:
      return `${differenceInMonths(now, time)} mon`;
    default:
      return `${differenceInYears(now, time)}y`;
  }
};

export const formatMessageDateTime = (time: Date) => {
  const now = new Date();
  switch (true) {
    case differenceInSeconds(now, time) < 60:
      return 'a few seconds ago';
    case isToday(time):
      return format(time, 'hh:mm a');
    case isYesterday(time):
      return `Yesterday, ${format(time, 'hh:mm a')}`;
    case differenceInDays(now, time) < 7:
      return format(time, 'eee, hh:mm a ');
    case differenceInYears(now, time) === 0:
      return format(time, 'dd MMM hh:mm a');
    default:
      return format(time, 'dd MMM yyyy hh:mm a');
  }
};

export const parseTemplate = (
  template: string,
  contactTable?: TablePropertiesOptions,
  contact?: any,
) => {
  let content = template;
  contactTable &&
    contactTable.columns.forEach(({ name, id }) => {
      if (id) {
        content = content.replace(
          new RegExp(`{{${name}}}`, 'g'),
          (contact && `<span class="contact-column">${contact[id]}</span>`) || '',
        );
      }
    });

  return content.trim();
};

export const formatToCurrency = (amount: number) => {
  const valueDisplay = (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return valueDisplay.substr(1, valueDisplay.length);
};

const regex = emojiRegex();
export const isOnlyEmoji = (str: string) => {
  if (!str) {
    return false;
  }

  const result = str.replace(new RegExp(regex, 'g'), '').trim();

  return !result.length;
};

export const getFlagEmoji = (key: string) => {
  const flagEmojis: { [v: string]: string } = {
    AD: '🇦🇩',
    AE: '🇦🇪',
    AF: '🇦🇫',
    AG: '🇦🇬',
    AI: '🇦🇮',
    AL: '🇦🇱',
    AM: '🇦🇲',
    AO: '🇦🇴',
    AQ: '🇦🇶',
    AR: '🇦🇷',
    AS: '🇦🇸',
    AT: '🇦🇹',
    AU: '🇦🇺',
    AW: '🇦🇼',
    AX: '🇦🇽',
    AZ: '🇦🇿',
    BA: '🇧🇦',
    BB: '🇧🇧',
    BD: '🇧🇩',
    BE: '🇧🇪',
    BF: '🇧🇫',
    BG: '🇧🇬',
    BH: '🇧🇭',
    BI: '🇧🇮',
    BJ: '🇧🇯',
    BL: '🇧🇱',
    BM: '🇧🇲',
    BN: '🇧🇳',
    BO: '🇧🇴',
    BQ: '🇧🇶',
    BR: '🇧🇷',
    BS: '🇧🇸',
    BT: '🇧🇹',
    BV: '🇧🇻',
    BW: '🇧🇼',
    BY: '🇧🇾',
    BZ: '🇧🇿',
    CA: '🇨🇦',
    CC: '🇨🇨',
    CD: '🇨🇩',
    CF: '🇨🇫',
    CG: '🇨🇬',
    CH: '🇨🇭',
    CI: '🇨🇮',
    CK: '🇨🇰',
    CL: '🇨🇱',
    CM: '🇨🇲',
    CN: '🇨🇳',
    CO: '🇨🇴',
    CR: '🇨🇷',
    CU: '🇨🇺',
    CV: '🇨🇻',
    CW: '🇨🇼',
    CX: '🇨🇽',
    CY: '🇨🇾',
    CZ: '🇨🇿',
    DE: '🇩🇪',
    DJ: '🇩🇯',
    DK: '🇩🇰',
    DM: '🇩🇲',
    DO: '🇩🇴',
    DZ: '🇩🇿',
    EC: '🇪🇨',
    EE: '🇪🇪',
    EG: '🇪🇬',
    EH: '🇪🇭',
    ER: '🇪🇷',
    ES: '🇪🇸',
    ET: '🇪🇹',
    FI: '🇫🇮',
    FJ: '🇫🇯',
    FK: '🇫🇰',
    FM: '🇫🇲',
    FO: '🇫🇴',
    FR: '🇫🇷',
    GA: '🇬🇦',
    GB: '🇬🇧',
    GD: '🇬🇩',
    GE: '🇬🇪',
    GF: '🇬🇫',
    GG: '🇬🇬',
    GH: '🇬🇭',
    GI: '🇬🇮',
    GL: '🇬🇱',
    GM: '🇬🇲',
    GN: '🇬🇳',
    GP: '🇬🇵',
    GQ: '🇬🇶',
    GR: '🇬🇷',
    GS: '🇬🇸',
    GT: '🇬🇹',
    GU: '🇬🇺',
    GW: '🇬🇼',
    GY: '🇬🇾',
    HK: '🇭🇰',
    HM: '🇭🇲',
    HN: '🇭🇳',
    HR: '🇭🇷',
    HT: '🇭🇹',
    HU: '🇭🇺',
    ID: '🇮🇩',
    IE: '🇮🇪',
    IL: '🇮🇱',
    IM: '🇮🇲',
    IN: '🇮🇳',
    IO: '🇮🇴',
    IQ: '🇮🇶',
    IR: '🇮🇷',
    IS: '🇮🇸',
    IT: '🇮🇹',
    JE: '🇯🇪',
    JM: '🇯🇲',
    JO: '🇯🇴',
    JP: '🇯🇵',
    KE: '🇰🇪',
    KG: '🇰🇬',
    KH: '🇰🇭',
    KI: '🇰🇮',
    KM: '🇰🇲',
    KN: '🇰🇳',
    KP: '🇰🇵',
    KR: '🇰🇷',
    KW: '🇰🇼',
    KY: '🇰🇾',
    KZ: '🇰🇿',
    LA: '🇱🇦',
    LB: '🇱🇧',
    LC: '🇱🇨',
    LI: '🇱🇮',
    LK: '🇱🇰',
    LR: '🇱🇷',
    LS: '🇱🇸',
    LT: '🇱🇹',
    LU: '🇱🇺',
    LV: '🇱🇻',
    LY: '🇱🇾',
    MA: '🇲🇦',
    MC: '🇲🇨',
    MD: '🇲🇩',
    ME: '🇲🇪',
    MF: '🇲🇫',
    MG: '🇲🇬',
    MH: '🇲🇭',
    MK: '🇲🇰',
    ML: '🇲🇱',
    MM: '🇲🇲',
    MN: '🇲🇳',
    MO: '🇲🇴',
    MP: '🇲🇵',
    MQ: '🇲🇶',
    MR: '🇲🇷',
    MS: '🇲🇸',
    MT: '🇲🇹',
    MU: '🇲🇺',
    MV: '🇲🇻',
    MW: '🇲🇼',
    MX: '🇲🇽',
    MY: '🇲🇾',
    MZ: '🇲🇿',
    NA: '🇳🇦',
    NC: '🇳🇨',
    NE: '🇳🇪',
    NF: '🇳🇫',
    NG: '🇳🇬',
    NI: '🇳🇮',
    NL: '🇳🇱',
    NO: '🇳🇴',
    NP: '🇳🇵',
    NR: '🇳🇷',
    NU: '🇳🇺',
    NZ: '🇳🇿',
    OM: '🇴🇲',
    PA: '🇵🇦',
    PE: '🇵🇪',
    PF: '🇵🇫',
    PG: '🇵🇬',
    PH: '🇵🇭',
    PK: '🇵🇰',
    PL: '🇵🇱',
    PM: '🇵🇲',
    PN: '🇵🇳',
    PR: '🇵🇷',
    PS: '🇵🇸',
    PT: '🇵🇹',
    PW: '🇵🇼',
    PY: '🇵🇾',
    QA: '🇶🇦',
    RE: '🇷🇪',
    RO: '🇷🇴',
    RS: '🇷🇸',
    RU: '🇷🇺',
    RW: '🇷🇼',
    SA: '🇸🇦',
    SB: '🇸🇧',
    SC: '🇸🇨',
    SD: '🇸🇩',
    SE: '🇸🇪',
    SG: '🇸🇬',
    SH: '🇸🇭',
    SI: '🇸🇮',
    SJ: '🇸🇯',
    SK: '🇸🇰',
    SL: '🇸🇱',
    SM: '🇸🇲',
    SN: '🇸🇳',
    SO: '🇸🇴',
    SR: '🇸🇷',
    SS: '🇸🇸',
    ST: '🇸🇹',
    SV: '🇸🇻',
    SX: '🇸🇽',
    SY: '🇸🇾',
    SZ: '🇸🇿',
    TC: '🇹🇨',
    TD: '🇹🇩',
    TF: '🇹🇫',
    TG: '🇹🇬',
    TH: '🇹🇭',
    TJ: '🇹🇯',
    TK: '🇹🇰',
    TL: '🇹🇱',
    TM: '🇹🇲',
    TN: '🇹🇳',
    TO: '🇹🇴',
    TR: '🇹🇷',
    TT: '🇹🇹',
    TV: '🇹🇻',
    TW: '🇹🇼',
    TZ: '🇹🇿',
    UA: '🇺🇦',
    UG: '🇺🇬',
    UM: '🇺🇲',
    US: '🇺🇸',
    UY: '🇺🇾',
    UZ: '🇺🇿',
    VA: '🇻🇦',
    VC: '🇻🇨',
    VE: '🇻🇪',
    VG: '🇻🇬',
    VI: '🇻🇮',
    VN: '🇻🇳',
    VU: '🇻🇺',
    WF: '🇼🇫',
    WS: '🇼🇸',
    XK: '🇽🇰',
    YE: '🇾🇪',
    YT: '🇾🇹',
    ZA: '🇿🇦',
    ZM: '🇿🇲',
  };

  return flagEmojis[key?.toUpperCase()] || '🏳️';
};

export function getDefaultConversationData(
  id?: string,
): {
  assignments: AssignmentSchema[];
  messages: {
    scrollTop: number;
    data: MessageSchema[];
    status: string;
    unreadCount: number;
    firstUnreadMessgeID: string | null;
  };
} {
  let scrollTop = 0;
  if (id) {
    const currentLocalState = loadState();
    scrollTop = (currentLocalState?.scrollMemory && currentLocalState.scrollMemory[id]) || 0;
  }

  return {
    assignments: [],
    messages: {
      scrollTop,
      data: [],
      status: 'none',
      unreadCount: 0,
      firstUnreadMessgeID: null,
    },
  };
}

export function getChannelGroupName(channel: string) {
  const group = channelGroups.find(({ channels }) => channels.includes(channel));

  return (group && group.name) || channel;
}

export function transformSenderToContact(table: TablePropertiesOptions, sender: CustomerSchema) {
  const columns = [...table.columns];
  let isChannelUsed = false;
  const { platform_name, platform_nick, email, channel: c } = sender;
  const channel = getChannelGroupName(c);

  const transformedData: any = columns.reduce((acc, { id, name }) => {
    let item = '';

    if (name === 'name') {
      item = platform_name || '';
    } else if (name === 'email') {
      item = email || '';
    } else if (name === channel) {
      item = platform_nick || platform_name || '';
      isChannelUsed = true;
    }

    return { ...acc, [id || '']: item };
  }, {});

  if (!isChannelUsed) {
    columns.push({
      hidden: false,
      id: 'unknown',
      label: capitalize(channel),
      name: channel,
      type: 'TEXT',
    });
    transformedData.unknown = platform_nick || platform_name || '';
  }

  return [columns, transformedData];
}

export function sortColumns(
  columns: PropertySchema[],
  contact: Omit<ContactColumnSchema, 'contact_id'>,
) {
  const result: (PropertySchema & { uid?: string | number })[] = [];
  let index = 0;
  columns.forEach(item => {
    const formattedItem: PropertySchema & { uid?: string | number } = { uid: item.id, ...item };
    if (item && contact && contact[item.id || '-1'] && contact[item.id || '-1'] !== '-') {
      result.unshift(formattedItem);
      index += 1;
    } else {
      result.push(formattedItem);
    }
  });

  return [result, index];
}

export function getUnknownColumnID(columns: any[], unknownColumn: any) {
  const filteredColumns = columns.filter(
    ({ hidden, label, name, type }) =>
      unknownColumn.hidden === hidden &&
      unknownColumn.label === label &&
      unknownColumn.name === name &&
      unknownColumn.type === type,
  );

  if (filteredColumns.length === 1) {
    return filteredColumns[0]?.id;
  }

  return filteredColumns.reduce((acc, item) => {
    return acc >= item?.id ? acc : item?.id;
  }, null);
}

export function mergeContact(transformedContact: any, contact: any, tableColumn: any[]) {
  const nameID = tableColumn.find((item: any) => item.name === 'name')?.id;

  const mergedContact = Object.keys(transformedContact).reduce((acc: any, itemID) => {
    if (String(itemID) === String(nameID)) {
      acc[nameID] =
        (contact && contact[nameID]) || (transformedContact && transformedContact[nameID]) || '';
    } else {
      acc[itemID] =
        (transformedContact && transformedContact[itemID]) || (contact && contact[itemID]) || '';
    }
    return acc;
  }, {});

  return mergedContact;
}
