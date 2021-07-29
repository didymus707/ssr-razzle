export interface PaymentRequest {
  id: string;
  amount: number;
  order_type: 'delivery' | 'pickup' | null;
  invoice_number: string | null;
  platform_name: string;
  platform_nick: string;
  code: string;
  channel: string;
  cancelled: boolean;
  cancel_date: string;
  paid: boolean;
  payment_date: string;
  expired: boolean;
  expiry_date: string | null;
  created_datetime: string;
}

export interface ManagedAccountTransaction {
  id: string;
  provider_code: string;
  code: string;
  amount: number;
  amount_total: number;
  fee: number;
  type: 'credit' | 'debit';
  created_datetime: string;
}

export interface Card {
  id: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  currency: string;
  country: string;
  brand: string;
  name: string | null;
  bank_name: string | null;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  provider: string;
  provider_code: string;
  currency: string;
  country: string;
}

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
}

export type OnboardingStage =
  | 'get-started'
  | 'id-information'
  | 'account-owner'
  | 'business-details'
  | 'summary';

export type UploadedFile = {
  src: string;
  format: string;
  fileName: string;
} | null;

export type Meta = {
  page: number;
  per_page: number;
  count_total: number;
  page_total: number;
  prev_page: boolean;
  next_page: boolean;
};

export type PaymentSetupStatus = 'pristine' | 'pending' | 'submitted' | 'approved' | 'completed';
