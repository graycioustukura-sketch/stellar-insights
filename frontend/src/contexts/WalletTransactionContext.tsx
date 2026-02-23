'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { WalletTransactionStatus, WalletTransactionState } from '../types/wallet-transaction'

interface WalletTransactionContextType {
  transactionState: WalletTransactionState
  setPendingSignature: (transactionId?: string) => void
  setTransactionSigned: () => void
  setTransactionRejected: () => void
  setTransactionError: (error: string) => void
  resetTransaction: () => void
}

const WalletTransactionContext = createContext<WalletTransactionContextType | undefined>(undefined)

const initialState: WalletTransactionState = {
  status: WalletTransactionStatus.IDLE,
}

export function WalletTransactionProvider({ children }: { children: ReactNode }) {
  const [transactionState, setTransactionState] = useState<WalletTransactionState>(initialState)

  const setPendingSignature = useCallback((transactionId?: string) => {
    setTransactionState({
      status: WalletTransactionStatus.PENDING_SIGNATURE,
      transactionId,
    })
  }, [])

  const setTransactionSigned = useCallback(() => {
    setTransactionState({
      status: WalletTransactionStatus.SIGNED,
    })
  }, [])

  const setTransactionRejected = useCallback(() => {
    setTransactionState({
      status: WalletTransactionStatus.REJECTED,
    })
  }, [])

  const setTransactionError = useCallback((error: string) => {
    setTransactionState({
      status: WalletTransactionStatus.ERROR,
      error,
    })
  }, [])

  const resetTransaction = useCallback(() => {
    setTransactionState(initialState)
  }, [])

  return (
    <WalletTransactionContext.Provider
      value={{
        transactionState,
        setPendingSignature,
        setTransactionSigned,
        setTransactionRejected,
        setTransactionError,
        resetTransaction,
      }}
    >
      {children}
    </WalletTransactionContext.Provider>
  )
}

export function useWalletTransaction() {
  const context = useContext(WalletTransactionContext)
  if (!context) {
    throw new Error('useWalletTransaction must be used within a WalletTransactionProvider')
  }
  return context
}
