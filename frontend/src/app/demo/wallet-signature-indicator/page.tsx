'use client'

import { WalletTransactionProvider } from '@/contexts/WalletTransactionContext'
import { WalletSignatureIndicator } from '@/components/WalletSignatureIndicator'
import { WalletSignatureIndicatorExample } from '@/components/examples/WalletSignatureIndicatorExample'

/**
 * Demo page for the WalletSignatureIndicator component
 * Showcases the floating UI with interactive controls
 */
export default function WalletSignatureIndicatorDemoPage() {
  return (
    <WalletTransactionProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Wallet Signature Indicator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A lightweight, performant floating UI component for Soroban transaction signatures
            </p>
          </header>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <WalletSignatureIndicatorExample />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Features
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">✓</span>
                    <span>Fixed position, non-blocking UI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">✓</span>
                    <span>3D-like orb with Hyper Violet glow</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">✓</span>
                    <span>Smooth breathing animation (CSS-only)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">✓</span>
                    <span>Accessible with ARIA live regions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">✓</span>
                    <span>Respects reduced motion preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-violet-600 mr-2">✓</span>
                    <span>Zero layout shifts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Performance
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">⚡</span>
                    <span>CSS-only animations (no JS loops)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">⚡</span>
                    <span>Conditional rendering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">⚡</span>
                    <span>Hardware-accelerated transforms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">⚡</span>
                    <span>Minimal re-renders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">⚡</span>
                    <span>Proper cleanup (no memory leaks)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">⚡</span>
                    <span>Cross-browser compatible</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Integration Guide
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-800 dark:text-gray-200">
{`// 1. Wrap your app with the provider
<WalletTransactionProvider>
  <YourApp />
  <WalletSignatureIndicator />
</WalletTransactionProvider>

// 2. Use in your components
const { setPendingSignature, setTransactionSigned } = useWalletTransaction()

// 3. Trigger on transaction
setPendingSignature('tx-id')
await signTransaction()
setTransactionSigned()`}
                </pre>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                Watch the bottom-right corner when you click "Send Soroban Transaction"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The actual indicator component */}
      <WalletSignatureIndicator />
    </WalletTransactionProvider>
  )
}
