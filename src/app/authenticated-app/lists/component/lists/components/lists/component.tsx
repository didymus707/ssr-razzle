import React from 'react';
import { List, SmartList } from '../../../../lists.types';
import { Component as ListLists } from './list-lists';
import { Route, Switch } from 'react-router';
import { CreateList } from './create-list';

interface Props {
  importedData: any;
  lists: List[];
  smart_lists: SmartList[];
  favorite_lists: List[];
  trash_lists: List[];
  favorites: string[];
  openCreateTableModal: Function;
  searchValue: string;
  visualization: string;
  updateList: Function;
  deleteList: Function;
  restoreList: Function;
  deleteListPermanently: Function;
  deleteSmartList: Function;
  updateSmartList: Function;
  markListFavorite: Function;
  unMarkListFavorite: Function;
  selectedTab: string;
  selectTab: Function;
  initial_list: string;
  openNoSubscriptionModal: Function;
  deleteTrashPermanently: Function;
  addList: Function;
  addListFromTemplate: Function;
  handleImport: Function;
  handleImportMapping: Function;
  handleImportNewTable: Function;
  fetchGSheetSpreadSheets: Function;
  fetchGSheetMetadata: Function;
  queueResourceImport: Function;
  queueAppImport: Function;
  fetchResourceSchema: Function;
  fetchAppEndpoints: Function;
  fetchAppEndpointSchema: Function;
}

export const Component = (props: Props) => {
  const {
    importedData,
    addList,
    addListFromTemplate,
    openNoSubscriptionModal,
    handleImport,
    handleImportMapping,
    handleImportNewTable,
    fetchGSheetSpreadSheets,
    fetchGSheetMetadata,
    queueResourceImport,
    queueAppImport,
    fetchResourceSchema,
    fetchAppEndpoints,
    fetchAppEndpointSchema,
  } = props;

  return (
    <Switch>
      <Route exact path="/s/lists/lists/new">
        <CreateList
          {...{
            importedData,
            addList,
            addListFromTemplate,
            openNoSubscriptionModal,
            handleImport,
            handleImportMapping,
            handleImportNewTable,
            fetchGSheetSpreadSheets,
            fetchGSheetMetadata,
            queueResourceImport,
            queueAppImport,
            fetchResourceSchema,
            fetchAppEndpoints,
            fetchAppEndpointSchema,
          }}
        />
      </Route>
      <Route path="/s/lists/*">
        <ListLists {...props} />
      </Route>
    </Switch>
  );
};
