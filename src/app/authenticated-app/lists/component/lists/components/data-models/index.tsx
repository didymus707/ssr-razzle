import React from 'react';
import { RootState } from '../../../../../../../root';
import { connect } from 'react-redux';
import { Component } from './component';
import { createDataModel, deleteDataModel, fetchResourceSchema } from '../../../../thunks';

const mapStateToProps = (state: RootState) => ({});

const stateConnector = connect(mapStateToProps, {
  fetchResourceSchema,
  createDataModel,
  deleteDataModel,
});

const Container = (props: any) => <Component {...props} />;

export const DataModels = stateConnector(Container);
