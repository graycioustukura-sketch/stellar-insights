import { useCallback } from 'react'
import { useWalletTransaction } from '../contexts/WalletTransactionContext'

/**
 * Hook for integrating Soroban transactions with the signature indicator
 * Provides a wrapper around transaction signing that automatically manages indicator state
 */
export function useSorobanTransaction() {
  const {
    setPendingSignature,
    setTransactionSigned,
    setTransactionRejected,
    setTransactionError,
    resetTransaction,
    transactionState,
  } = useWalletTransaction()

  /**
   * Wraps a transaction signing function with automatic indicator management
   * 
   * @param signFn - Async function that signs the transaction
   * @param options - Optional configuration
   * @returns Promise that resolves with the signed transaction
   * 
   * @example
   * const { executeTransaction } = useSorobanTransaction()
   * 
   * const result = await executeTransaction(async () => {
   *   return await window.freighter.signTransaction(tx)
   * })
   */
  const executeTransaction = useCallback(
    async <T>(
      signFn: () => Promise<T>,
      options?: {
        transactionId?: string
        autoReset?: boolean
        resetDelay?: number
      }
    ): Promise<T> => {
      const { transactionId, autoReset = true, resetDelay = 1000 } = options || {}

      try {
        // Show indicator
        setPendingSignature(transactionId)

        // Execute signing function
        const result = await signFn()

        // Mark as signed
        setTransactionSigned()

        // Auto-reset if enabled
        if (autoReset) {
          setTimeout(() => {
            resetTransaction()
          }, resetDelay)
        }

        return result
      } catch (error) {
        // Handle different error types
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase()

          if (
            errorMessage.includes('reject') ||
            errorMessage.includes('cancel') ||
            errorMessage.includes('denied')
          ) {
            setTransactionRejected()
          } else {
            setTransactionError(error.message)
          }
        } else {
          setTransactionError('Unknown error occurred')
        }

        // Auto-reset on error
        if (autoReset) {
          setTimeout(() => {
            resetTransaction()
          }, resetDelay * 2) // Longer delay for errors
        }

        throw error
      }
    },
    [
      setPendingSignature,
      setTransactionSigned,
      setTransactionRejected,
      setTransactionError,
      resetTransaction,
    ]
  )

  /**
   * Manually control the indicator state
   */
  const manualControl = {
    showPending: setPendingSignature,
    markSigned: setTransactionSigned,
    markRejected: setTransactionRejected,
    markError: setTransactionError,
    reset: resetTransaction,
  }

  return {
    executeTransaction,
    transactionState,
    ...manualControl,
  }
}

/**
 * Example usage with Freighter wallet:
 * 
 * ```tsx
 * import { useSorobanTransaction } from '@/hooks/useSorobanTransaction'
 * 
 * function MyComponent() {
 *   const { executeTransaction } = useSorobanTransaction()
 * 
 *   const handleSend = async () => {
 *     try {
 *       const signed = await executeTransaction(async () => {
 *         return await window.freighter.signTransaction(transaction, {
 *           network: 'TESTNET',
 *           networkPassphrase: Networks.TESTNET,
 *         })
 *       }, {
 *         transactionId: transaction.hash().toString('hex')
 *       })
 * 
 *       // Submit to network
 *       await submitTransaction(signed)
 *     } catch (error) {
 *       console.error('Transaction failed:', error)
 *     }
 *   }
 * 
 *   return <button onClick={handleSend}>Send Payment</button>
 * }
 * ```
 */
