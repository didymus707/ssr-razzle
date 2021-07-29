import { combineReducers } from '@reduxjs/toolkit'
import {
  attachmentDataReducer, attachmentsReducer, messagesReducer, contactsReducer, assignmentsReducer,
  notificationsReducer, threadsReducer, columnsReducer, customersReducer, inboxUiReducer,
  messageMetasReducer, addressBooksReducer, platformContactsReducer
} from './slices';
import { inboxUsersReducer } from './slices/inboxUser';
import { notesReducer } from './slices/note';

const entitiesReducer = combineReducers({
  addressBooks: addressBooksReducer,
  assignments: assignmentsReducer,
  attachmentData: attachmentDataReducer,
  attachments: attachmentsReducer,
  columns: columnsReducer,
  contacts: contactsReducer,
  customers: customersReducer,
  inboxUsers: inboxUsersReducer,
  messageMetas: messageMetasReducer,
  messages: messagesReducer,
  notes: notesReducer,
  notifications: notificationsReducer,
  platformContacts: platformContactsReducer,
  threads: threadsReducer,
});

export type InboxEntitiesState = ReturnType<typeof entitiesReducer>;

export const inboxReducer = combineReducers({
  inboxUi: inboxUiReducer,
  entities: entitiesReducer,
});
