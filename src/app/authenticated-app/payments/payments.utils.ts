import moment from 'moment';
import { ManagedAccountTransaction, OnboardingStage, PaymentRequest } from './payments.types';
import { GetStarted } from './component/onboarding/components/content/get-started';
import { AccountOwner } from './component/onboarding/components/content/account-owner';
import { BusinessDetails } from './component/onboarding/components/content/business-details';
import { Summary } from './component/onboarding/components/content/summary';
import { IDInformation } from './component/onboarding/components/content/id-information';

export const getPaymentOnboardingContentComponent = (stage: OnboardingStage) => {
  if (stage === 'get-started') return GetStarted;
  if (stage === 'id-information') return IDInformation;
  if (stage === 'account-owner') return AccountOwner;
  if (stage === 'business-details') return BusinessDetails;
  if (stage === 'summary') return Summary;
  return GetStarted;
};

export const getPaymentRequestStatusText = (payment_request: PaymentRequest) => {
  if (payment_request.paid) return 'Paid';
  if (payment_request.expired) return 'Expired';
  if (payment_request.cancelled) return 'Cancelled';
  return 'Sent';
};

export const getPaymentRequestStatusColor = (payment_request: PaymentRequest) => {
  if (payment_request.paid) return { text: '#03C49F', bg: '#E2F7F1' };
  if (payment_request.expired) return { text: '#e75454', bg: '#ffd9d9' };
  if (payment_request.cancelled) return { text: '#e75454', bg: '#ffd9d9' };
  return { text: '#8A9BA7', bg: '#F4F6F9' };
};

export const getPaymentRequestStatusIcon = (payment_request: PaymentRequest) => {
  if (payment_request.paid) return 'check';
  if (payment_request.expired) return 'repeat-clock';
  if (payment_request.cancelled) return 'small-close';
  return 'send';
};

export const getPaymentRequestStatusDate = (payment_request: PaymentRequest) => {
  const date_format = 'DD/MM, hh:mm';
  // if (payment_request.paid) return moment(payment_request.payment_date).format(date_format);
  // if (payment_request.expired) return moment(payment_request.expiry_date).format(date_format);
  // if (payment_request.cancelled) return moment(payment_request.cancel_date).format(date_format);
  return moment(payment_request.created_datetime).format(date_format);
};

export const getTransactionHistoryTypeColor = (transaction: ManagedAccountTransaction) => {
  if (transaction.type === 'credit') return { text: '#03C49F', bg: '#E2F7F1' };
  return { text: '#e75454', bg: '#ffd9d9' };
};

export const getTransactionHistoryTypeIcon = (transaction: ManagedAccountTransaction) => {
  if (transaction.type === 'credit') return 'arrow-up';
  return 'arrow-down';
};
