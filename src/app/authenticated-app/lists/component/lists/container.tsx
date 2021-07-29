import React from 'react';
import { RootState } from '../../../../../root';
import { connect } from 'react-redux';
import {
  deleteList,
  deleteListPermanently,
  deleteSmartList,
  deleteTrashPermanently,
  markListFavorite,
  resetSelectedList,
  restoreList,
  unMarkListFavorite,
  updateList,
  updateSmartList,
} from '../../lists.reducer';
import { openNoSubscriptionModal } from '../../../globals';
import { Component } from './component';
import { Redirect, Route, Switch } from 'react-router-dom';

const mapStateToProps = (state: RootState) => ({
  ...state.lists,
});

const stateConnector = connect(mapStateToProps, {
  resetSelectedList,
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
});

const Container = (props: any) => (
  <Switch>
    <Route path="/s/lists/segments*">
      <Component {...props} selectedTab="segments" />
    </Route>
    <Route path="/s/lists/connections*">
      <Component {...props} selectedTab="connections" />
    </Route>
    <Route path="/s/lists/data-models*">
      <Component {...props} selectedTab="data-models" />
    </Route>
    <Route path="/s/lists/smart">
      <Component {...props} selectedTab="smart" />
    </Route>
    <Route path="/s/lists/smart">
      <Component {...props} selectedTab="smart" />
    </Route>
    <Route path="/s/lists/favorites">
      <Component {...props} selectedTab="favorites" />
    </Route>
    <Route path="/s/lists/trash">
      <Component {...props} selectedTab="trash" />
    </Route>
    <Route path="/s/lists/lists*">
      <Component {...props} selectedTab="lists" />
    </Route>
    <Redirect to="/s/lists/lists" />
  </Switch>
);

export const Lists = stateConnector(Container);
