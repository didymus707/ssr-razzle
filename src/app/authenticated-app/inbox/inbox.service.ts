import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { isNil, omitBy } from 'lodash';
import qs from 'qs';
import {
  client,
  buildConversationUrl,
  buildPaymentURL,
  formUrlQueryFromObject,
  toFormData,
} from '../../../utils';
import {
  InboxConnection,
  InboxTag,
  NoteSchema,
  QuickReplySchema,
  SignatureSchema,
  ThreadSchema,
} from './inbox.types';

async function getConversationThreads(
  params?: AxiosRequestConfig['params'],
): Promise<AxiosResponse<any>> {
  return client('', {
    url: buildConversationUrl(`threads`),
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'indices' });
    },
  });
}

async function getThreadByID(params?: AxiosRequestConfig['params']): Promise<ThreadSchema> {
  const { thread_id } = params;

  const response = await client('', { url: buildConversationUrl(`threads/${thread_id}`) });
  return response.data.thread;
}

function getUnreadThreadCount(params?: AxiosRequestConfig['params']) {
  const { user_id } = params;
  return client('', { url: buildConversationUrl(`messages/unread/count/${user_id}`) });
}

function markConversationThreadAsRead(params?: AxiosRequestConfig['params']) {
  const { thread_id, event, organisation_id, userId } = params;

  return client('', {
    url: buildConversationUrl(`messages/event/${organisation_id}`),
    method: 'PATCH',
    data: { event, thread_id, user_id: userId },
  });
}

function updateMessageNotificationStatus(params?: AxiosRequestConfig['params']) {
  const { notification_event, notificationID } = params;

  return client('', {
    url: buildConversationUrl(`messages/notification/${notificationID}`),
    method: 'PATCH',
    data: { notification_event },
  });
}

function assignConversationThread(payload: { thread: ThreadSchema; assignee_id: string }) {
  const { thread, assignee_id } = payload;

  return client('', {
    url: buildConversationUrl(`threads/assign/${thread.uuid}`),
    data: { assignee_id },
    method: 'PATCH',
  });
}

function resolveConversationThread(thread: ThreadSchema) {
  return client('', {
    url: buildConversationUrl(`threads/resolve/${thread.uuid}`),
    method: 'PATCH',
  });
}

function tagConversationThread(params?: AxiosRequestConfig['params']) {
  const { tag_ids, thread_id } = params;
  return client('', {
    url: buildConversationUrl(`threads/tag/${thread_id}`),
    method: 'PATCH',
    data: { tag_ids },
  });
}

function unTagConversationThread(params?: AxiosRequestConfig['params']) {
  const { tag_id, thread_id } = params;
  return client('', {
    url: buildConversationUrl(`threads/${thread_id}/tag/${tag_id}`),
    method: 'DELETE',
  });
}

async function getConversationMessages(params?: AxiosRequestConfig['params']) {
  const { thread_id, ...rest } = params;

  const response = await client('', {
    url: buildConversationUrl(`conversations/${thread_id}`),
    params: rest,
  });
  return response.data;
}

function getConversationAssignments(params?: AxiosRequestConfig['params']) {
  const { thread_id } = params;

  return client('', {
    url: buildConversationUrl(`assignments/${thread_id}`),
  });
}

function sendInboxTemplates(params?: AxiosRequestConfig['params']) {
  const { channel, to, template_id, data, from, thread_id, author_id } = params;

  return client('', {
    url: buildConversationUrl(`templates/send/${thread_id}`),
    method: 'POST',
    data: {
      channel,
      to,
      template_id,
      data,
      from,
      author_id,
    },
  });
}

function getInboxTemplates(params?: AxiosRequestConfig['params']) {
  const { channel } = params;

  return client('', {
    url: buildConversationUrl(`templates/${channel}`),
  });
}

function addContactToConversation(params?: AxiosRequestConfig['params']) {
  const { contact_id, customer_id } = params;

  return client('', {
    url: buildConversationUrl(`contacts/${contact_id}`),
    method: 'POST',
    data: { customer_id },
  });
}

function createFormData(obj: any) {
  const { files, ...rest } = obj;
  const formData = new FormData();
  Object.keys(omitBy(rest, isNil)).forEach(item => formData.append(item, rest[item]));

  if (files && files.length > 0) {
    files.forEach((file: any) => formData.append('files', file));
  }

  return formData;
}

const startThread = (params?: any) => {
  const { credential_id, ...rest } = params;
  const formData = createFormData(rest);

  return client('', {
    url: buildConversationUrl(`conversations/start/${credential_id}`),
    data: formData,
    method: 'POST',
  });
};

const sendMessage = (params?: AxiosRequestConfig['params']) => {
  const { thread_id, ...rest } = params;
  const formData = createFormData(rest);

  return client('', {
    url: buildConversationUrl(`conversations/${thread_id}`),
    data: formData,
    method: 'POST',
  });
};

const sendPaymentRequest = (payload?: AxiosRequestConfig['params']) => {
  return client('', {
    data: payload,
    method: 'POST',
    url: buildConversationUrl(`conversations/sendPaymentRequest`),
  });
};

const retryMessage = (params?: AxiosRequestConfig['params']) => {
  const { message_id } = params;

  return client('', {
    method: 'POST',
    url: buildConversationUrl(`messages/retry/${message_id}`),
  });
};

const getMessageAttachments = (params?: AxiosRequestConfig['params']) => {
  return client('', {
    url: buildConversationUrl(`messages/media/${params.message_id}`),
  });
};

const searchConversations = (params?: AxiosRequestConfig['params']) => {
  const { q } = params;

  return client('', {
    url: buildConversationUrl(`search?q=${q}`),
  });
};

const getContactTemplates = (params?: AxiosRequestConfig['params']) => {
  return client('conversations/templates');
};

const getContactTable = () => {
  return client('table/type/contact');
};

function generatePaymentLink(params?: AxiosRequestConfig['params']) {
  return client('', {
    url: buildPaymentURL('/payment_request/'),
    method: 'POST',
    data: params,
  });
}

function updatePaymentLink(params?: AxiosRequestConfig['params']) {
  const { conversation, paymentLinkID } = params;
  return client('', {
    url: buildPaymentURL(`/payment_request/${paymentLinkID}`),
    method: 'PATCH',
    data: { conversation },
  });
}

function getUrlMetaData(params?: AxiosRequestConfig['params']) {
  const { url } = params;

  return client('', { url: buildConversationUrl('url-scraps'), params: { url } });
}

function sendNote(params?: AxiosRequestConfig['params']) {
  const { content, thread_id } = params;

  return client('', {
    url: buildConversationUrl(`comments/${thread_id}`),
    method: 'POST',
    data: { content },
  });
}

function getNotesByThreadID(params: AxiosRequestConfig['params']) {
  const { thread_id, ...rest } = params;

  return client('', {
    url: buildConversationUrl(`comments/${thread_id}?${formUrlQueryFromObject(rest)}`),
  });
}

const getTags = async () => {
  const { data } = await client('', {
    url: buildConversationUrl(`tags`),
  });
  return data.tags;
};

const getTag = (id: string) => {
  return client('', {
    url: buildConversationUrl(`tags/${id}`),
  });
};

const createTag = (data: Partial<InboxTag>) => {
  return client('', {
    url: buildConversationUrl(`tags`),
    method: 'POST',
    data,
  });
};

const editTag = ({ id, data }: { id: string; data: InboxTag }) => {
  return client('', {
    url: buildConversationUrl(`tags/${id}`),
    method: 'PATCH',
    data,
  });
};

const deleteTag = (payload: Partial<InboxTag>) => {
  return client('', {
    url: buildConversationUrl(`tags/${payload.uuid}`),
    method: 'DELETE',
  });
};

const favoriteThread = (thread: any) => {
  return client('', {
    method: 'POST',
    url: buildConversationUrl(`threads/favorite/${thread.uuid}`),
  });
};

const unFavoriteThread = (thread: any) => {
  return client('', {
    method: 'DELETE',
    url: buildConversationUrl(`threads/favorite/${thread.uuid}`),
  });
};

const tagConversation = async (payload: { thread: ThreadSchema; tag: InboxTag }) => {
  const { thread, tag } = payload;
  const { uuid } = thread;
  const tag_ids = [tag.uuid];
  const response = await client('', {
    method: 'POST',
    data: { tag_ids },
    url: buildConversationUrl(`threads/tag/${uuid}`),
  });
  return response.data;
};

const unTagConversation = async (payload: { thread: ThreadSchema; tag: InboxTag }) => {
  const { thread, tag } = payload;
  const { uuid } = thread;
  const response = await client('', {
    method: 'DELETE',
    url: buildConversationUrl(`threads/${uuid}/tag/${tag.uuid}`),
  });
  return response.data;
};

const getConversationNotes = async (payload: { customer_id: string; page: number }) => {
  const { customer_id, page } = payload;
  return await client('', {
    params: { page },
    url: buildConversationUrl(`notes/${customer_id}`),
  });
};

const addConversationNote = async (payload: { note: Partial<NoteSchema>; customer_id: string }) => {
  const { note, customer_id } = payload;
  const { content } = note;
  const response = await client('', {
    method: 'POST',
    data: { content },
    url: buildConversationUrl(`notes/${customer_id}`),
  });
  return response.data;
};

const getQuickReplies = async (params?: AxiosRequestConfig['params']) => {
  const response = await client('', {
    params,
    url: buildConversationUrl(`quick_replies`),
  });
  return response.data;
};

const getQuickReply = async (id: QuickReplySchema['uuid']) => {
  const response = await client('', {
    url: buildConversationUrl(`quick_replies/${id}`),
  });
  return response.data.quick_reply;
};

const createQuickReply = async (payload: { name: string; subject?: string; content: string }) => {
  const data = toFormData(payload);
  const response = await client('', {
    data,
    method: 'POST',
    url: buildConversationUrl(`quick_replies`),
  });
  return response.data.quick_reply;
};

const updateQuickReply = async (
  id: QuickReplySchema['uuid'],
  payload: { name: string; subject?: string; content: string },
) => {
  const data = toFormData(payload);
  const response = await client('', {
    data,
    method: 'PATCH',
    url: buildConversationUrl(`quick_replies/${id}`),
  });
  return response.data;
};

const deleteQuickReplies = async (params: { ids: QuickReplySchema['uuid'][] }) => {
  const response = await client('', {
    params,
    method: 'DELETE',
    url: buildConversationUrl(`quick_replies`),
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'indices' });
    },
  });
  return response.data;
};

const getSignatures = async (params: AxiosRequestConfig['params']) => {
  const response = await client('', {
    params,
    url: buildConversationUrl(`signatures`),
  });
  return response.data;
};

const setSignatureAsDefault = async (id: SignatureSchema['uuid']) => {
  const response = await client('', {
    url: buildConversationUrl(`signatures/useAsDefault/${id}`),
  });
  return response.data;
};

const getSignature = async (id: SignatureSchema['uuid']) => {
  const response = await client('', {
    url: buildConversationUrl(`signatures/${id}`),
  });
  return response.data.signature;
};

const createSignature = async (payload: { content: string }) => {
  const response = await client('', {
    data: payload,
    method: 'POST',
    url: buildConversationUrl(`signatures`),
  });
  return response.data.signature;
};

const updateSignature = async (id: SignatureSchema['uuid'], payload: { content: string }) => {
  const response = await client('', {
    data: payload,
    method: 'PATCH',
    url: buildConversationUrl(`signatures/${id}`),
  });
  return response.data.signature;
};

const deleteSignatures = async (params: { ids: SignatureSchema['uuid'][] }) => {
  const response = await client('', {
    params,
    method: 'DELETE',
    url: buildConversationUrl(`signatures`),
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'indices' });
    },
  });
  return response.data;
};

const getThreadFiltersUnreadCount = async () => {
  const response = await client('', {
    url: buildConversationUrl(`threads/filter/count`),
  });
  return response.data.count;
};

const addProfileToContact = async (payload: { contactID: string; customer_id: string }) => {
  const { contactID, customer_id } = payload;
  const response = await client('', {
    method: 'POST',
    data: { customer_id },
    url: buildConversationUrl(`profiles/${contactID}`),
  });
  return response.data;
};

const removeProfileFromContact = async (payload: { customerID: string }) => {
  const { customerID } = payload;
  return await client('', {
    method: 'DELETE',
    url: buildConversationUrl(`profiles/customer/${customerID}`),
  });
};

const getInboxConnections = async () => {
  const response = await client('inbox/connections/all');
  return response.data.inbox_connections;
};

const createInboxConnection = async (
  data: {
    table_id?: string | null;
    segment_id?: string | null;
  } & InboxConnection['variables'],
) => {
  return await client('inbox/connections/create', {
    data,
    method: 'POST',
  });
};

const deleteInboxConnection = async (id: InboxConnection['id']) => {
  return await client('inbox/connections/delete', {
    data: { id },
    method: 'DELETE',
  });
};

function updateConversationNotificationStatus({
  message_id,
  event = 'read',
}: {
  message_id: string;
  event?: string;
}) {
  return client('', {
    url: buildConversationUrl(`conversations/notification/${message_id}`),
    method: 'PATCH',
    data: { event },
  });
}

export {
  sendNote,
  getThreadByID,
  getConversationThreads,
  assignConversationThread,
  resolveConversationThread,
  getConversationMessages,
  getConversationAssignments,
  getInboxTemplates,
  sendInboxTemplates,
  sendMessage,
  retryMessage,
  startThread,
  getMessageAttachments,
  searchConversations,
  markConversationThreadAsRead,
  updateMessageNotificationStatus,
  getContactTemplates,
  getContactTable,
  getUnreadThreadCount,
  addContactToConversation,
  generatePaymentLink,
  updatePaymentLink,
  getUrlMetaData,
  getNotesByThreadID,
  getTag,
  getTags,
  createTag,
  deleteTag,
  editTag,
  favoriteThread,
  unFavoriteThread,
  tagConversationThread,
  unTagConversationThread,
  tagConversation,
  unTagConversation,
  addConversationNote,
  getConversationNotes,
  getQuickReplies,
  getQuickReply,
  createQuickReply,
  updateQuickReply,
  deleteQuickReplies,
  getSignatures,
  getSignature,
  createSignature,
  updateSignature,
  deleteSignatures,
  setSignatureAsDefault,
  sendPaymentRequest,
  getThreadFiltersUnreadCount,
  addProfileToContact,
  removeProfileFromContact,
  getInboxConnections,
  createInboxConnection,
  deleteInboxConnection,
  updateConversationNotificationStatus,
};
