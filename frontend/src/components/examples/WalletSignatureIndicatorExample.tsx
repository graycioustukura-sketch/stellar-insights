'use client'

import { useState } from 'react'
import { useWalletTransaction } from '../../contexts/WalletTransactionContext'

/**
 * Example component demonstrating how to integrate the WalletSignatureIndicator
 * with Soroban transaction flows
 */
export function WalletSignatureIndicatorExample() {
  const {
    setPendingSignature,
    setTransactionSigned,
    setTransactionRejected,
    setTransactionError,
    resetTransaction,
    transactionState,
  } = useWalletTransaction()

  const [isProcessing, setIsProcessing] = useState(false)

  /**
   * Simulates a Soroban transaction that requires wallet signature
   */
  const handleSorobanTransaction = async () => {
    setIsProcessing(true)
    
    try {
      // Generate transaction ID (in real app, this comes from Soroban SDK)
      const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Set pending state - this triggers the indicator to appear
      setPendingSignature(txId)
      
      // Simulate wallet signature request
      // In real implementation, this would be:
      // const signedTx = await window.freighter.signTransaction(transaction)
      await simulateWalletSignature()
      
      // Transaction signed successfully
      setTransactionSigned()
      
      // Optional: Reset after a delay to allow user to see success state
      setTimeout(() => {
        resetTransaction()
      }, 1000)
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('rejected')) {
          setTransactionRejected()
        } else {
          setTransactionError(error.message)
        }
      }
      
      // Reset after showing error
      setTimeout(() => {
        resetTransaction()
      }, 2000)
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Simulates wallet signature process
   * In production, replace with actual wallet integration
   */
  const simulateWalletSignature = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate user interaction delay
      setTimeout(() => {
        const random = Math.random()
        if (random > 0.8) {
          reject(new Error('User rejected the transaction'))
        } else if (random > 0.7) {
          reject(new Error('Network timeout'))
        } else {
          resolve()
        }
      }, 2000)
    })
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wallet Signature Indicator Demo</h2>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm font-medium mb-2">Current Status:</p>
        <p className="text-lg font-mono">{transactionState.status}</p>
        {transactionState.transactionId && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            TX: {transactionState.transactionId}
          </p>
        )}
        {transactionState.error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Error: {transactionState.error}
          </p>
        )}
      </div>

      <button
        onClick={handleSorobanTransaction}
        disabled={isProcessing}
        className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isProcessing ? 'Processing...' : 'Send Soroban Transaction'}
      </button>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Click the button to simulate a Soroban transaction. Watch the bottom-right corner
          for the signature indicator with breathing animation.
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Integration Notes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Indicator appears automatically when transaction is pending</li>
          <li>Disappears immediately when signed or rejected</li>
          <li>Non-blocking - doesn't interfere with UI interactions</li>
          <li>Respects prefers-reduced-motion settings</li>
          <li>Accessible with ARIA live regions</li>
        </ul>
      </div>
    </div>
  )
}
