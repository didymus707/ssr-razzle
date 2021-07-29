import React from 'react';
import { Component } from './component';
import { RootState } from '../../../../../root';
import {
  selectList,
  fetchRows,
  updateColumnArrangement,
  updateRowCell,
  createColumn,
  createRow,
  selectRows,
  clearRows,
  deleteRows,
  updateListName,
  deleteColumn,
  hideColumn,
  showColumn,
  updateColumnLabel,
  updateColumnType,
  addFilter,
  updateFilter,
  deleteFilter,
  addSort,
  deleteSort,
  updateSort,
  deleteList,
  addSelectOption,
  updateSelectOption,
  getRowByIndex,
  updateColumnCustomization,
  updateColumn,
  createSmartList,
  updateSmartList,
  deleteSmartList,
  selectSmartList,
  selectSmartListID,
  updateSmartListFilters,
  clearFilters,
  updateSearchQuery,
  enrichColumnData,
} from '../../lists.reducer';

import { openNoSubscriptionModal } from '../../../globals';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  ...state.lists,
});

const stateConnector = connect(mapStateToProps, {
  selectList,
  fetchRows,
  updateColumnArrangement,
  updateRowCell,
  createColumn,
  createRow,
  selectRows,
  clearRows,
  deleteRows,
  updateListName,
  deleteColumn,
  hideColumn,
  showColumn,
  updateColumnLabel,
  updateColumnType,
  addFilter,
  updateFilter,
  deleteFilter,
  addSort,
  updateSort,
  deleteSort,
  deleteList,
  addSelectOption,
  updateSelectOption,
  getRowByIndex,
  updateColumnCustomization,
  updateColumn,
  createSmartList,
  selectSmartList,
  updateSmartList,
  deleteSmartList,
  selectSmartListID,
  updateSmartListFilters,
  clearFilters,
  updateSearchQuery,
  openNoSubscriptionModal,
  enrichColumnData,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const ListView = stateConnector(Container);
