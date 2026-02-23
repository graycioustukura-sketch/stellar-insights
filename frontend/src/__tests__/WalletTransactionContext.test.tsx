import { renderHook, act } from '@testing-library/react'
import { WalletTransactionProvider, useWalletTransaction } from '../contexts/WalletTransactionContext'
import { WalletTransactionStatus } from '../types/wallet-transaction'
import { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <WalletTransactionProvider>{children}</WalletTransactionProvider>
}

describe('WalletTransactionContext', () => {
  describe('Initial state', () => {
    it('should start with IDLE status', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
      expect(result.current.transactionState.transactionId).toBeUndefined()
      expect(result.current.transactionState.error).toBeUndefined()
    })
  })

  describe('setPendingSignature', () => {
    it('should set status to PENDING_SIGNATURE', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.PENDING_SIGNATURE)
    })

    it('should store transaction ID when provided', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })
      const txId = 'test-transaction-123'

      act(() => {
        result.current.setPendingSignature(txId)
      })

      expect(result.current.transactionState.transactionId).toBe(txId)
    })

    it('should work without transaction ID', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.PENDING_SIGNATURE)
      expect(result.current.transactionState.transactionId).toBeUndefined()
    })
  })

  describe('setTransactionSigned', () => {
    it('should set status to SIGNED', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature('tx-123')
      })

      act(() => {
        result.current.setTransactionSigned()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)
    })
  })

  describe('setTransactionRejected', () => {
    it('should set status to REJECTED', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature('tx-123')
      })

      act(() => {
        result.current.setTransactionRejected()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.REJECTED)
    })
  })

  describe('setTransactionError', () => {
    it('should set status to ERROR with error message', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })
      const errorMessage = 'Network connection failed'

      act(() => {
        result.current.setPendingSignature('tx-123')
      })

      act(() => {
        result.current.setTransactionError(errorMessage)
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.ERROR)
      expect(result.current.transactionState.error).toBe(errorMessage)
    })
  })

  describe('resetTransaction', () => {
    it('should reset to initial IDLE state', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature('tx-123')
      })

      act(() => {
        result.current.resetTransaction()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
      expect(result.current.transactionState.transactionId).toBeUndefined()
      expect(result.current.transactionState.error).toBeUndefined()
    })

    it('should clear error state', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setTransactionError('Some error')
      })

      act(() => {
        result.current.resetTransaction()
      })

      expect(result.current.transactionState.error).toBeUndefined()
    })
  })

  describe('State transitions', () => {
    it('should handle complete transaction flow', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      // Start
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)

      // Pending
      act(() => {
        result.current.setPendingSignature('tx-456')
      })
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.PENDING_SIGNATURE)
      expect(result.current.transactionState.transactionId).toBe('tx-456')

      // Signed
      act(() => {
        result.current.setTransactionSigned()
      })
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.SIGNED)

      // Reset
      act(() => {
        result.current.resetTransaction()
      })
      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.IDLE)
    })

    it('should handle rejection flow', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature('tx-789')
      })

      act(() => {
        result.current.setTransactionRejected()
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.REJECTED)
    })

    it('should handle error flow', () => {
      const { result } = renderHook(() => useWalletTransaction(), { wrapper })

      act(() => {
        result.current.setPendingSignature('tx-error')
      })

      act(() => {
        result.current.setTransactionError('Timeout')
      })

      expect(result.current.transactionState.status).toBe(WalletTransactionStatus.ERROR)
      expect(result.current.transactionState.error).toBe('Timeout')
    })
  })

  describe('Error handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useWalletTransaction())
      }).toThrow('useWalletTransaction must be used within a WalletTransactionProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('Callback stability', () => {
    it('should maintain stable callback references', () => {
      const { result, rerender } = renderHook(() => useWalletTransaction(), { wrapper })

      const initialCallbacks = {
        setPendingSignature: result.current.setPendingSignature,
        setTransactionSigned: result.current.setTransactionSigned,
        setTransactionRejected: result.current.setTransactionRejected,
        setTransactionError: result.current.setTransactionError,
        resetTransaction: result.current.resetTransaction,
      }

      // Trigger state change
      act(() => {
        result.current.setPendingSignature('tx-stable')
      })

      rerender()

      // Callbacks should remain the same
      expect(result.current.setPendingSignature).toBe(initialCallbacks.setPendingSignature)
      expect(result.current.setTransactionSigned).toBe(initialCallbacks.setTransactionSigned)
      expect(result.current.setTransactionRejected).toBe(initialCallbacks.setTransactionRejected)
      expect(result.current.setTransactionError).toBe(initialCallbacks.setTransactionError)
      expect(result.current.resetTransaction).toBe(initialCallbacks.resetTransaction)
    })
  })
})
