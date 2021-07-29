// @ts-nocheck
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../root';

const PAGE_LIMIT: number = Number(process.env.REACT_APP_PAGINATION_LIMIT) || 200;

const initialMeta = {
  count: 0,
  count_total: 0,
  page: 1,
  per_page: PAGE_LIMIT,
  next_page: true,
  prev_page: false,
};

const initialState = {
  lists: {},
  lists_by_id: [],
  smart_lists: {},
  smart_lists_by_id: [],
  favorites: [],
  groups: {},
  groups_by_id: [],
  columns: {},
  columns_by_id: [],
  column_id_map: {},
  rows: {},
  rows_by_id: [],
  trash: {},
  trash_by_id: [],
  selected_list: null,
  selected_smart_list: null,
  selected_list_pending_update: false,
  selected_rows: [],
  smart_lists_loading: false,
  lists_loading: false,
  favorites_loading: false,
  trash_loading: false,
  rows_loading: false,
  rows_syncing: false,
  list_syncing: false,
  lists_fetched: false,
  smart_lists_fetched: false,
  lists_pending_update: [],
  favorites_pending_mark: [],
  favorites_pending_unmark: [],
  smart_lists_pending_update: [],
  rows_pending_delete: [],
  rows_pending_update: [],
  rows_pending_insert: [],
  filters: {},
  filters_by_id: [],
  sorts: {},
  sorts_by_id: [],
  meta: initialMeta,
  search_query: '',
  initial_list: null,
  audiences: {},
  audiences_by_id: [],
  audiences_fetched: false,
  audiences_loading: false,
  resources: {
    data: {},
    by_id: [],
    meta: {},
    loading: false,
  },
};

export const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists: (state, action) => {
      const { data, by_id } = action.payload;
      state.lists = data;
      state.lists_by_id = by_id;
      state.lists_fetched = true;
    },
    setAudiences: (state, action) => {
      const { data, by_id } = action.payload;
      state.audiences = data;
      state.audiences_by_id = by_id;
      state.audiences_fetched = true;
    },
    setListsLoading: (state, action) => {
      const { is_loading } = action.payload;
      state.lists_loading = is_loading;
    },
    setAudiencesLoading: (state, action) => {
      const { is_loading } = action.payload;
      state.audiences_loading = is_loading;
    },
    setRowsLoading: (state, action) => {
      const { is_loading } = action.payload;
      state.rows_loading = is_loading;
    },
    setSelectedList: (state, action) => {
      const {
        list_id,
        columns,
        columns_by_id,
        column_id_map,
        smart_list_id = initialState.selected_smart_list,
        filters = initialState.filters,
        filters_by_id = initialState.filters_by_id,
        meta = initialMeta,
      } = action.payload;
      state.selected_list = list_id;
      state.columns = columns;
      state.columns_by_id = columns_by_id;
      state.column_id_map = column_id_map;
      state.selected_smart_list = smart_list_id;
      state.filters = filters;
      state.filters_by_id = filters_by_id;
      state.rows = {};
      state.meta = meta;
    },
    resetSelectedList: state => {
      state.selected_list = null;
      state.selected_smart_list = null;
      state.columns = {};
      state.rows = {};
      state.columns_by_id = [];
      state.rows_by_id = [];
      state.selected_rows = [];
      state.filters = {};
      state.filters_by_id = [];
      state.sorts = {};
      state.sorts_by_id = [];
      state.meta = initialMeta;
      state.search_query = '';
    },
    setRows: (state, action) => {
      const { data, by_id, meta } = action.payload;
      // @ts-ignore
      state.rows_by_id = [...state.rows_by_id, ...by_id];
      state.rows = { ...state.rows, ...data };
      state.meta = { ...state.meta, ...meta };
    },
    setList: (state, action) => {
      const list = action.payload;
      const list_id = state.selected_list ? state.selected_list : list.id;
      state.lists = {
        ...state.lists,
        [list_id]: list,
      };
    },
    setSmartList: (state, action) => {
      const smart_list = action.payload;
      const smart_list_id = state.selected_smart_list ? state.selected_smart_list : smart_list.id;
      state.smart_lists = {
        ...state.smart_lists,
        [smart_list_id]: smart_list,
      };
    },
    setColumnArrangement: (state, action) => {
      const columns_by_id = action.payload;
      state.columns_by_id = columns_by_id;
    },
    setRowCell: (state, action) => {
      let { row_index, columnID, value, row_id } = action.payload;
      if (!row_id) row_id = state.rows_by_id[row_index];
      const updated_row = {
        ...state.rows[row_id],
        columns: {
          ...state.rows[row_id].columns,
          [columnID]: value,
        },
      };
      state.rows = {
        ...state.rows,
        [row_id]: updated_row,
      };

      if (
        !state.rows_pending_insert.includes(row_id) &&
        !state.rows_pending_update.includes(row_id)
      ) {
        state.rows_pending_update = [...state.rows_pending_update, row_id];
      }
    },
    addRowsPendingUpdate: (state, action) => {
      const row_ids = action.payload;
      state.rows_pending_update = [...state.rows_pending_update, ...row_ids];
    },
    removeRowsPendingUpdate: (state, action) => {
      const { row_ids } = action.payload;
      state.rows_pending_update = state.rows_pending_update.filter(
        row_id => !row_ids.includes(row_id),
      );
    },
    addRowsPendingInsert: (state, action) => {
      const { row_ids } = action.payload;
      state.rows_pending_insert = [...state.rows_pending_insert, ...row_ids];
    },
    removeRowsPendingInsert: (state, action) => {
      const { row_ids } = action.payload;
      state.rows_pending_insert = state.rows_pending_insert.filter(
        row_id => !row_ids.includes(row_id),
      );
    },
    addListPendingUpdate: (state, action) => {
      const list_id = action.payload;
      state.lists_pending_update = [...state.lists_pending_update, list_id];
    },
    removeListsPendingUpdate: (state, action) => {
      const list_ids = action.payload;
      state.lists_pending_update = state.lists_pending_update.filter(id => !list_ids.includes(id));
    },
    addSmartListPendingUpdate: (state, action) => {
      const smart_list_id = action.payload;
      state.smart_lists_pending_update = state.smart_lists_pending_update.includes(smart_list_id)
        ? state.smart_lists_pending_update
        : [...state.smart_lists_pending_update, smart_list_id];
    },
    removeSmartListsPendingUpdate: (state, action) => {
      const smart_list_ids = action.payload;
      state.smart_lists_pending_update = state.smart_lists_pending_update.filter(
        (id: string) => !smart_list_ids.includes(id),
      );
    },
    setListPendingUpdate: (state, action) => {
      const pending_update: boolean = action.payload;
      state.selected_list_pending_update = pending_update;
    },
    setListSyncing: (state, action) => {
      const list_syncing = action.payload;
      state.list_syncing = list_syncing;
    },
    setRowsSyncing: (state, action) => {
      const rows_syncing = action.payload;
      state.rows_syncing = rows_syncing;
    },
    setColumns: (state, action) => {
      const { columns_by_id, columns, column_id_map } = action.payload;
      state.columns_by_id = columns_by_id;
      state.column_id_map = column_id_map;
      state.columns = columns;
    },
    setSelectedRows: (state, action) => {
      const selected_rows = action.payload;
      state.selected_rows = selected_rows;
    },
    removeRowsByID: (state, action) => {
      const row_ids = action.payload;
      state.rows_by_id = state.rows_by_id.filter(row_id => !row_ids.includes(row_id));
    },
    addRowsPendingDelete: (state, action) => {
      const row_ids = action.payload;
      state.rows_pending_delete = [
        ...state.rows_pending_delete,
        ...row_ids.filter(row_id => !state.rows_pending_delete.includes(row_id)),
      ];
    },
    removeRowsPendingDelete: (state, action) => {
      const row_ids = action.payload;
      state.rows_pending_delete = state.rows_pending_insert.filter(
        row_id => !row_ids.includes(row_id),
      );
    },
    setFilterData: (state, action) => {
      const { data, by_id } = action.payload;
      state.filters = data;
      state.filters_by_id = by_id;
    },
    setSortData: (state, action) => {
      const { data, by_id } = action.payload;
      state.sorts = data;
      state.sorts_by_id = by_id;
    },
    resetRows: (state, action) => {
      state.rows = {};
      state.rows_by_id = [];
      state.selected_rows = [];
      state.rows_pending_delete = [];
      state.rows_pending_update = [];
      state.rows_pending_insert = [];
      state.meta = initialMeta;
      state.rows_loading = false;
    },
    setSmartLists: (state, action) => {
      const { data, by_id } = action.payload;
      state.smart_lists = data;
      state.smart_lists_by_id = by_id;
      state.smart_lists_fetched = true;
    },
    setSmartListsLoading: (state, action) => {
      const { is_loading } = action.payload;
      state.smart_lists_loading = is_loading;
    },
    setSelectedSmartListID: (state, action) => {
      const smart_list_id = action.payload;
      state.selected_smart_list = smart_list_id;
    },
    setFavoritesLoading: (state, action) => {
      const { is_loading } = action.payload;
      state.favorites_loading = is_loading;
    },
    setFavorites: (state, action) => {
      const favorites = action.payload;
      state.favorites = favorites;
    },
    setFavoritesPendingMark: (state, action) => {
      const pending_mark = action.payload;
      state.favorites_pending_mark = pending_mark;
    },
    setFavoritesPendingUnmark: (state, action) => {
      const pending_unmark = action.payload;
      state.favorites_pending_unmark = pending_unmark;
    },
    setTrashLoading: (state, action) => {
      const { is_loading } = action.payload;
      state.trash_loading = is_loading;
    },
    setTrash: (state, action) => {
      const { data, by_id } = action.payload;
      state.trash = data;
      state.trash_by_id = by_id;
    },
    setSearchQuery: (state, action) => {
      state.search_query = action.payload;
    },
    setInitialList: (state, action) => {
      state.initial_list = action.payload;
    },
    setResourcesData: (state, action) => {
      const { data, by_id, meta } = action.payload;
      state.resources.data = data;
      state.resources.by_id = by_id;
      state.resources.meta = meta;
    },
    setResourcesLoading: (state, action) => {
      const loading = action.payload;
      state.resources.loading = loading;
    },
  },
});

const selectListState = createSelector(
  (state: RootState) => state.lists,
  lists => lists,
);

export const selectContactListID = createSelector(
  selectListState,
  listState => listState.initial_list,
);

export const selectLists = createSelector(selectListState, listState => listState.lists);

export const selectContactList = createSelector(
  selectLists,
  selectContactListID,
  (lists, contactListID) => lists[contactListID],
);
