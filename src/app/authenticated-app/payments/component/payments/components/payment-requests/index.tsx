import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../../../root';
import {
  cancelPaymentRequest,
  fetchPaymentRequests,
  markPaymentRequestPaid,
} from '../../../../thunks';
import { PaymentRequestsComponent as Component } from './component';

const mapStateToProps = (state: RootState) => ({
  ...state.payments,
});

const stateConnector = connect(mapStateToProps, {
  fetchPaymentRequests,
  cancelPaymentRequest,
  markPaymentRequestPaid,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const PaymentRequests = stateConnector(Container);
