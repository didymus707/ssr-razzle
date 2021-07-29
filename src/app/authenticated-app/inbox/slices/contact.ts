import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';
import { AddressBookSchema, ContactColumnSchema, ContactSchema } from '../inbox.types';
import {
  addContact,
  addInboxContact,
  onContactListFetch,
  onWebSocketAssignedThread,
  onWebSocketNewThread,
  onWebSocketResolvedThread,
  searchInbox,
  sendMessage,
  updateContact,
} from './global';
import { fetchThreadsByState } from './global';

const columnsAdapter = createEntityAdapter<ContactColumnSchema>({
  selectId: column => column.contact_id,
});

const columnWebsocketCallback = (state: any, action: any) => {
  const { columns } = action.payload;
  columns && columnsAdapter.upsertMany(state, columns);
};

export const columnsSlice = createSlice({
  name: 'columns',
  initialState: columnsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, columnWebsocketCallback)
      .addCase(addContact.fulfilled, columnWebsocketCallback)
      .addCase(updateContact.fulfilled, columnWebsocketCallback)
      .addCase(sendMessage.fulfilled, columnWebsocketCallback)
      .addCase(addInboxContact.fulfilled, columnWebsocketCallback)
      .addCase(onWebSocketNewThread, columnWebsocketCallback)
      .addCase(onWebSocketResolvedThread, columnWebsocketCallback)
      .addCase(onWebSocketAssignedThread, columnWebsocketCallback)
      .addCase(onContactListFetch, columnWebsocketCallback);
  },
});

export const columnsReducer = columnsSlice.reducer;

export const {
  selectById: selectColumnById,
  selectIds: selectColumnIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllColumns,
  selectTotal: selectTotalColumns,
} = columnsAdapter.getSelectors<RootState>(state => state.inbox.entities.columns);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const contactsAdapter = createEntityAdapter<ContactSchema>();

const websocketCallback = (state: any, action: any) => {
  const { contacts } = action.payload;
  contacts && contactsAdapter.upsertMany(state, contacts);
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState: contactsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, websocketCallback)
      .addCase(onWebSocketNewThread, websocketCallback)
      .addCase(updateContact.fulfilled, websocketCallback)
      .addCase(sendMessage.fulfilled, websocketCallback)
      .addCase(addInboxContact.fulfilled, websocketCallback)
      .addCase(onWebSocketResolvedThread, websocketCallback)
      .addCase(onWebSocketAssignedThread, websocketCallback)
      .addCase(onContactListFetch, websocketCallback);
  },
});

export const contactsReducer = contactsSlice.reducer;

export const {
  selectById: selectContactById,
  selectIds: selectContactIds,
  selectEntities: selectContactEntities,
  selectAll: selectAllContacts,
  selectTotal: selectTotalContacts,
} = contactsAdapter.getSelectors<RootState>(state => state.inbox.entities.contacts);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const addressBooksAdapter = createEntityAdapter<AddressBookSchema>({
  selectId: addressBook => addressBook.uuid,
});

const addressUpsertCallback = (state: any, action: any) => {
  const { addressBooks } = action.payload;
  addressBooks && addressBooksAdapter.upsertMany(state, addressBooks);
};

export const addressBooksSlice = createSlice({
  name: 'addressBooks',
  initialState: addressBooksAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, addressUpsertCallback)
      .addCase(addContact.fulfilled, addressUpsertCallback)
      .addCase(sendMessage.fulfilled, addressUpsertCallback)
      .addCase(onWebSocketNewThread, addressUpsertCallback)
      .addCase(onWebSocketResolvedThread, addressUpsertCallback)
      .addCase(onWebSocketAssignedThread, addressUpsertCallback)
      .addCase(searchInbox.fulfilled, addressUpsertCallback);
  },
});

export const addressBooksReducer = addressBooksSlice.reducer;

export const {
  selectById: selectAddressBookById,
  selectIds: selectAddressBookIds,
  selectEntities: selectAddressBookEntities,
  selectAll: selectAllAddressBooks,
  selectTotal: selectTotalAddressBooks,
} = addressBooksAdapter.getSelectors<RootState>(state => state.inbox.entities.addressBooks);

export const selectAddressBookByOrgIDAndCustomerID = createSelector(
  (_: RootState, payload: Pick<AddressBookSchema, 'customer_id' | 'organisation_id'>) =>
    payload.organisation_id,
  (_: RootState, payload: Pick<AddressBookSchema, 'customer_id' | 'organisation_id'>) =>
    payload.customer_id,
  selectAllAddressBooks,
  (orgID, custID, addressBooks) =>
    orgID && custID
      ? addressBooks.find(
          ({ organisation_id, customer_id }) => orgID === organisation_id && customer_id === custID,
        )
      : undefined,
);

export const selectAddressBookDetailByID = createSelector(
  selectAddressBookById,
  selectContactEntities,
  selectColumnEntities,
  (addressBook, contacts, cs) => {
    if (!addressBook) {
      return null;
    }

    const contactinfo = contacts[addressBook?.contact_id || ''];
    const columns = cs[addressBook?.contact_id || ''];

    return { ...addressBook, contactinfo: { ...contactinfo, columns } };
  },
);

// export const selectContactNameFromAdderssBook = createSelector(
//   selectOrganisationID,
//   selectColumnEntities,
//   selectAllAddressBooks,
//   (_: RootState, sender_id: string) => sender_id,
//   (orgID, cs, addressBooks, sender_id) => {
//     const addressBook = addressBooks.find(
//       ({ organisation_id, customer_id }) => organisation_id === orgID && customer_id === sender_id,
//     );
//     const columns = cs[addressBook?.contact_id || ''];

//     return columns && columns[1];
//   },
// );

// export const selectContactName = createSelector(
//   selectOrganisationID,
//   selectColumnEntities,
//   selectAllAddressBooks,
//   (_: RootState, payload: { id: string }) => payload.id,
//   (orgID, cs, addressBooks, sender_id) => {
//     const addressBook = addressBooks.find(
//       ({ organisation_id, customer_id }) => organisation_id === orgID && customer_id === sender_id,
//     );
//     const columns = cs[addressBook?.contact_id || ''];

//     return columns && columns[1];
//   },
// );
