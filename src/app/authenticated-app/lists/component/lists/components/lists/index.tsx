import React from 'react';
import { RootState } from '../../../../../../../root';
import { Component } from './component';
import { connect } from 'react-redux';
import {
  deleteList,
  deleteListPermanently,
  deleteSmartList,
  deleteTrashPermanently,
  fetchAppEndpoints,
  fetchAppEndpointSchema,
  fetchGSheetMetadata,
  fetchGSheetSpreadSheets,
  fetchResourceSchema,
  markListFavorite,
  queueAppImport,
  queueResourceImport,
  restoreList,
  unMarkListFavorite,
  updateList,
  updateSmartList,
} from '../../../../lists.reducer';
import { openNoSubscriptionModal, openCreateTableModal } from '../../../../../globals';

import { List, SmartList } from '../../../../lists.types';
import { sortListByTime } from '../../../../lists.utils';

const mapStateToProps = (state: RootState) => ({
  ...state.lists,
});

const stateConnector = connect(mapStateToProps, {
  updateList,
  deleteList,
  restoreList,
  deleteSmartList,
  updateSmartList,
  markListFavorite,
  unMarkListFavorite,
  deleteListPermanently,
  openNoSubscriptionModal,
  openCreateTableModal,
  deleteTrashPermanently,
  fetchGSheetSpreadSheets,
  fetchGSheetMetadata,
  queueResourceImport,
  queueAppImport,
  fetchResourceSchema,
  fetchAppEndpoints,
  fetchAppEndpointSchema,
});

const Container = (props: any) => {
  const { visualization, searchValue, selectedTab, initial_list, selectTab } = props;

  const {
    updateList,
    deleteList,
    restoreList,
    deleteSmartList,
    updateSmartList,
    markListFavorite,
    unMarkListFavorite,
    deleteListPermanently,
    openNoSubscriptionModal,
    deleteTrashPermanently,
    openCreateTableModal,
    addList,
    addListFromTemplate,
    handleImport,
    handleImportMapping,
    handleImportNewTable,
    importedData,
    fetchGSheetSpreadSheets,
    fetchGSheetMetadata,
    queueResourceImport,
    queueAppImport,
    fetchResourceSchema,
    fetchAppEndpoints,
    fetchAppEndpointSchema,
  } = props;

  let lists = props.lists_by_id.map((list_id: string) => props.lists[list_id]);
  lists = lists.filter((list: List) => list.name.toLowerCase().includes(searchValue.toLowerCase()));

  lists = lists.sort(sortListByTime);

  let smart_lists = props.smart_lists_by_id.map(
    (smart_list_id: string) => props.smart_lists[smart_list_id],
  );

  smart_lists = smart_lists.filter((smart_list: SmartList) =>
    smart_list?.name?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  smart_lists = smart_lists.sort(sortListByTime);

  let favorite_lists = props.favorites.map((list_id: string) => props.lists[list_id]);

  favorite_lists = favorite_lists.filter((list: List) =>
    list.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  favorite_lists = favorite_lists.sort(sortListByTime);

  let trash_lists = props.trash_by_id.map((list_id: string) => props.trash[list_id]);

  trash_lists = trash_lists.filter((list: List) =>
    list.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  trash_lists = trash_lists.sort(sortListByTime);

  return (
    <Component
      {...{
        initial_list,
        visualization,
        selectedTab,
        selectTab,
        trash_lists,
        favorite_lists,
        favorites: props.favorites,
        smart_lists,
        lists,
        searchValue,
        updateList,
        deleteList,
        restoreList,
        deleteSmartList,
        updateSmartList,
        markListFavorite,
        unMarkListFavorite,
        deleteListPermanently,
        openNoSubscriptionModal,
        deleteTrashPermanently,
        openCreateTableModal,
        addList,
        addListFromTemplate,
        handleImport,
        handleImportMapping,
        handleImportNewTable,
        importedData,
        fetchGSheetSpreadSheets,
        fetchGSheetMetadata,
        queueResourceImport,
        queueAppImport,
        fetchResourceSchema,
        fetchAppEndpoints,
        fetchAppEndpointSchema,
      }}
    />
  );
};

export const Lists = stateConnector(Container);
