import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../root'
import { selectOrgMembers } from '../../settings/slices';
import { AssignmentSchema } from '../inbox.types';
import {
  assignThread, fetchThreadAssignments, onWebSocketAccountDisconnected, sendMessage
} from './global';

const assignmentsAdapter = createEntityAdapter<AssignmentSchema>({
  selectId: assignment => assignment.uuid,
});

const upsertManyCallback = (state: any, action: any) => {
  const { assignments } = action.payload;
  assignments && assignmentsAdapter.upsertMany(state, assignments);
};

export const assignmentsSlice = createSlice({
  name: "assignments",
  initialState: assignmentsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(assignThread.fulfilled, upsertManyCallback)
      .addCase(sendMessage.fulfilled, upsertManyCallback)
      .addCase(onWebSocketAccountDisconnected, (state, action) => {
        const { assignmentIDs } = action.payload;
        
        assignmentIDs?.length > 0 && assignmentsAdapter.removeMany(state, assignmentIDs);
      })
      .addCase(fetchThreadAssignments.fulfilled, upsertManyCallback);
  },
});

export const assignmentsReducer = assignmentsSlice.reducer;

export const {
  selectById: selectAssignmentById,
  selectIds: selectAssignmentIds,
  selectEntities: selectAssignmentEntities,
  selectAll: selectAllAssignments,
  selectTotal: selectTotalAssignments,
} = assignmentsAdapter.getSelectors<RootState>((state) => state.inbox.entities.assignments);

export const selectAssignmentsByThreadID = createSelector(
  (_: RootState, payload: Pick<AssignmentSchema, 'thread_id'>) => payload,
  selectAllAssignments,
  selectOrgMembers,
  (payload, assignments, orgMembers) => assignments.filter(
    ({ thread_id }) => payload.thread_id === thread_id
  ).map((item) => {
    const { assignee_id, assigner_id } = item;
    const assignee = orgMembers.find(({ id }) => id === assignee_id);
    const assigner = orgMembers.find(({ id }) => id === assigner_id);

    return { ...item, assignee, assigner }
  })
);

export const selectThreadAssignmentIDs = createSelector(
  (_: RootState, payload: Pick<AssignmentSchema, 'thread_id'>) => payload.thread_id,
  selectAllAssignments,
  (thread_id, assignments) => assignments.reduce((acc, { uuid, thread_id: tID }) => {
    if (thread_id === tID) {
      acc.push(uuid);
    }
    
    return acc;
  }, ([] as string[]))
);
