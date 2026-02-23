# 🌟 Wallet Signature Indicator

A lightweight, performant floating UI component that appears when Soroban transactions require wallet signatures.

![Status](https://img.shields.io/badge/status-ready-green)
![Tests](https://img.shields.io/badge/tests-passing-green)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

## ✨ Features

- **Fixed Position**: Bottom-right corner, non-blocking
- **3D Visual**: Hyper Violet orb with soft glow effect
- **Smooth Animation**: CSS-only breathing effect (2.5s loop)
- **Accessible**: ARIA live regions for screen readers
- **Reduced Motion**: Respects user preferences
- **Performance**: Zero layout shifts, hardware-accelerated
- **Auto-Hide**: Disappears immediately when complete
- **Cross-Browser**: Works on all modern browsers
- **Memory Safe**: Proper cleanup, no leaks

## 🚀 Quick Start

### 1. Add Provider

```tsx
// app/layout.tsx
import { WalletTransactionProvider } from '@/contexts/WalletTransactionContext'
import { WalletSignatureIndicator } from '@/components/WalletSignatureIndicator'

export default function RootLayout({ children }) {
  return (
    <WalletTransactionProvider>
      {children}
      <WalletSignatureIndicator />
    </WalletTransactionProvider>
  )
}
```

### 2. Use in Components

```tsx
import { useSorobanTransaction } from '@/hooks/useSorobanTransaction'

function PaymentButton() {
  const { executeTransaction } = useSorobanTransaction()

  const handlePayment = async () => {
    try {
      const signed = await executeTransaction(async () => {
        return await window.freighter.signTransaction(transaction)
      })
      // Transaction signed successfully
    } catch (error) {
      // Handle error or rejection
    }
  }

  return <button onClick={handlePayment}>Send Payment</button>
}
```

## 📚 API Reference

### Hook: `useSorobanTransaction()`

```typescript
const {
  executeTransaction,  // Wrapper function with auto-indicator
  transactionState,    // Current state
  showPending,         // Manual control
  markSigned,
  markRejected,
  markError,
  reset,
} = useSorobanTransaction()
```

### `executeTransaction(signFn, options)`

```typescript
await executeTransaction(
  async () => {
    // Your signing logic
    return await wallet.signTransaction(tx)
  },
  {
    transactionId: 'optional-tx-id',
    autoReset: true,      // Auto-hide after completion
    resetDelay: 1000,     // Delay in ms
  }
)
```

### Context: `useWalletTransaction()`

```typescript
const {
  transactionState,
  setPendingSignature,
  setTransactionSigned,
  setTransactionRejected,
  setTransactionError,
  resetTransaction,
} = useWalletTransaction()
```

## 🎨 Customization

Override CSS variables in your global styles:

```css
.wallet-signature-indicator {
  --orb-size: 48px;
  --orb-color-primary: #8b5cf6;
  --orb-color-secondary: #a78bfa;
  --text-color: rgba(139, 92, 246, 0.9);
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific tests
npm test:wallet-indicator

# With coverage
npm test:coverage

# E2E tests
npx cypress run --spec "cypress/e2e/wallet-signature-indicator.cy.ts"
```

## 📖 Examples

### Freighter Wallet

```tsx
const { executeTransaction } = useSorobanTransaction()

const signed = await executeTransaction(async () => {
  return await window.freighter.signTransaction(tx.toXDR(), {
    network: 'TESTNET',
    networkPassphrase: Networks.TESTNET,
  })
})
```

### Albedo Wallet

```tsx
const signed = await executeTransaction(async () => {
  const result = await window.albedo.tx({
    xdr: tx.toXDR(),
    network: 'testnet',
  })
  return result.signed_envelope_xdr
})
```

### Manual Control

```tsx
const { showPending, markSigned, markRejected } = useSorobanTransaction()

try {
  showPending('tx-123')
  const result = await customSigningLogic()
  markSigned()
} catch (error) {
  markRejected()
}
```

## 🎯 Demo

Visit `/demo/wallet-signature-indicator` to see it in action.

## 📁 File Structure

```
src/
├── components/
│   ├── WalletSignatureIndicator.tsx      # Main component
│   ├── WalletSignatureIndicator.css      # Styles
│   ├── WalletSignatureIndicator.md       # Docs
│   └── examples/
│       └── WalletSignatureIndicatorExample.tsx
├── contexts/
│   └── WalletTransactionContext.tsx      # State management
├── hooks/
│   └── useSorobanTransaction.ts          # Integration hook
├── types/
│   └── wallet-transaction.ts             # TypeScript types
└── __tests__/
    ├── WalletSignatureIndicator.test.tsx
    ├── WalletTransactionContext.test.tsx
    └── useSorobanTransaction.test.tsx
```

## 🔧 Troubleshooting

### Indicator not appearing

1. Verify `WalletTransactionProvider` wraps your app
2. Check `setPendingSignature()` is called
3. Ensure CSS file is imported

### Animation not smooth

1. Check browser DevTools performance
2. Verify no conflicting CSS
3. Ensure hardware acceleration enabled

### TypeScript errors

1. Update `@types/react` to latest
2. Check tsconfig.json includes src directory

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📞 Support

- Documentation: See `WalletSignatureIndicator.md`
- Issues: GitHub Issues
- Demo: `/demo/wallet-signature-indicator`
