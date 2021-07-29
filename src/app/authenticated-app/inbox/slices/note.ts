import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash';
import { RootState } from '../../../../root'
import { selectOrgMembers } from '../../settings/slices';
import { EntityMetaSchema, NoteSchema } from '../inbox.types';
import { selectThreadAssignmentIDs } from './assignment';
import {
  assignThread, fetchThreadAssignments, fetchThreadNotes, onWebSocketAccountDisconnected,
  onWebSocketNewNote, sendMessage, sendThreadNote
} from './global';
import { selectInboxEntitiesState } from './ui';

const notesAdapter = createEntityAdapter<NoteSchema>({
  selectId: note => note.uuid,
  sortComparer: (a, b) => b.created_datetime.localeCompare(a.created_datetime),
});

const upsertManyCallback = (state: any, action: any) => {
  const { notes } = action.payload;
  !isEmpty(notes) && notesAdapter.upsertMany(state, notes);
};

export const notesSlice = createSlice({
  name: "notes",
  initialState: notesAdapter.getInitialState<{
    metas: { [k: string]: EntityMetaSchema }
  }>({
    metas: {}
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(assignThread.fulfilled, upsertManyCallback)
      .addCase(sendMessage.fulfilled, upsertManyCallback)
      .addCase(onWebSocketNewNote, upsertManyCallback)
      .addCase(fetchThreadAssignments.fulfilled, upsertManyCallback)
      .addCase(sendThreadNote.fulfilled, upsertManyCallback)
      .addCase(onWebSocketAccountDisconnected, (state, action) => {
        const { noteIDs } = action.payload;
        
        noteIDs?.length > 0 && notesAdapter.removeMany(state, noteIDs);
      })
      .addCase(fetchThreadNotes.fulfilled, (state, action) => {
        const arg: any = action.meta.arg;
        state.metas[(arg.thread_id as string) || ''] = action.payload.meta;
        upsertManyCallback(state, action);
      })
  },
});

export const notesReducer = notesSlice.reducer;

export const {
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  selectEntities: selectNoteEntities,
  selectAll: selectAllNotes,
  selectTotal: selectTotalNotes,
} = notesAdapter.getSelectors<RootState>((state) => state.inbox.entities.notes);

export const selectAssignmentNotes = createSelector(
  (_: RootState, payload: { assignmentIDs: string[] }) => payload,
  selectAllNotes,
  selectOrgMembers,
  ({ assignmentIDs }, notes, orgMembers) => assignmentIDs.map(
    (item) => notes.filter(
      ({ assignment_id }) => assignment_id === item
    ).map((note) => {
      const author = orgMembers.find(({ id }) => id === note.author_id);

      return { ...note, author }
    })
  )
);

export const selectThreadNoteIDs = createSelector(
  selectThreadAssignmentIDs,
  selectAllNotes,
  (assignmentIDs, notes) => notes.reduce((acc, note) => {
    const { assignment_id, uuid } = note;
    if (assignmentIDs.includes(assignment_id)) {
      acc.push(uuid);
      return acc;
    }

    return acc;
  }, ([] as string[]))
);

export const selectNoteState = createSelector(
  selectInboxEntitiesState,
  (state) => state.notes,
);

export const selectNoteMetaByThreadID = createSelector(
  (_: RootState, payload: {thread_id: string }) => payload.thread_id,
  selectNoteState,
  (thread_id, noteState) => noteState.metas[thread_id] || {}
);
