import { endOfYear } from 'date-fns';
import { v4 as uuidV4 } from 'uuid';
import { FilterTypeOptions } from '.';
import {
  AssignmentSchema,
  AttachmentSchema,
  Channel,
  CustomerSchema,
  InboxUserSchema,
  MessageSchema,
  NoteSchema,
  NotificationSchema,
  PaymentRequestItemSchema,
  PaymentRequestSchema,
  PlatformContactSchema,
  ThreadSchema,
} from './inbox.types';

export const INITIAL_PAYMENT_REQUEST_ITEM: PaymentRequestItemSchema = {
  name: '',
  amount: 0,
  quantity: 1,
  uuid: uuidV4(),
  description: '',
};

export const INITIAL_PAYMENT_REQUEST: PaymentRequestSchema = {
  currency: 'NGN',
  invoice_number: '',
  provider: 'onepipe',
  expiry_date: endOfYear(new Date()).getTime(),
  items: [INITIAL_PAYMENT_REQUEST_ITEM],
};

export const channelGroups = [
  { name: 'phone', channels: ['sms'] },
  { name: 'whatsapp', channels: ['whatsapp', 'whatsappWeb'] },
];

export const INBOX_INIT: {
  thread: ThreadSchema;
  assignment: AssignmentSchema;
  note: NoteSchema;
  inboxUser: InboxUserSchema;
  customer: CustomerSchema;
  attachment: AttachmentSchema;
  message: MessageSchema;
  notification: NotificationSchema;
  platformContact: PlatformContactSchema;
} = {
  thread: {
    uuid: '',
    //@ts-ignore
    organisation_id: '',
    updated_datetime: '',
    sender_id: '',
    receiver_id: '',
    state: 'unknown',
    last_message_id: '',
    created_datetime: '',
  },
  assignment: {
    uuid: '',
    thread_id: '',
    assigner_id: '',
    assignee_id: '',
    created_datetime: '',
  },
  note: {
    uuid: '',
    content: '',
    assignment_id: '',
    author_id: '',
    created_datetime: '',
  },
  inboxUser: {
    is_customer: false,
    uuid: '',
  },
  customer: {
    uuid: '',
    channel: 'unknown',
  },
  attachment: {
    id: '',
    type: '',
    message_id: '',
    data: { url: '', attachment_id: '' },
  },
  message: {
    uuid: '',
    created_datetime: '',
    thread_id: '',
    state: 'unknown',
    meta: { type: 'normal', message_id: '' },
    author_id: '',
  },
  notification: {
    uuid: '',
    user_id: '',
    message_id: '',
    status: 'unsent',
  },
  platformContact: {
    uuid: '',
    organisation_id: '',
    name: '',
    customer_id: '',
    receiver_platform_id: '',
  },
};

export const prompts: {
  [k: string]: {
    title: string;
    text: string;
    btn?: string;
  };
} = {
  replaced: {
    title: 'Another Instance Connection',
    text:
      'WhatsApp is open on another computer or browser. Click "Use Here" to use WhatsApp in this window.',
    btn: 'Use Here',
  },
  invalid_token: {
    title: 'Invalid Authentication',
    text: 'Seems like your authentication has been invalidated. Please re-authenticate.',
    btn: 'Re-authenticate',
  },
  phone_connection_lost: {
    title: 'Phone Not Connected',
    text: 'Make sure your phone has an active internet',
    btn: undefined,
  },
};

export const typeOptions: { [key: string]: FilterTypeOptions } = {
  queued: {
    label: 'queued',
    children: 'New',
    icon: 'inbox-new',
  },
  assigned: {
    label: 'assigned',
    icon: 'inbox-assigned',
    children: 'Assigned to me',
  },
  mentioned: {
    label: 'mentioned',
    icon: 'inbox-mentioned',
    children: 'Mentioned',
  },
  favorite: {
    label: 'favorite',
    icon: 'inbox-favorite',
    children: 'Favorite',
  },
  closed: {
    label: 'closed',
    icon: 'inbox-closed',
    children: 'Closed',
  },
  // snoozed: {
  //   label: 'snoozed',
  //   icon: 'inbox-snoozed',
  //   children: 'Snoozed',
  // },
};

export const channelOptions: { [key in Channel]: FilterTypeOptions } = {
  whatsapp: { children: 'Whatsapp', icon: 'inbox-whatsapp', label: 'whatsapp' },
  whatsappWeb: { children: 'Whatsapp', icon: 'inbox-whatsapp', label: 'whatsapp' },
  messenger: { children: 'Messenger', icon: 'inbox-messenger', label: 'messenger' },
  phone: { children: 'SMS', icon: 'inbox-sms', label: 'phone' },
  twitter: { children: 'Twitter', icon: 'inbox-twitter', label: 'twitter' },
  email: { children: 'Mail', icon: 'inbox-mail', label: 'email' },
};
