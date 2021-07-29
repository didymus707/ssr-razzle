// @ts-nocheck
import { v4 as uuid } from 'uuid';
import { buildAppsURL, client } from '../../../utils';
import {
  setListsLoading,
  setLists,
  setRows,
  setSelectedList,
  setRowsLoading,
  setListPendingUpdate,
  setColumnArrangement,
  setListSyncing,
  setRowCell,
  setRowsSyncing,
  setColumns,
  removeRowsPendingUpdate,
  addRowsPendingInsert,
  removeRowsPendingInsert,
  setSelectedRows,
  addRowsPendingUpdate,
  removeRowsByID,
  addRowsPendingDelete,
  removeRowsPendingDelete,
  setList,
  setFilterData,
  setSortData,
  resetRows,
  resetSelectedList,
  addListPendingUpdate,
  removeListsPendingUpdate,
  setSmartLists,
  setSmartListsLoading,
  setSmartList,
  addSmartListPendingUpdate,
  removeSmartListsPendingUpdate,
  setSelectedSmartListID,
  setFavoritesLoading,
  setFavorites,
  setFavoritesPendingMark,
  setFavoritesPendingUnmark,
  setTrashLoading,
  setTrash,
  setSearchQuery,
  setInitialList,
  setAudiences,
  setAudiencesLoading,
} from './lists.reducer';
import { AppThunk } from '../../../root';
import {
  generateFilterPayload,
  generateRandomSelectColor,
  generateSortPayload,
  generateUpdatedRows,
  wait,
} from './lists.utils';
import { available_operators } from './list.data';
import { sendAmplitudeData } from '../../../utils/amplitude';

const PAGE_LIMIT: number = Number(process.env.REACT_APP_PAGINATION_LIMIT) || 200;

export const fetchLists = (): AppThunk => async dispatch => {
  dispatch(setListsLoading({ is_loading: true }));
  dispatch(fetchInitialContactList());
  try {
    const {
      data: { tables },
    } = await client('tables', { method: 'GET' });
    const data = {};
    const by_id: [] = [];
    tables.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });
    dispatch(setLists({ data, by_id }));
    dispatch(setListsLoading({ is_loading: false }));
    return data;
  } catch (e) {
    dispatch(setListsLoading({ is_loading: false }));
    return null;
  }
};

export const fetchAudiences = (): AppThunk => async dispatch => {
  dispatch(setAudiencesLoading({ is_loading: true }));
  try {
    const {
      data: { audience_lists },
    } = await client('audience_lists/all', { method: 'GET' });
    const data = {};
    const by_id: [] = [];
    audience_lists.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });
    dispatch(setAudiences({ data, by_id }));
    dispatch(setAudiencesLoading({ is_loading: false }));
    return data;
  } catch (e) {
    dispatch(setAudiencesLoading({ is_loading: false }));
    return null;
  }
};

export const addList = (list): AppThunk => async (dispatch, getState) => {
  const {
    lists: { lists, lists_by_id },
  } = getState();
  sendAmplitudeData('addList');

  const data = { ...lists, [list.id]: list };
  const by_id = [...lists_by_id, list.id];

  dispatch(setLists({ data, by_id }));
};

export const addAudience = (payload: {
  name: string;
  filters: { [key: string]: string[] | string | number | undefined };
}): AppThunk => async (dispatch, getState) => {
  const {
    lists: { audiences, audiences_by_id },
  } = getState();

  try {
    const {
      data: { audience_list },
    } = await client('audience_lists/create', { data: payload, method: 'POST' });

    sendAmplitudeData('addAudience');

    const data = { ...audiences, [audience_list.id]: audience_list };
    const by_id = [...audiences_by_id, audience_list.id];

    dispatch(setAudiences({ data, by_id }));

    return audience_list;
  } catch (error) {
    return error;
  }
};

export const selectList = (list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { lists },
  } = getState();
  // @ts-ignore
  const _columns = lists[list_id]['columns'];
  const columns = {};
  const columns_by_id: [] = [];
  const column_id_map = {};

  sendAmplitudeData('selectList');

  _columns.forEach((i: any) => {
    const uid: string = uuid();
    column_id_map[uid] = i.id;
    columns[uid] = { ...i, uid, name: !!i.name ? i.name : '', label: !!i.label ? i.label : '' };
    columns_by_id.push(uid);
  });
  dispatch(setSelectedList({ list_id, columns, columns_by_id, column_id_map }));
  dispatch(fetchRows({ list: list_id, page: 1 }));
};

export const selectSmartList = (smart_list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { lists, smart_lists },
  } = getState();

  sendAmplitudeData('selectSmartList');

  const smart_list = smart_lists[smart_list_id];
  const parent_list = lists[smart_list.list_id];

  const _columns = parent_list['columns'];
  const columns = {};
  const columns_by_id: [] = [];
  const column_id_map = {};
  _columns.forEach((i: any) => {
    const uid: string = uuid();
    column_id_map[uid] = i.id;
    columns[uid] = { ...i, uid };
    columns_by_id.push(uid);
  });

  const _filters = smart_list['filters'];
  const filters = {};
  const filters_by_id = [];
  _filters.forEach((_filter: any) => {
    const _col_id = columns_by_id.find(
      (col_id: string) => column_id_map[col_id] === _filter.columnID,
    );
    if (!_col_id) return;

    const filter_uid = uuid();
    const filter_obj = {
      ..._filter,
      uid: filter_uid,
      columnID: _col_id,
    };
    filters[filter_uid] = filter_obj;
    filters_by_id.push(filter_uid);
  });
  dispatch(
    setSelectedList({
      list_id: parent_list.id,
      columns,
      columns_by_id,
      column_id_map,
      smart_list_id,
      filters,
      filters_by_id,
    }),
  );
  dispatch(fetchRows({ list: parent_list.id, page: 1 }));
};

export const selectSmartListID = (smart_list_id: string): AppThunk => async dispatch => {
  dispatch(setSelectedSmartListID(smart_list_id));
};

export const fetchRows = ({ list, page }: { list: string; page: number }): AppThunk => async (
  dispatch,
  getState,
) => {
  dispatch(setRowsLoading({ is_loading: true }));

  const {
    lists: {
      filters,
      filters_by_id,
      sorts,
      sorts_by_id,
      column_id_map,
      search_query,
      columns,
      selected_list,
      selected_smart_list,
    },
  } = getState();

  try {
    const {
      data: { rows, meta, table },
    } = await client(`rows/filter`, {
      method: 'POST',
      data: {
        table_id: list,
        filters: generateFilterPayload(filters, filters_by_id, column_id_map, columns),
        sorts: generateSortPayload(sorts, sorts_by_id, column_id_map, columns),
        page,
        limit: PAGE_LIMIT,
        query: search_query,
      },
    });

    const data = {};
    const by_id: [] = [];

    rows.forEach((i: any) => {
      const _columns = {};
      Object.keys(i.columns).forEach((j: any) => {
        const col_uid = Object.keys(column_id_map).find(
          x => String(column_id_map[x]) === String(j),
        );
        if (col_uid) _columns[col_uid] = i.columns[j];
      });

      const uid: string = uuid();
      data[uid] = {
        ...i,
        uid,
        columns: _columns,
      };
      by_id.push(uid);
    });

    if (!selected_list) return;
    if (!selected_list && !selected_smart_list) return;
    if (table.id !== selected_list) return;

    dispatch(setRows({ data, by_id, meta }));
  } catch (e) {
    console.log(e?.message || e);
  }
  dispatch(setRowsLoading({ is_loading: false }));
};

export const updateListName = (value: string, list_id?: string = null): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateListName');

  const {
    lists: { selected_list, lists },
  } = getState();

  let list;

  if (list_id) list = lists[list_id];
  else list = lists[selected_list];

  const updated_list = {
    ...list,
    name: value,
  };

  dispatch(setList(updated_list));
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const updateRowCell = ({
  row_index,
  row_id,
  columnID,
  value,
}): AppThunk => async dispatch => {
  sendAmplitudeData('updateList');
  dispatch(setRowCell({ row_index, row_id, columnID, value }));
  dispatch(syncRows());
};

export const updateList = (list_id: string, payload: {}): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    lists: { lists },
  } = getState();
  const list = lists[list_id];
  const updated_list = {
    ...list,
    ...payload,
  };
  sendAmplitudeData('updateList');
  dispatch(setList(updated_list));
  dispatch(addListPendingUpdate(list_id));
  dispatch(syncLists());
};

export const updateSmartList = (smart_list_id: string, payload: {}): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    lists: { smart_lists },
  } = getState();
  const smart_list = smart_lists[smart_list_id];
  const updated_smart_list = {
    ...smart_list,
    ...payload,
  };
  sendAmplitudeData('updateSmartList');
  dispatch(setSmartList(updated_smart_list));
  dispatch(addSmartListPendingUpdate(smart_list_id));
  dispatch(syncLists());
};

export const syncLists = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: {
      lists_pending_update,
      smart_lists_pending_update,
      favorites_pending_mark,
      favorites_pending_unmark,
    },
  } = getState();

  if (lists_pending_update.length > 0) await dispatch(syncListsPendingUpdate());
  if (smart_lists_pending_update.length > 0) await dispatch(syncSmartListsPendingUpdate());
  if (favorites_pending_mark.length > 0) await dispatch(syncFavoritesPendingMark());
  if (favorites_pending_unmark.length > 0) await dispatch(syncFavoritesPendingUnmark());
};

export const syncFavoritesPendingMark = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { favorites_pending_mark },
  } = getState();

  const client_calls = favorites_pending_mark.map((id: string) =>
    client('tables/favourites', {
      method: 'PATCH',
      data: {
        id,
        is_favourite: true,
      },
    }),
  );
  try {
    await Promise.all(client_calls);
    dispatch(setFavoritesPendingMark([]));
  } catch (e) {}
};

export const syncFavoritesPendingUnmark = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { favorites_pending_unmark },
  } = getState();
  const client_calls = favorites_pending_unmark.map((id: string) =>
    client('tables/favourites', {
      method: 'PATCH',
      data: {
        id,
        is_favourite: false,
      },
    }),
  );
  try {
    await Promise.all(client_calls);
    dispatch(setFavoritesPendingUnmark([]));
  } catch (e) {}
};

export const syncListsPendingUpdate = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { lists_pending_update, lists },
    auth: {
      user: { id: user_id },
    },
  } = getState();
  const updated_lists = lists_pending_update.map((list_id: string) => ({
    ...lists[list_id],
    user_id,
  }));

  const client_calls = updated_lists.map((payload: object) =>
    client('tables/update', {
      method: 'PATCH',
      data: payload,
    }),
  );
  try {
    await Promise.all(client_calls);
    dispatch(removeListsPendingUpdate(lists_pending_update));
  } catch (e) {}
};

export const syncSmartListsPendingUpdate = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { smart_lists_pending_update, smart_lists },
  } = getState();

  dispatch(setListSyncing(true));

  const updated_smart_lists = smart_lists_pending_update.map((smart_list_id: string) => ({
    id: smart_list_id,
    name: smart_lists[smart_list_id].name,
    filters: smart_lists[smart_list_id].filters,
  }));

  const client_calls = updated_smart_lists.map((payload: object) =>
    client('smart_lists/update', {
      method: 'PATCH',
      data: payload,
    }),
  );
  try {
    await Promise.all(client_calls);
    dispatch(removeSmartListsPendingUpdate(smart_lists_pending_update));
  } catch (e) {}

  dispatch(setListSyncing(false));
};

export const syncList = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: {
      list_syncing,
      lists_by_id,
      selected_list,
      columns_by_id,
      columns,
      selected_list_pending_update,
      lists,
      column_id_map,
    },
    auth: {
      user: { id: user_id },
    },
  } = getState();
  if (list_syncing) return;
  if (!selected_list) return;
  if (!selected_list_pending_update) return;

  dispatch(setListSyncing(true));

  const list = lists[selected_list];
  const updated_columns = columns_by_id.map((id: string) => {
    const col = Object.keys(columns[id])
      .filter(key => key !== 'uid' && columns[id][key] !== undefined && columns[id][key] !== null)
      .reduce((acc, key) => ({ ...acc, [key]: columns[id][key] }), {});

    return col;
  });
  const updated_list = { ...list, columns: updated_columns };

  try {
    const {
      data: { table: data },
    } = await client('tables/update', {
      method: 'PATCH',
      data: { ...updated_list, user_id },
    });

    const _columns = { ...columns };
    const _column_id_map = { ...column_id_map };

    const _lists = { ...lists, [updated_list.id]: data };

    data.columns.forEach((i: any, index: number) => {
      if (!Object.values(column_id_map).includes(i.id)) {
        const col_uid = columns_by_id[index];
        _column_id_map[col_uid] = i.id;
        _columns[col_uid] = { ...i, uid: col_uid };
      }
    });

    dispatch(setLists({ data: _lists, by_id: lists_by_id }));
    dispatch(
      setColumns({
        columns_by_id,
        columns: _columns,
        column_id_map: _column_id_map,
      }),
    );
    dispatch(setListPendingUpdate(false));
  } catch (e) {}
  dispatch(setListSyncing(false));
};

export const syncRows = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: {
      rows_pending_insert,
      rows_pending_update,
      rows_pending_delete,
      rows_syncing,
      selected_list,
    },
  } = getState();

  if (rows_syncing) return;
  if (!selected_list) return;

  dispatch(setRowsSyncing(true));
  if (rows_pending_insert.length > 0) await dispatch(syncRowsPendingInsert());
  if (rows_pending_update.length > 0) await dispatch(syncRowsPendingUpdate());
  if (rows_pending_delete.length > 0) await dispatch(syncRowsPendingDelete());
  dispatch(setRowsSyncing(false));
};

export const syncRowsPendingInsert = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { rows, rows_pending_insert, column_id_map, meta },
  } = getState();

  let updated_rows = generateUpdatedRows(rows_pending_insert, rows, column_id_map);
  const client_calls = updated_rows.map((payload: object) =>
    client('rows/create', {
      method: 'POST',
      data: payload,
    }),
  );
  try {
    const response = await Promise.all(client_calls);
    const new_row_ids = response.map((res: any) => res.data.row.id);

    updated_rows = {};
    rows_pending_insert.forEach((row_id: string, index: number) => {
      updated_rows[row_id] = { ...rows[row_id], id: new_row_ids[index] };
    });

    dispatch(
      setRows({
        data: updated_rows,
        by_id: [],
        meta,
      }),
    );

    dispatch(removeRowsPendingInsert({ row_ids: rows_pending_insert }));
  } catch (e) {}
};
export const syncRowsPendingUpdate = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { rows, rows_pending_update, column_id_map },
  } = getState();

  const updated_rows = generateUpdatedRows(rows_pending_update, rows, column_id_map);
  const client_calls = updated_rows.map((payload: object) =>
    client('rows/update', {
      method: 'PATCH',
      data: payload,
    }),
  );
  try {
    await Promise.all(client_calls);
    dispatch(removeRowsPendingUpdate({ row_ids: rows_pending_update }));
  } catch (e) {}
};
export const syncRowsPendingDelete = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { rows, rows_pending_delete },
  } = getState();

  const client_calls = rows_pending_delete.map((row_id: string) =>
    client('rows/delete', {
      method: 'DELETE',
      data: { id: rows[row_id].id },
    }),
  );
  try {
    await Promise.all(client_calls);
    dispatch(removeRowsPendingDelete(rows_pending_delete));
  } catch (e) {}
};

export const updateColumnArrangement = (columns_by_id): AppThunk => async dispatch => {
  sendAmplitudeData('updateListColumnArrangement');

  dispatch(setColumnArrangement(columns_by_id));
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const createColumn = (payload = {}): AppThunk => async (dispatch, getState) => {
  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  sendAmplitudeData('createListColumn');

  const col_uid = uuid();

  const col_obj = {
    id: null,
    uid: col_uid,
    type: 'TEXT',
    name: 'column',
    label: 'Column',
    customization: {},
    ...payload,
  };

  const updated_col_by_id = [...columns_by_id, col_uid];
  const updated_columns = { ...columns, [col_uid]: col_obj };
  const updated_col_id_map = { ...column_id_map, [col_uid]: null };

  dispatch(
    setColumns({
      columns_by_id: updated_col_by_id,
      columns: updated_columns,
      column_id_map: updated_col_id_map,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());

  return col_obj;
};

export const deleteColumn = (columnID): AppThunk => async (dispatch, getState) => {
  const {
    lists: { columns_by_id },
  } = getState();

  sendAmplitudeData('deleteListColumn');

  const updated_columns_by_id = columns_by_id.filter((i: string) => i !== columnID);
  dispatch(setColumnArrangement(updated_columns_by_id));
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const hideColumn = (columnID: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  sendAmplitudeData('hideListColumn');

  const col_obj = {
    ...columns[columnID],
    hidden: true,
  };

  const updated_columns = { ...columns, [columnID]: col_obj };

  dispatch(
    setColumns({
      columns_by_id,
      column_id_map,
      columns: updated_columns,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const showColumn = (columnID: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  sendAmplitudeData('showListColumn');

  const col_obj = {
    ...columns[columnID],
    hidden: false,
  };

  const updated_columns = { ...columns, [columnID]: col_obj };

  dispatch(
    setColumns({
      columns_by_id,
      column_id_map,
      columns: updated_columns,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const updateColumnLabel = (columnID: string, label: string): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateListColumn');

  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  const col_obj = {
    ...columns[columnID],
    label,
    name: label.toLowerCase(),
  };

  const updated_columns = { ...columns, [columnID]: col_obj };

  dispatch(
    setColumns({
      columns_by_id,
      column_id_map,
      columns: updated_columns,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const updateColumn = (columnID: string, payload = {}): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateListColumn');

  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  if (payload.type && payload.type === 'DND' && columns[columnID].type !== payload.type) {
    const first_phone_col = Object.values(columns).filter(
      (i: any) => i.uid !== columnID && i.type === 'PHONE NUMBER',
    )[0];
    payload['customization'] = {
      tracked_column: first_phone_col ? first_phone_col['id'] : null,
    };
  }

  const col_obj = {
    ...columns[columnID],
    ...payload,
  };

  col_obj['name'] = col_obj['label'].toLowerCase();

  const updated_columns = { ...columns, [columnID]: col_obj };

  dispatch(
    setColumns({
      columns_by_id,
      column_id_map,
      columns: updated_columns,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const updateColumnType = (columnID: string, type: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  sendAmplitudeData('updateListColumn');

  const payload = { type };

  if (['SELECT', 'MULTI SELECT'].includes(type)) {
    payload['options'] = columns[columnID].options || [];
  }

  if (type === 'DND') {
    const first_phone_col = Object.values(columns).filter(
      (i: any) => i.uid !== columnID && i.type === 'PHONE NUMBER',
    )[0];

    payload['customization'] = {
      tracked_column: first_phone_col ? first_phone_col['id'] : null,
    };
  }

  const col_obj = {
    ...columns[columnID],
    ...payload,
  };

  const updated_columns = { ...columns, [columnID]: col_obj };

  dispatch(
    setColumns({
      columns_by_id,
      column_id_map,
      columns: updated_columns,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const updateColumnCustomization = (columnID: string, customization: {}): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateListColumn');

  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  const col_obj = {
    ...columns[columnID],
    customization,
  };

  const updated_columns = { ...columns, [columnID]: col_obj };

  dispatch(
    setColumns({
      columns_by_id,
      column_id_map,
      columns: updated_columns,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
};

export const createRow = (): AppThunk => async (dispatch, getState) => {
  sendAmplitudeData('createListRow');

  const {
    lists: { selected_list, meta },
  } = getState();

  const row_uid = uuid();

  const new_row = {
    uid: row_uid,
    columns: {},
    table_id: selected_list,
    id: null,
  };

  dispatch(
    setRows({
      data: { [row_uid]: new_row },
      by_id: [row_uid],
      meta: { ...meta, count_total: meta.count_total + 1 },
    }),
  );

  dispatch(addRowsPendingInsert({ row_ids: [row_uid] }));
  dispatch(syncRows());
};

export const selectRows = (row_indices, mode = 'index'): AppThunk => async (dispatch, getState) => {
  const {
    lists: { rows_by_id },
  } = getState();

  sendAmplitudeData('selectListRows');

  let selected_rows = [];

  if ((mode = 'id')) {
    selected_rows = row_indices;
  } else {
    selected_rows = row_indices.map((row_index: number) => rows_by_id[row_index]);
  }
  dispatch(setSelectedRows(selected_rows));
};

export const clearRows = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { selected_rows, rows, meta },
  } = getState();
  if (selected_rows.length === 0) return;

  sendAmplitudeData('clearListRows');

  const updated_rows = {};

  selected_rows.forEach((row_id: string) => {
    updated_rows[row_id] = { ...rows[row_id], columns: {} };
  });

  dispatch(
    setRows({
      data: updated_rows,
      by_id: [],
      meta,
    }),
  );

  dispatch(addRowsPendingUpdate(selected_rows));
  dispatch(setSelectedRows([]));
  dispatch(syncRows());
};

export const deleteRows = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { selected_rows, meta },
  } = getState();
  if (selected_rows.length === 0) return;

  sendAmplitudeData('clearListRows');

  dispatch(removeRowsByID(selected_rows));
  dispatch(addRowsPendingDelete(selected_rows));
  dispatch(setSelectedRows([]));
  dispatch(
    setRows({
      by_id: [],
      data: {},
      meta: { ...meta, count_total: meta.count_total - selected_rows.length },
    }),
  );
  dispatch(syncRows());
};

export const addFilter = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { filters, filters_by_id, columns, columns_by_id },
  } = getState();

  sendAmplitudeData('addListFilter');

  if (columns_by_id.length === 0) return;
  const first_col = columns[columns_by_id[0]];

  const filter_uid = uuid();

  let operator = 'contains';
  let subOperator = null;
  if (['SELECT', 'MULTI SELECT'].includes(first_col.type)) {
    operator = 'isAnyOf';
  }
  if (first_col.type === 'DATE') {
    operator = 'dateEqual';
    subOperator = 'exact date';
  }
  if (first_col.type === 'NUMBER') {
    operator = 'equals';
  }

  const filter_obj = {
    uid: filter_uid,
    columnID: first_col['uid'],
    operator,
    subOperator,
    value: '',
    name: first_col['name'],
  };

  if (filters_by_id.length > 0) filter_obj['conjunction'] = 'and';
  if (filters_by_id.length > 1) {
    filter_obj['conjunction'] = filters[filters_by_id[1]]['conjunction'];
  }

  const updated_filters = { ...filters, [filter_uid]: filter_obj };
  const updated_filters_by_id = [...filters_by_id, filter_uid];

  dispatch(
    setFilterData({
      data: updated_filters,
      by_id: updated_filters_by_id,
    }),
  );

  dispatch(applyFilter());
};

export const updateFilter = (filter_uid: string, payload: object): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    lists: { filters, filters_by_id, columns },
  } = getState();

  sendAmplitudeData('updateListFilter');

  const filter = filters[filter_uid];
  const updated_filter = { ...filter, ...payload };

  if (filter.columnID !== updated_filter.columnID) {
    const column = columns[updated_filter.columnID];
    const allowed_operator = Object.values(available_operators).find((i: any) =>
      i.column_types.includes(column.type),
    );

    updated_filter['operator'] = allowed_operator['key'];
    if (column.type === 'DATE') updated_filter['subOperator'] = 'exact date';
    else updated_filter['subOperator'] = null;

    updated_filter['operator'] = allowed_operator['key'];
    if (column.type === 'DND') updated_filter['value'] = true;
  }

  const updated_filters = { ...filters, [filter_uid]: updated_filter };

  if (filter.cunjunction !== updated_filter.conjunction) {
    filters_by_id.forEach((i: string, index: number) => {
      if (index > 1) {
        updated_filters[i] = {
          ...updated_filters[i],
          conjunction: updated_filter['conjunction'],
        };
      }
    });
  }

  dispatch(
    setFilterData({
      data: updated_filters,
      by_id: filters_by_id,
    }),
  );

  dispatch(applyFilter());
};

export const deleteFilter = (filter_uid: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { filters, filters_by_id },
  } = getState();

  sendAmplitudeData('removeListFilter');

  const updated_filters_by_id = filters_by_id.filter((i: string) => i !== filter_uid);
  const updated_filters = updated_filters_by_id.reduce((acc, i, index) => {
    const filter_item = { ...filters[i] };
    if (index === 0 && filter_item.conjunction) delete filter_item.conjunction;
    return { ...acc, [i]: filter_item };
  }, {});

  dispatch(
    setFilterData({
      data: updated_filters,
      by_id: updated_filters_by_id,
    }),
  );

  dispatch(applyFilter());
};

export const applyFilter = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { selected_list },
  } = getState();
  dispatch(resetRows());
  dispatch(fetchRows({ list: selected_list, page: 1 }));
};

export const addSort = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { sorts, sorts_by_id, columns_by_id, columns },
  } = getState();

  sendAmplitudeData('addListSort');

  const sorted_columns = Object.values(sorts).reduce((acc: string[], i: any) => {
    if (acc.includes(i.columnID)) return acc;
    return [...acc, i.columnID];
  }, []);

  const available_columns = columns_by_id.filter((i: string) => !sorted_columns.includes(i));

  if (columns_by_id.length === 0) return;
  if (available_columns.length === 0) return;

  const first_col = columns[available_columns[0]];
  const sort_uid = uuid();

  const sort_item = {
    uid: sort_uid,
    columnID: first_col['uid'],
    name: first_col['name'],
    order: 'ASC',
  };

  const updated_sorts = {
    ...sorts,
    [sort_uid]: sort_item,
  };
  const updated_sorts_by_id = [...sorts_by_id, sort_uid];

  dispatch(
    setSortData({
      data: updated_sorts,
      by_id: updated_sorts_by_id,
    }),
  );

  dispatch(applySorts());
};

export const updateSort = (sort_uid: string, payload: object): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateListSort');

  const {
    lists: { sorts, sorts_by_id },
  } = getState();

  const sort_item = sorts[sort_uid];
  const updated_sort_item = { ...sort_item, ...payload };

  const updated_sorts = { ...sorts, [sort_uid]: updated_sort_item };

  dispatch(
    setSortData({
      data: updated_sorts,
      by_id: sorts_by_id,
    }),
  );

  dispatch(applySorts());
};

export const deleteSort = (sort_uid: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { sorts, sorts_by_id },
  } = getState();

  sendAmplitudeData('deleteListSort');

  const updated_sorts_by_id = sorts_by_id.filter((i: string) => i !== sort_uid);
  const updated_sorts = updated_sorts_by_id.reduce((acc, i) => ({ ...acc, [i]: sorts[i] }), {});

  dispatch(
    setSortData({
      data: updated_sorts,
      by_id: updated_sorts_by_id,
    }),
  );

  dispatch(applySorts());
};

export const applySorts = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { selected_list },
  } = getState();
  dispatch(resetRows());
  dispatch(fetchRows({ list: selected_list, page: 1 }));
};

export const applySearch = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { selected_list },
  } = getState();
  dispatch(resetRows());
  dispatch(fetchRows({ list: selected_list, page: 1 }));
};

export const deleteList = (list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { lists_by_id, lists, trash, trash_by_id, favorites },
  } = getState();
  sendAmplitudeData('deleteList');

  dispatch(resetSelectedList());

  const by_id = lists_by_id.filter((i: string) => i !== list_id);
  const data = by_id.reduce((acc, i) => ({ ...acc, [i]: lists[i] }), {});

  const updated_favorites = favorites.filter((i: string) => i !== list_id);
  const updated_trash_by_id = [...trash_by_id, list_id];
  const updated_trash = { ...trash, [list_id]: lists[list_id] };

  dispatch(setLists({ data, by_id }));
  dispatch(setFavorites(updated_favorites));
  dispatch(setTrash({ data: updated_trash, by_id: updated_trash_by_id }));

  try {
    await client('tables/trash', {
      method: 'PATCH',
      data: {
        id: list_id,
        is_trash: true,
      },
    });
  } catch (e) {}
};

export const restoreList = (trash_list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { lists_by_id, lists, trash, trash_by_id },
  } = getState();

  sendAmplitudeData('restoreList');

  const by_id = [...lists_by_id, trash_list_id];
  const data = { ...lists, [trash_list_id]: trash[trash_list_id] };

  const updated_trash_by_id = trash_by_id.filter((id: string) => id !== trash_list_id);
  const updated_trash = updated_trash_by_id.reduce((acc, i) => ({ ...acc, [i]: trash[i] }), {});

  dispatch(setLists({ data, by_id }));
  dispatch(setTrash({ data: updated_trash, by_id: updated_trash_by_id }));

  try {
    await client('tables/trash', {
      method: 'PATCH',
      data: {
        id: trash_list_id,
        is_trash: false,
      },
    });
    dispatch(fetchListFavorites());
  } catch (e) {}
};

export const deleteListPermanently = (trash_list_id: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    lists: { trash, trash_by_id },
  } = getState();
  sendAmplitudeData('deleteListPermanently');

  const updated_trash_by_id = trash_by_id.filter((id: string) => id !== trash_list_id);
  const updated_trash = updated_trash_by_id.reduce((acc, i) => ({ ...acc, [i]: trash[i] }), {});

  dispatch(setTrash({ data: updated_trash, by_id: updated_trash_by_id }));

  try {
    await client('tables/delete', {
      method: 'DELETE',
      data: {
        id: trash_list_id,
      },
    });
  } catch (e) {}
};

export const deleteTrashPermanently = (): AppThunk => async (dispatch, getState) => {
  const {
    lists: { trash_by_id },
  } = getState();

  sendAmplitudeData('deleteListPermanently');

  const client_calls = trash_by_id.map((id: string) =>
    client('tables/delete', {
      method: 'DELETE',
      data: {
        id,
      },
    }),
  );

  const updated_trash_by_id = [];
  const updated_trash = {};
  try {
    await Promise.all(client_calls);
    dispatch(setFavoritesPendingMark([]));
    dispatch(setTrash({ data: updated_trash, by_id: updated_trash_by_id }));
    return true;
  } catch (e) {
    return null;
  }
};

export const deleteSmartList = (smart_list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { smart_lists_by_id, smart_lists },
  } = getState();
  dispatch(resetSelectedList());

  sendAmplitudeData('deleteSmartList');

  const by_id = smart_lists_by_id.filter((i: string) => i !== smart_list_id);
  const data = by_id.reduce((acc, i) => ({ ...acc, [i]: smart_lists[i] }), {});
  dispatch(setSmartLists({ data, by_id }));

  try {
    await client('smart_lists/delete', {
      method: 'DELETE',
      data: {
        id: smart_list_id,
      },
    });
  } catch (e) {}
};

export const addSelectOption = (
  columnID: string,
  value: string,
  color?: string,
): AppThunk => async (dispatch, getState) => {
  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  sendAmplitudeData('addListColumnSelectOption');

  const column = columns[columnID];
  const options = column.options || [];
  const option_id = options.length + 1;

  const new_option = {
    id: option_id,
    name: value,
    type: 'option',
    is_deleted: false,
    color: color || generateRandomSelectColor(),
  };

  const updated_options = [...options, new_option];
  const updated_column = { ...column, options: updated_options };

  dispatch(
    setColumns({
      columns: { ...columns, [columnID]: updated_column },
      columns_by_id,
      column_id_map,
    }),
  );

  dispatch(setListPendingUpdate(true));
  dispatch(syncList());

  return new_option;
};

export const updateSelectOption = (
  columnID: string,
  option_id: string,
  payload: string,
): AppThunk => async (dispatch, getState) => {
  const {
    lists: { columns, columns_by_id, column_id_map },
  } = getState();

  sendAmplitudeData('updateListColumnSelectOption');

  const column = columns[columnID];
  const option_index = column.options.findIndex((option: any) => option.id === option_id);
  const option = column.options[option_index];
  const updated_option = { ...option, ...payload };
  const updated_options = [...column.options];
  updated_options[option_index] = updated_option;
  const updated_column = { ...column, options: updated_options };

  dispatch(
    setColumns({
      columns: { ...columns, [columnID]: updated_column },
      columns_by_id,
      column_id_map,
    }),
  );
  dispatch(setListPendingUpdate(true));
  dispatch(syncList());
  return updated_options;
};

export const getRowByIndex = (row_index: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { rows, rows_by_id },
  } = getState();
  const row_id = rows_by_id[row_index];
  return rows[row_id];
};

export const createSmartList = (smart_list_name: string): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('createSmartList');

  const {
    lists: {
      filters,
      filters_by_id,
      selected_list,
      column_id_map,
      smart_lists,
      smart_lists_by_id,
      columns,
    },
  } = getState();

  const filter_payload = generateFilterPayload(filters, filters_by_id, column_id_map, columns);
  const payload = {
    table_id: selected_list,
    filters: filter_payload,
    name: smart_list_name,
  };

  try {
    const {
      data: { smart_list },
    } = await client('smart_lists/create', {
      method: 'POST',
      data: payload,
    });

    const data = {
      ...smart_lists,
      [smart_list.id]: { ...smart_list, list_id: selected_list },
    };
    const by_id = [...smart_lists_by_id, smart_list.id];
    dispatch(setSmartLists({ data, by_id }));
    return smart_list;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const updateSmartListFilters = (smart_list_id: string): AppThunk => async (
  dispatch,
  getState,
) => {
  sendAmplitudeData('updateSmartListFilters');

  const {
    lists: { filters, filters_by_id, column_id_map, columns },
  } = getState();

  const payload = {
    filters: generateFilterPayload(filters, filters_by_id, column_id_map, columns),
  };
  dispatch(updateSmartList(smart_list_id, payload));
};

export const clearFilters = (): AppThunk => async dispatch => {
  await dispatch(
    setFilterData({
      data: {},
      by_id: [],
    }),
  );
  dispatch(applyFilter());
};

export const fetchSmartLists = (): AppThunk => async dispatch => {
  dispatch(setSmartListsLoading({ is_loading: true }));
  try {
    const {
      data: { smart_lists },
    } = await client('smart_lists/all', { method: 'GET' });
    const data = {};
    const by_id: [] = [];
    smart_lists.forEach((i: any) => {
      const { smart_id: id, smart_lists_name: name, table_id: list_id, filters } = i;
      data[id] = { id, name: name || 'Untitled', list_id, filters };
      by_id.push(id);
    });
    dispatch(setSmartLists({ data, by_id }));
    dispatch(setSmartListsLoading({ is_loading: false }));
    return data;
  } catch (e) {
    dispatch(setSmartListsLoading({ is_loading: false }));
    return null;
  }
};

export const fetchListFavorites = (): AppThunk => async dispatch => {
  dispatch(setFavoritesLoading({ is_loading: true }));
  try {
    const {
      data: { table },
    } = await client('tables/favourites', { method: 'GET' });
    const favorites = table.map((i: any) => i.id);
    dispatch(setFavorites(favorites));
    dispatch(setFavoritesLoading({ is_loading: false }));
    return favorites;
  } catch (e) {
    dispatch(setFavoritesLoading({ is_loading: false }));
    return null;
  }
};

export const markListFavorite = (list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { favorites, favorites_pending_mark },
  } = getState();

  sendAmplitudeData('markListFavorite');

  const updated_favorites = [...favorites, list_id];
  const updated_favorites_pending_mark = [...favorites_pending_mark, list_id];

  dispatch(setFavorites(updated_favorites));
  dispatch(setFavoritesPendingMark(updated_favorites_pending_mark));
  dispatch(syncLists());
};

export const unMarkListFavorite = (list_id: string): AppThunk => async (dispatch, getState) => {
  const {
    lists: { favorites, favorites_pending_unmark },
  } = getState();

  sendAmplitudeData('unMarkListFavorite');

  const updated_favorites = favorites.filter((id: string) => id !== list_id);
  const updated_favorites_pending_unmark = [...favorites_pending_unmark, list_id];

  dispatch(setFavorites(updated_favorites));
  dispatch(setFavoritesPendingUnmark(updated_favorites_pending_unmark));
  dispatch(syncLists());
};

export const fetchListTrash = (): AppThunk => async dispatch => {
  dispatch(setTrashLoading({ is_loading: true }));
  try {
    const {
      data: { table },
    } = await client('tables/trash', { method: 'GET' });

    const data = {};
    const by_id = [];

    table.forEach((i: any) => {
      data[i.id] = i;
      by_id.push(i.id);
    });

    dispatch(setTrash({ data, by_id }));
    dispatch(setTrashLoading({ is_loading: false }));
    return favorites;
  } catch (e) {
    dispatch(setTrashLoading({ is_loading: false }));
    return null;
  }
};

export const updateSearchQuery = (value: string): AppThunk => async dispatch => {
  dispatch(setSearchQuery(value));
  dispatch(applySearch());
};

export const fetchInitialContactList = (): AppThunk => async dispatch => {
  try {
    const {
      data: { table },
    } = await client('table/type/contact', { method: 'GET' });
    dispatch(setInitialList(table.id));
  } catch (e) {
    return null;
  }
};

export const enrichColumnData = (tracked_column: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const {
    lists: { selected_list, selected_smart_list, columns },
  } = getState();

  sendAmplitudeData('enrichColumnData');

  try {
    const already_enriched: boolean = !!Object.values(columns).find(
      (i: any) => i.type === 'DND' && i.customization.tracked_column === tracked_column,
    );

    if (!already_enriched) {
      await dispatch(
        createColumn({
          name: 'is_dnd',
          label: 'On DND',
          type: 'DND',
          customization: {
            tracked_column: tracked_column,
          },
        }),
      );
    }

    await client('lookups/queue', {
      method: 'POST',
      data: {
        tracked_column,
        table_id: !selected_smart_list ? selected_list : null,
        smart_list_id: selected_smart_list ? selected_smart_list : null,
      },
    });

    await wait(2000);
    dispatch(resetRows());
    dispatch(fetchRows({ list: selected_list, page: 1 }));
    return true;
  } catch (e) {
    return null;
  }
};

export const requestGoogleSheetsAuth = (resourceName: string): AppThunk => async () => {
  const response = await client('lists/resource/google-sheets/auth/request', {
    method: 'GET',
    params: {
      name: resourceName,
    },
  });
  return response.data['auth_url'];
};

export const fetchGSheetSpreadSheets = (resourceID: string): AppThunk => async () => {
  const response = await client(`lists/resource/google-sheets/sheets/${resourceID}`, {
    method: 'GET',
  });
  return response.data;
};

export const fetchGSheetMetadata = (
  resourceID: string,
  spreadsheetID: string,
): AppThunk => async () => {
  const response = await client('lists/resource/google-sheets/schema', {
    method: 'POST',
    data: {
      resource: resourceID,
      spreadsheet: spreadsheetID,
    },
  });
  return response.data;
};

export const queueResourceImport = (
  payload: {
    name: string;
    source: string;
    sub_source: string;
    mapping: any[];
  },
  resourceType: string = 'google-sheets',
): AppThunk => async dispatch => {
  const response = await client(`lists/resource/${resourceType}/import`, {
    method: 'POST',
    data: payload,
  });
  dispatch(addList(response.data));
  return response.data;
};

export const queueAppImport = (
  payload: {
    name: string;
    source: string;
    sub_source: string | null;
    mapping: any[];
  },
  resourceType: string = 'shopify',
): AppThunk => async dispatch => {
  const response = await client('', {
    url: buildAppsURL(`/${resourceType}/endpoints/import`),
    method: 'POST',
    data: payload,
  });
  dispatch(addList(response.data));
  return response.data;
};

export * from './thunks';
