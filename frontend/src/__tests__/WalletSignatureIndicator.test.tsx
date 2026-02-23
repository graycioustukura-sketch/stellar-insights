import { render, screen, waitFor, act } from '@testing-library/react'
import { WalletSignatureIndicator } from '../components/WalletSignatureIndicator'
import { WalletTransactionProvider, useWalletTransaction } from '../contexts/WalletTransactionContext'
import { WalletTransactionStatus } from '../types/wallet-transaction'

// Mock CSS imports
jest.mock('../components/WalletSignatureIndicator.css', () => ({}))

// Helper component to control transaction state in tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WalletTransactionProvider>
      {children}
    </WalletTransactionProvider>
  )
}

function TransactionController({ onMount }: { onMount: (controller: ReturnType<typeof useWalletTransaction>) => void }) {
  const controller = useWalletTransaction()
  
  React.useEffect(() => {
    onMount(controller)
  }, [controller, onMount])
  
  return null
}

describe('WalletSignatureIndicator', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Visibility toggling', () => {
    it('should not render when transaction status is IDLE', () => {
      const { container } = render(
        <TestWrapper>
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      expect(container.querySelector('.wallet-signature-indicator')).not.toBeInTheDocument()
    })

    it('should render and become visible when transaction is PENDING_SIGNATURE', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature('test-tx-123')
      })

      await waitFor(() => {
        const indicator = screen.getByRole('status')
        expect(indicator).toBeInTheDocument()
        expect(indicator).toHaveClass('wallet-signature-indicator')
      })
    })

    it('should hide when transaction is signed', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      // Set to pending
      act(() => {
        controller!.setPendingSignature('test-tx-123')
      })

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })

      // Sign transaction
      act(() => {
        controller!.setTransactionSigned()
      })

      // Should remove visible class
      await waitFor(() => {
        const indicator = screen.queryByRole('status')
        if (indicator) {
          expect(indicator).not.toHaveClass('visible')
        }
      })

      // Should be removed from DOM after transition
      act(() => {
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })

    it('should hide when transaction is rejected', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature('test-tx-123')
      })

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })

      act(() => {
        controller!.setTransactionRejected()
      })

      act(() => {
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        const indicator = screen.getByRole('status')
        expect(indicator).toHaveAttribute('aria-live', 'polite')
        expect(indicator).toHaveAttribute('aria-atomic', 'true')
      })
    })

    it('should display status text for screen readers', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        expect(screen.getByText('Awaiting Ledger Authorization...')).toBeInTheDocument()
      })
    })

    it('should mark orb as aria-hidden', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      const { container } = render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        const orb = container.querySelector('.orb')
        expect(orb).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('Animation state', () => {
    it('should add visible class after rendering', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      const { container } = render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        const indicator = container.querySelector('.wallet-signature-indicator')
        expect(indicator).toHaveClass('visible')
      })
    })

    it('should remove visible class before unmounting', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      const { container } = render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        expect(container.querySelector('.wallet-signature-indicator.visible')).toBeInTheDocument()
      })

      act(() => {
        controller!.resetTransaction()
      })

      await waitFor(() => {
        const indicator = container.querySelector('.wallet-signature-indicator')
        if (indicator) {
          expect(indicator).not.toHaveClass('visible')
        }
      })
    })
  })

  describe('Performance optimizations', () => {
    it('should not render DOM elements when not needed', () => {
      const { container } = render(
        <TestWrapper>
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      expect(container.querySelector('.wallet-signature-indicator')).not.toBeInTheDocument()
      expect(container.querySelector('.orb')).not.toBeInTheDocument()
    })

    it('should clean up timeout on unmount', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      const { unmount } = render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })

      act(() => {
        controller!.resetTransaction()
      })

      // Unmount before timeout completes
      unmount()

      // Should not throw or cause memory leaks
      act(() => {
        jest.advanceTimersByTime(300)
      })
    })
  })

  describe('State transitions', () => {
    it('should handle rapid state changes', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      // Rapid transitions
      act(() => {
        controller!.setPendingSignature('tx-1')
      })

      act(() => {
        controller!.setTransactionSigned()
      })

      act(() => {
        controller!.setPendingSignature('tx-2')
      })

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })
    })

    it('should handle error state', async () => {
      let controller: ReturnType<typeof useWalletTransaction>

      render(
        <TestWrapper>
          <TransactionController onMount={(c) => { controller = c }} />
          <WalletSignatureIndicator />
        </TestWrapper>
      )

      act(() => {
        controller!.setPendingSignature()
      })

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })

      act(() => {
        controller!.setTransactionError('Network error')
      })

      act(() => {
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })
  })
})
