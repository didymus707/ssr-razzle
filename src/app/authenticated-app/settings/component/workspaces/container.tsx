import React from 'react';
import { WorkspacesComponent as Component } from './component';
import { RootState } from '../../../../../root';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({});

const stateConnector = connect(mapStateToProps, {});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const WorkSpaces = stateConnector(Container);
