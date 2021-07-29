import { listsSlice } from './lists.slice';
import { resourcesSlice, dataModelsSlice, segmentsSlice } from './slices';

export const {
  setLists,
  setListsLoading,
  setSelectedList,
  setRows,
  setRowsLoading,
  resetSelectedList,
  setColumnArrangement,
  setRowCell,
  setListPendingUpdate,
  setListSyncing,
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
  resetRows,
  setSortData,
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
} = listsSlice.actions;

export const { setResourcesData, setResourcesLoading } = resourcesSlice.actions;
export const { setDataModelsData, setDataModelsLoading } = dataModelsSlice.actions;
export const { setSegmentsData, setSegmentsLoading } = segmentsSlice.actions;

export * from './lists.thunks';

export const listsReducer = listsSlice.reducer;
export const dataModelsReducer = dataModelsSlice.reducer;
export const segmentsReducer = segmentsSlice.reducer;
export const resourcesReducer = resourcesSlice.reducer;
