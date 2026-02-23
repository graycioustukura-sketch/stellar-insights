import { renderHook, act, waitFor } from '@testing-library/react'
import { useSorobanTransaction } from '../hooks/useSorobanTransaction'
import { WalletTransactionProvider } from '../contexts/WalletTransactionContext'
import { WalletTransactionStatus } from '../types/wallet-transaction'
import { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <WalletTransactionProvider>{children}</WalletTransactionProvider>
}

describe('useSorobanTransaction', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('executeTransaction', () => {
    it('should execute successful transaction with indicator', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockResolvedValue('signed-tx-data')

      let promise: Promise<string>
      act(() => {
        promise = result.current.executeTransaction(mockSignFn)
      })

      // Should show pending state
      await waitFor(() => {
        expect(result.current.transactionState.status).toBe(
          WalletTransactionStatus.PENDING_SIGNATURE
        )
      })

      // Wait for transaction to complete
      const signedData = await promise!

      // Should mark as signed
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)
      expect(signedData).toBe('signed-tx-data')
      expect(mockSignFn).toHaveBeenCalledTimes(1)
    })

    it('should auto-reset after successful transaction', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockResolvedValue('signed-tx')

      await act(async () => {
        await result.current.executeTransaction(mockSignFn, {
          autoReset: true,
          resetDelay: 500,
        })
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
      })
    })

    it('should handle transaction rejection', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockRejectedValue(new Error('User rejected the transaction'))

      await act(async () => {
        try {
          await result.current.executeTransaction(mockSignFn)
        } catch (error) {
          // Expected to throw
        }
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.REJECTED)
    })

    it('should handle transaction errors', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockRejectedValue(new Error('Network timeout'))

      await act(async () => {
        try {
          await result.current.executeTransaction(mockSignFn)
        } catch (error) {
          // Expected to throw
        }
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.ERROR)
      expect(result.current.transactionState.error).toBe('Network timeout')
    })

    it('should store transaction ID when provided', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockResolvedValue('signed-tx')
      const txId = 'tx-abc-123'

      act(() => {
        result.current.executeTransaction(mockSignFn, { transactionId: txId })
      })

      await waitFor(() => {
        expect(result.current.transactionState.transactionId).toBe(txId)
      })
    })

    it('should not auto-reset when disabled', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockResolvedValue('signed-tx')

      await act(async () => {
        await result.current.executeTransaction(mockSignFn, {
          autoReset: false,
        })
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Should still be signed
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)
    })

    it('should use longer delay for error reset', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockRejectedValue(new Error('Failed'))

      await act(async () => {
        try {
          await result.current.executeTransaction(mockSignFn, {
            autoReset: true,
            resetDelay: 1000,
          })
        } catch (error) {
          // Expected
        }
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.ERROR)

      // Should not reset after normal delay
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.ERROR)

      // Should reset after double delay
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
      })
    })

    it('should detect cancellation errors', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const cancellationErrors = [
        'User cancelled the transaction',
        'Transaction denied by user',
        'User rejected signature',
      ]

      for (const errorMsg of cancellationErrors) {
        const mockSignFn = jest.fn().mockRejectedValue(new Error(errorMsg))

        await act(async () => {
          try {
            await result.current.executeTransaction(mockSignFn)
          } catch (error) {
            // Expected
          }
        })

        expect(result.current.transactionState.status).toBe(WalletTransactionStatus.REJECTED)

        // Reset for next iteration
        act(() => {
          result.current.reset()
        })
      }
    })

    it('should handle non-Error exceptions', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn = jest.fn().mockRejectedValue('String error')

      await act(async () => {
        try {
          await result.current.executeTransaction(mockSignFn)
        } catch (error) {
          // Expected
        }
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.ERROR)
      expect(result.current.transactionState.error).toBe('Unknown error occurred')
    })
  })

  describe('Manual control', () => {
    it('should provide manual control methods', () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      expect(result.current.showPending).toBeDefined()
      expect(result.current.markSigned).toBeDefined()
      expect(result.current.markRejected).toBeDefined()
      expect(result.current.markError).toBeDefined()
      expect(result.current.reset).toBeDefined()
    })

    it('should allow manual state control', () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      act(() => {
        result.current.showPending('manual-tx-id')
      })

      expect(result.current.transactionState.status).toBe(
        WalletTransactionStatus.PENDING_SIGNATURE
      )
      expect(result.current.transactionState.transactionId).toBe('manual-tx-id')

      act(() => {
        result.current.markSigned()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)

      act(() => {
        result.current.reset()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle sequential transactions', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      // First transaction
      const mockSignFn1 = jest.fn().mockResolvedValue('tx-1')
      await act(async () => {
        await result.current.executeTransaction(mockSignFn1, {
          transactionId: 'tx-1',
          autoReset: true,
          resetDelay: 100,
        })
      })

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
      })

      // Second transaction
      const mockSignFn2 = jest.fn().mockResolvedValue('tx-2')
      await act(async () => {
        await result.current.executeTransaction(mockSignFn2, {
          transactionId: 'tx-2',
        })
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)
      expect(result.current.transactionState.transactionId).toBe('tx-2')
    })

    it('should handle concurrent transaction attempts', async () => {
      const { result } = renderHook(() => useSorobanTransaction(), { wrapper })

      const mockSignFn1 = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('tx-1'), 100))
      )

      const mockSignFn2 = jest.fn().mockResolvedValue('tx-2')

      // Start first transaction
      const promise1 = act(async () => {
        return result.current.executeTransaction(mockSignFn1, {
          transactionId: 'tx-1',
          autoReset: false,
        })
      })

      // Start second transaction immediately
      const promise2 = act(async () => {
        return result.current.executeTransaction(mockSignFn2, {
          transactionId: 'tx-2',
          autoReset: false,
        })
      })

      await Promise.all([promise1, promise2])

      // Last transaction should win
      expect(result.current.transactionState.transactionId).toBe('tx-2')
    })
  })
})
