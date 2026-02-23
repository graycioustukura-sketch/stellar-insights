'use client'

import { useEffect, useState } from 'react'
import { useWalletTransaction } from '../contexts/WalletTransactionContext'
import { WalletTransactionStatus } from '../types/wallet-transaction'
import './WalletSignatureIndicator.css'

/**
 * Lightweight floating UI component that appears when a Soroban transaction
 * is pending wallet signature. Features:
 * - Fixed position in bottom-right corner
 * - 3D-like orb with Hyper Violet glow
 * - Breathing animation (CSS-only, performant)
 * - Accessible with ARIA live region
 * - Respects prefers-reduced-motion
 * - Non-blocking, no layout shifts
 * - Auto-hides when transaction completes
 */
export function WalletSignatureIndicator() {
  const { transactionState } = useWalletTransaction()
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const isPending = transactionState.status === WalletTransactionStatus.PENDING_SIGNATURE

  useEffect(() => {
    if (isPending) {
      // Show immediately when pending
      setShouldRender(true)
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    } else {
      // Hide with transition
      setIsVisible(false)
      // Remove from DOM after transition completes
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Match CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [isPending])

  // Don't render if not needed (performance optimization)
  if (!shouldRender) {
    return null
  }

  return (
    <div
      className={`wallet-signature-indicator ${isVisible ? 'visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="orb-container">
        <div className="orb" aria-hidden="true">
          <div className="orb-inner" />
          <div className="orb-glow" />
        </div>
      </div>
      <p className="status-text">
        Awaiting Ledger Authorization...
      </p>
    </div>
  )
}
