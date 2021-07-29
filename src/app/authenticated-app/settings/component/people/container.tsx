import React from 'react';
import { PeopleComponent as Component } from './component';
import { RootState } from '../../../../../root';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  people: state.teams.organisationMembers,
});

const stateConnector = connect(mapStateToProps, {});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const People = stateConnector(Container);
