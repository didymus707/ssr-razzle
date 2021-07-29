import React from 'react';
import { RootState } from 'root';
import { connect } from 'react-redux';
import { Component } from './component';
import {
  createResource,
  requestResourceAuth,
  testResourceConnection,
  deleteResource,
  updateResource,
  requestAppResourceAuth,
  submitAppResourceAuth,
  enableResourceWebhook,
  disableResourceWebhook,
} from 'app/authenticated-app/lists/thunks';

const mapStateToProps = (state: RootState) => ({});

const stateConnector = connect(mapStateToProps, {
  deleteResource,
  updateResource,
  requestResourceAuth,
  testResourceConnection,
  createResource,
  requestAppResourceAuth,
  submitAppResourceAuth,
  enableResourceWebhook,
  disableResourceWebhook,
});

const Container = (props: any) => <Component {...props} />;

export const ListResources = stateConnector(Container);
