import React from 'react';
import { RootState } from '../../../../../../root';
import { connect } from 'react-redux';
import { ChangePlanComponent as Component } from './component';
import {
  fetchSubscriptionPlans,
  fetchSubscription,
  fetchCards,
  createSubscription,
} from '../../../thunks';
import { fetchWallet } from '../../../../payments';

const mapStateToProps = (state: RootState) => ({
  billing: state.billing,
  payments: state.payments,
  cards: state.payment.cards,
});

const stateConnector = connect(mapStateToProps, {
  fetchSubscriptionPlans,
  fetchSubscription,
  fetchWallet,
  fetchCards,
  createSubscription,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const ChangePlan = stateConnector(Container);
