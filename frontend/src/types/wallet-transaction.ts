/**
 * Wallet transaction state types for Soroban transactions
 */

export enum WalletTransactionStatus {
  IDLE = 'idle',
  PENDING_SIGNATURE = 'pending_signature',
  SIGNED = 'signed',
  REJECTED = 'rejected',
  ERROR = 'error',
}

export interface WalletTransactionState {
  status: WalletTransactionStatus
  transactionId?: string
  error?: string
}
