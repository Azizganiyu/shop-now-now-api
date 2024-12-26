export enum TransactionType {
  deposit = 'Deposit',
  withdrawal = 'Withdrawal',
}

export enum TransactionPurpose {
  deposit = 'Deposit',
  withdrawal = 'Withdrawal',
  reversal = 'Reversal',
  order = 'Order Payment',
}

export enum TransactionStatus {
  pending = 'Pending',
  success = 'Success',
  failed = 'Failed',
  queued = 'Queued',
  blocked = 'Blocked',
}

export interface Beneficiary {
  accountName: string;
  bankName?: string;
  accountNumber: string;
  bankCode: string;
}
