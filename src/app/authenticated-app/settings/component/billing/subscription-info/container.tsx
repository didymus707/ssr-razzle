import React from 'react';
import { RootState } from '../../../../../../root';
import { SubscriptionInfoComponent as Component } from './component';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  billing: state.billing,
});

const stateConnector = connect(mapStateToProps, {});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const SubscriptionInfo = stateConnector(Container);
