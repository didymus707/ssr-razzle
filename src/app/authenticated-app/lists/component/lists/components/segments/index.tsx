import React from 'react';
import { RootState } from 'root';
import { connect } from 'react-redux';
import { Component } from './component';
import { createSegment, deleteSegment, fetchDataModel } from 'app/authenticated-app/lists/thunks';

const mapStateToProps = (state: RootState) => ({});

const stateConnector = connect(mapStateToProps, {
  fetchDataModel,
  createSegment,
  deleteSegment,
});

const Container = (props: any) => <Component {...props} />;

export const Segments = stateConnector(Container);
