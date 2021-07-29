import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../root';

export const selectListCount = createSelector(
  (state: RootState) => state.lists,
  lists => lists.lists_by_id.length,
);

export const selectLists = createSelector(
  (state: RootState) => state.lists,
  list => list.lists,
);

export const selectSmartLists = createSelector(
  (state: RootState) => state.lists,
  list => list.smart_lists,
);

export const selectListsById = createSelector(
  (state: RootState) => state.lists,
  list => list.lists_by_id,
);

export const selectSmartListsById = createSelector(
  (state: RootState) => state.lists,
  list => list.smart_lists_by_id,
);

export const selectListFilters = createSelector(
  (state: RootState) => state.lists.filters,
  (state: RootState) => state.lists.filters_by_id,
  (filters, filters_by_id) => ({ filters, filters_by_id }),
);

export const selectColumnsData = createSelector(
  (state: RootState) => state.lists.columns,
  (state: RootState) => state.lists.columns_by_id,
  (state: RootState) => state.lists.column_id_map,
  (columns, columns_by_id, column_id_map) => ({ columns, columns_by_id, column_id_map }),
);

export const selectRowsCount = createSelector(
  (state: RootState) => state.lists.rows_by_id,
  rows_by_id => rows_by_id.length,
);

export const selectListResources = createSelector(
  (state: RootState) => state.resources,
  resources => {
    // @ts-ignore
    return resources.by_id.map((i: string) => resources.data[i]);
  },
);

export const selectDataModels = createSelector(
  (state: RootState) => state.dataModels,
  dataModels => {
    // @ts-ignore
    return dataModels.by_id.map((i: string) => dataModels.data[i]);
  },
);

export const selectSegments = createSelector(
  (state: RootState) => state.segments,
  segments => {
    // @ts-ignore
    return segments.by_id.map((i: string) => segments.data[i]);
  },
);

export const selectColumns = createSelector(
  (state: RootState) => state.lists,
  list => list.lists_by_id,
);

export const selectListMeta = createSelector(
  (state: RootState) => state.lists,
  list => list.meta,
);

export const selectInitialListId = createSelector(
  (state: RootState) => state.lists,
  list => list.initial_list,
);
