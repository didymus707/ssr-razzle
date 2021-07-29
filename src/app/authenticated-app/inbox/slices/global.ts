import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import { AppDispatch } from '../../../../root';
import * as inboxService from '../inbox.service';
import { destrutureMessage, aggregate, getUnknownColumnID } from '../inbox.utils';
import { initializePusher, pusher } from '../../../../utils/pusher';
import {
  AssignmentSchema,
  AttachmentDataSchema,
  AttachmentSchema,
  ContactSchema,
  ContactColumnSchema,
  InboxUserSchema,
  MessageMetaSchema,
  UnfurledUrlSchema,
  MessageSchema,
  NoteSchema,
  NotificationSchema,
  ThreadSchema,
  CustomerSchema,
  AddressBookSchema,
  EntityMetaSchema,
} from '../inbox.types';
import { ConnectivitySchema, CredentialSchema } from '../../channels';
import { createRow, filterRows, sortRows, updateRow, updateTable } from '../../tables';
import { sortTemplatesFunc } from '../../marketing/templates/templates.utils';
import { TemplateData } from '../../marketing/templates';
import { loadState } from '../../../../utils';

const attachmentDataStruct = new schema.Entity<AttachmentDataSchema>(
  'attachmentData',
  {},
  {
    idAttribute(value, attachment) {
      return attachment.id;
    },
    processStrategy(value, attachment) {
      return { ...value, attachment_id: attachment.id };
    },
  },
);
const attachmentStruct = new schema.Entity<AttachmentSchema>(
  'attachments',
  {
    data: attachmentDataStruct,
  },
  {
    idAttribute(value, message) {
      return value.id ? value.id : message.uuid;
    },
    processStrategy(value, message, key) {
      let { id } = value;
      if (!id) {
        const index = message[key].findIndex((item: any) => value === item);
        id = `${message.uuid}-${index}`;
      }

      return { ...value, id, message_id: message.uuid };
    },
  },
);
const unfurledUrlStruct = new schema.Entity<UnfurledUrlSchema>('unfurledUrls', undefined, {
  idAttribute(value, messageMeta) {
    return messageMeta.message_id;
  },
  processStrategy(value, messageMeta) {
    return { ...value, message_id: messageMeta.message_id };
  },
});
const messageMetaStruct = new schema.Entity<MessageMetaSchema>(
  'messageMetas',
  {
    unfurledUrls: [unfurledUrlStruct],
  },
  {
    idAttribute(value, message) {
      return message.uuid;
    },
    processStrategy(value, message) {
      return { ...value, message_id: message.uuid };
    },
  },
);
const addressBookStruct = new schema.Entity<AddressBookSchema>(
  'addressBooks',
  {},
  { idAttribute: 'uuid' },
);
const platformContactStruct = new schema.Entity<AddressBookSchema>(
  'platformContacts',
  {},
  { idAttribute: 'uuid' },
);
const customerStruct = new schema.Entity<CustomerSchema>(
  'customers',
  {
    address_books: [addressBookStruct],
    contacts: [platformContactStruct],
    contact: platformContactStruct,
  },
  { idAttribute: 'uuid' },
);
const inboxUserStruct = new schema.Entity<InboxUserSchema>(
  'inboxUsers',
  { user: customerStruct },
  { idAttribute: 'uuid' },
);
const notificationsStruct = new schema.Entity<NotificationSchema>(
  'notifications',
  {},
  { idAttribute: 'uuid' },
);
const messageStruct = new schema.Entity<MessageSchema>(
  'messages',
  {
    author: inboxUserStruct,
    meta: messageMetaStruct,
    attachments: [attachmentStruct],
    notifications: [notificationsStruct],
  },
  { idAttribute: 'uuid' },
);
const connectivityStruct = new schema.Entity<ConnectivitySchema>(
  'connectivities',
  {},
  { idAttribute: 'uuid' },
);
const credentialStruct = new schema.Entity<CredentialSchema>(
  'credentials',
  {
    user: customerStruct,
    connectivities: [connectivityStruct],
  },
  { idAttribute: 'uuid' },
);
const noteStruct = new schema.Entity<NoteSchema>('notes', {}, { idAttribute: 'uuid' });
const assignmentStruct = new schema.Entity<AssignmentSchema>(
  'assignments',
  {
    notes: [noteStruct],
  },
  { idAttribute: 'uuid' },
);
const threadStruct = new schema.Entity<ThreadSchema>(
  'threads',
  {
    sender: customerStruct,
    receiver: credentialStruct,
    last_message: messageStruct,
    assignments: [assignmentStruct],
  },
  { idAttribute: 'uuid' },
);
const columnStruct = new schema.Entity<ContactColumnSchema>(
  'columns',
  {},
  {
    idAttribute(value, contact) {
      return contact.id;
    },
    processStrategy(value, contact) {
      return { ...value, contact_id: contact.id };
    },
  },
);
const contactStruct = new schema.Entity<ContactSchema>('contacts', { columns: columnStruct });
const assigningPayloadStruct = {
  thread: threadStruct,
  notifications: [notificationsStruct],
};
const sendingPayloadStruct = {
  thread: threadStruct,
  message: messageStruct,
};

export const onWebSocketAssignedThread = createAction<any>('inbox/websocket/thread_assigned');

export const onWebSocketNewThread = createAction<any>('inbox/websocket/thread_new');

export const onWebSocketResolvedThread = createAction<any>('inbox/websocket/thread_resolved');

export const onNewWebsocketEvent = createAction('inbox/websocket/event_new');

export const onContactListFetch = createAction<any>('inbox/contact-list/get');

export const onWebSocketNewMessage = createAction<any>('inbox/websocket/message_new');

export const onWebSocketNewNote = createAction<{ notes: NoteSchema[] }>('inbox/websocket/note_new');

export const onWebSocketWhatsAppQrCode = createAction<{ qrcode: string }>(
  'integration/whatsapp_web/qrcode',
);

export const onWebSocketWhatsAppQrCodeFailure = createAction<any>(
  'integration/whatsapp_web/qrcode-failure',
);

export const onWebSocketAccountDisconnected = createAction<any>(
  'integration/whatsapp_web/qrcode-failure',
);

export const onWebSocketAccountStatusChanged = createAction<any>(
  'integration/account/status-changed',
);

export const onWebSocketWhatsAppAccountStatusChange = createAction<{
  status: 'idle' | 'connecting' | 'connected';
}>('integration/whatsapp_web/account/connection_status_change');

export const loadScrollMemory = createAsyncThunk('inbox/scrollMemory/load', () => {
  const currentLocalState = loadState();

  return currentLocalState?.scrollMemory || {};
});

export const subscribeToWebsocket = createAsyncThunk<string, any, { dispatch: AppDispatch }>(
  'inbox/websocket/subscribe',
  (params, { dispatch }) => {
    const { organisation_id, profile_id } = params;

    if (!pusher) {
      console.log('pusher connection is not set');

      initializePusher(profile_id);
    }

    const orgChannel = pusher.subscribe(`presence_${organisation_id}`);

    if (orgChannel) {
      orgChannel.unbind();

      orgChannel.bind('thread_new', (data: any) => {
        const payload = normalize(data, threadStruct).entities;

        dispatch(onNewWebsocketEvent());
        dispatch(onWebSocketNewThread(payload as any));
      });

      // orgChannel.bind('thread_assigned', (data: any) => {
      //   const {
      //     thread: {
      //       assignments: [{ assigner_id }],
      //     },
      //   } = data || {
      //     thread: { assignments: [{ assigner_id: '' }] },
      //   };
      //   if (assigner_id !== profile_id) {
      //     dispatch(onNewWebsocketEvent());
      //   }

      //   const payload = normalize(data, assigningPayloadStruct).entities;
      //   dispatch(onWebSocketAssignedThread(payload));
      // });

      orgChannel.bind('thread_resolved', (data: any) => {
        const payload = normalize(data, threadStruct).entities;
        dispatch(onWebSocketResolvedThread(payload));
      });

      orgChannel.bind('whatsapp_account_connected', (data: any) => {
        const payload = normalize(data.credential, credentialStruct).entities;
        dispatch(onWebSocketWhatsAppAccountStatusChange({ ...payload, status: 'connected' }));
      });

      orgChannel.bind('whatsapp_account_connection_failed', (data: any) => {
        dispatch(onWebSocketWhatsAppQrCodeFailure(data));
      });

      orgChannel.bind('channel_account_disconnected', (data: any) => {
        const { disconnected_credential, ...rest } = data;
        const payload = normalize(disconnected_credential, credentialStruct).entities;

        dispatch(onWebSocketAccountDisconnected({ ...payload, ...rest }));
      });

      orgChannel.bind('channel_account_status_changed', (data: any) => {
        dispatch(onWebSocketAccountStatusChanged({ credentials: [data] }));
      });
    }

    const userChannel = pusher.subscribe(`private_${profile_id}`);

    if (userChannel) {
      userChannel.unbind();

      const messageCallback = (message: any) => {
        if (message?.author_id !== profile_id) {
          dispatch(onNewWebsocketEvent());
        }
      };

      userChannel.bind('message_new', messageCallback);
      userChannel.bind('message_retry', messageCallback);
      orgChannel.bind('message_new', messageCallback);
    }

    return organisation_id;
  },
);

export const fetchThreadsByState = createAsyncThunk<any, any, { dispatch: AppDispatch }>(
  'threads/fetch',
  async (params, { dispatch }) => {
    const response = await inboxService.getConversationThreads(params);

    const { threads, meta } = response.data;
    const payload = normalize(threads, [threadStruct]).entities;

    return { ...payload, meta };
  },
);

export const fetchThreadByID = createAsyncThunk<any, any, { dispatch: AppDispatch }>(
  'threads/fetch/single',
  async (params, { dispatch }) => {
    const response = await inboxService.getThreadByID(params);

    //@ts-ignore
    const { thread } = response.data;
    const payload = normalize(thread, threadStruct).entities;

    return payload;
  },
);

export const assignThread = createAsyncThunk<Promise<any>, any, { dispatch: AppDispatch }>(
  'inbox/thread/assign',
  async (params: any) => {
    const response = await inboxService.assignConversationThread(params);

    const payload = normalize(response.data, assigningPayloadStruct).entities;

    return payload;
  },
);

export const fetchContactTable = createAsyncThunk(
  'inbox/contact/get_table',
  async (params, { dispatch }) => {
    const response = await inboxService.getContactTable();
    const { table } = response.data;

    if (table) {
      const listResponse = await sortRows({
        sorts: [{ name: 'Name', order: 'ASC' }],
        table_id: table.id,
      });

      const { rows } = listResponse.data;
      const payload = normalize(rows, [contactStruct]).entities;
      dispatch(onContactListFetch(payload));
    }

    return await table;
  },
);

export const searchContactList = createAsyncThunk('inbox/contact/get_list', async (params: any) => {
  return await filterRows(params);
});

export const fetchThreadAssignments = createAsyncThunk(
  'inbox/thread/get_assignments',
  async (params: any) => {
    const response = await inboxService.getConversationAssignments(params);
    const { assignments } = response.data;
    const payload = normalize(assignments, [assignmentStruct]).entities;

    return payload;
  },
);

export const resolveThread = createAsyncThunk('inbox/thread/resolve', async (params: any) => {
  const response = await inboxService.resolveConversationThread(params);
  const payload = normalize(response.data, threadStruct).entities;

  return payload;
});

export const fetchThreadMessages = createAsyncThunk(
  'inbox/thread/messages',
  async (params: any) => {
    const response = await inboxService.getConversationMessages(params);
    const { messages, firstUnreadMessgeID, thread_id, meta } = response.data;
    const payload = normalize(messages, [messageStruct]).entities;

    return {
      ...payload,
      ui: { firstUnreadMessgeID, thread_id, meta },
    } as any;
  },
);

export const onMessageRead = createAction<{
  notificationID: string;
  status: NotificationSchema['status'];
}>('inbox/message/on_message_read');

export const updateNotification = createAsyncThunk(
  'inbox/message/update_notification',
  async (params: any, { dispatch }) => {
    if (['sent', 'delivered'].includes(params.status)) {
      dispatch(onMessageRead(params));

      await inboxService.updateMessageNotificationStatus({ ...params, notification_event: 'read' });
    }
  },
);

export const addInboxContact = createAsyncThunk(
  'inbox/message/send/contact/add',
  async (params: any) => {
    const response = await createRow(params);
    const { row } = response.data;
    const payload = normalize(row, contactStruct).entities;

    return { ...payload, contact_id: row.id };
  },
);

export const sendMessage = createAsyncThunk('inbox/message/send', async (params: any) => {
  const meth = params.thread_id ? inboxService.sendMessage : inboxService.startThread;
  const response = await meth(params);
  const { message, thread, organisation_id, sender, addressBook } = response.data;

  const payload = normalize(
    {
      message,
      thread: thread
        ? {
            organisation_id,
            ...thread,
            sender: {
              ...sender,
              addressBooks: addressBook ? [addressBook] : undefined,
            },
          }
        : null,
    },
    sendingPayloadStruct,
  ).entities;
  return { ...payload, thread_id: message.thread_id, message_id: message.uuid };
});

export const retrySendingMessage = createAsyncThunk(
  'inbox/message/send/retry',
  async (params: any) => {
    const response = await inboxService.retryMessage(params);
    const { message } = response.data;

    return { messages: [message] };
  },
);

export const fetchTemplates = createAsyncThunk('inbox/app-templates/fetch', async () => {
  const response = await inboxService.getContactTemplates();
  const { templates } = response.data;
  /**
   * sort templates based on created datetime
   * this sort should come from API actually
   */
  const sortedTemplates = templates.sort(sortTemplatesFunc);
  return (await sortedTemplates) as TemplateData[];
});

export const fetchInboxTemplates = createAsyncThunk(
  'inbox/inbox-templates/fetch',
  async (params: any) => {
    const response = await inboxService.getInboxTemplates(params);

    return response.data;
  },
);

export const sendInboxTemplate = createAsyncThunk(
  'inbox/inbox-templates/send',
  async (params: any) => {
    const response = await inboxService.sendInboxTemplates(params);

    const { messageData } = response.data;

    return aggregate(destrutureMessage(messageData));
  },
);

export const generatePaymentLink = createAsyncThunk(
  'inbox/payment-link/generate',
  async (params: any) => {
    const response = await inboxService.generatePaymentLink(params);

    return response.data;
  },
);

export const addConversationToPaymentLink = createAsyncThunk(
  'inbox/payment-link/update',
  async (params: any) => {
    const response = await inboxService.updatePaymentLink(params);

    return response.data;
  },
);

export const addContact = createAsyncThunk('inbox/contact/add', async (params: any) => {
  const { columns, contact: conts, restOfTable, contact_id, thread_id, customer_id } = params;
  let contact = conts;

  if (contact?.unknown) {
    let unknownColumn;
    const tableResponse = await updateTable({
      ...restOfTable,
      columns: columns.map((item: any) => {
        if (item.id === 'unknown') {
          const { id, ...rest } = item;
          unknownColumn = rest;
          return rest;
        }

        return item;
      }),
    });

    const { table } = tableResponse.data || {};

    const unknownColumnID = getUnknownColumnID(table.columns, unknownColumn);
    const { unknown, ...restOfContact } = contact;
    restOfContact[unknownColumnID] = unknown;

    contact = restOfContact;
  }

  const response = contact_id
    ? await updateRow({
        id: contact_id,
        columns: contact,
      })
    : await createRow({
        columns: contact,
        table_id: restOfTable.id,
      });

  let address_book: any;
  if (response?.data?.row?.id) {
    const addressBookResponse = await inboxService.addContactToConversation({
      customer_id,
      contact_id: response.data.row.id,
    });

    address_book = addressBookResponse?.data?.address_book;
  }
  const { row, table } = response.data;
  const payload = normalize(row, contactStruct).entities;

  return {
    ...payload,
    table,
    addressBooks: [address_book],
    thread_id,
  };
});

export const addTableColumn = createAsyncThunk(
  'inbox/contact/addTableColumn',
  async (params: any) => {
    const tableResponse = await updateTable(params);

    return tableResponse.data;
  },
);

export const updateContact = createAsyncThunk('inbox/contact/update', async (params: any) => {
  const { contact, contact_id } = params;
  const response = await updateRow({
    id: contact_id,
    columns: contact,
  });

  const { row, table } = response.data;
  const payload = normalize(row, contactStruct).entities;

  return { ...payload, table };
});

export const sendThreadNote = createAsyncThunk('inbox/notes/send', async (params: any) => {
  const response = await inboxService.sendNote(params);

  const { comment: note } = response.data;

  return { note: [note] };
});

export const fetchThreadNotes = createAsyncThunk('inbox/thread/notes', async (params: any) => {
  const response = await inboxService.getNotesByThreadID(params);
  const { comments: notes, meta } = response.data;

  return {
    notes,
    meta,
  } as { notes: NoteSchema[]; meta: EntityMetaSchema };
});

export const searchInbox = createAsyncThunk('inbox/search', async (params: { q: string }) => {
  const response = await inboxService.searchConversations(params);
  const { data } = response;
  const { entities, result } = normalize(data, {
    threads: [threadStruct],
    messages: [messageStruct],
  });

  return { ...entities, result };
});
