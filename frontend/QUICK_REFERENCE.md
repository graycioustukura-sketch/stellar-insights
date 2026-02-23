# Wallet Signature Indicator - Quick Reference

## 🚀 Setup (2 steps)

```tsx
// 1. app/layout.tsx
import { WalletTransactionProvider } from '@/contexts/WalletTransactionContext'
import { WalletSignatureIndicator } from '@/components/WalletSignatureIndicator'

<WalletTransactionProvider>
  {children}
  <WalletSignatureIndicator />
</WalletTransactionProvider>

// 2. Your component
import { useSorobanTransaction } from '@/hooks/useSorobanTransaction'

const { executeTransaction } = useSorobanTransaction()
await executeTransaction(() => wallet.signTransaction(tx))
```

## 📖 API

### Hook: useSorobanTransaction()

```tsx
const {
  executeTransaction,  // Auto-managed signing
  transactionState,    // Current state
  showPending,         // Manual: show indicator
  markSigned,          // Manual: mark signed
  markRejected,        // Manual: mark rejected
  markError,           // Manual: mark error
  reset,               // Manual: reset state
} = useSorobanTransaction()
```

### executeTransaction()

```tsx
await executeTransaction(
  async () => {
    return await wallet.signTransaction(tx)
  },
  {
    transactionId: 'optional-id',
    autoReset: true,
    resetDelay: 1000,
  }
)
```

### Context: useWalletTransaction()

```tsx
const {
  transactionState,
  setPendingSignature,
  setTransactionSigned,
  setTransactionRejected,
  setTransactionError,
  resetTransaction,
} = useWalletTransaction()
```

## 💡 Examples

### Basic

```tsx
const { executeTransaction } = useSorobanTransaction()

const handleSend = async () => {
  const signed = await executeTransaction(
    () => window.freighter.signTransaction(tx.toXDR())
  )
}
```

### With Options

```tsx
const signed = await executeTransaction(
  () => wallet.signTransaction(tx),
  {
    transactionId: tx.hash().toString('hex'),
    autoReset: true,
    resetDelay: 2000,
  }
)
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

### Multiple Wallets

```tsx
const signWithWallet = async (type: 'freighter' | 'albedo') => {
  return executeTransaction(async () => {
    if (type === 'freighter') {
      return await window.freighter.signTransaction(tx.toXDR())
    } else {
      const result = await window.albedo.tx({ xdr: tx.toXDR() })
      return result.signed_envelope_xdr
    }
  })
}
```

## 🎨 Customization

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
npm test                    # All tests
npm test:wallet-indicator   # Specific
npm test:coverage          # With coverage
```

## 📁 Files

```
src/
├── components/
│   ├── WalletSignatureIndicator.tsx
│   └── WalletSignatureIndicator.css
├── contexts/
│   └── WalletTransactionContext.tsx
├── hooks/
│   └── useSorobanTransaction.ts
└── types/
    └── wallet-transaction.ts
```

## 🎯 Demo

`/demo/wallet-signature-indicator`

## 📚 Docs

- `WalletSignatureIndicator.md` - Full API
- `README_WALLET_INDICATOR.md` - Main README
- `MIGRATION_GUIDE.md` - Integration guide

## ⚡ Performance

- Bundle: ~3KB gzipped
- CSS-only animations
- Zero layout shifts
- No memory leaks

## ♿ Accessibility

- ARIA live regions
- Screen reader support
- Reduced motion support
- High contrast mode

## 🌐 Browsers

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🐛 Troubleshooting

**Not showing?**
- Check provider wraps app
- Verify setPendingSignature() called

**Stays visible?**
- Ensure signed/rejected called
- Check autoReset option

**TypeScript errors?**
- Update @types/react
- Check tsconfig paths

## ✅ Checklist

- [ ] Add WalletTransactionProvider
- [ ] Add WalletSignatureIndicator
- [ ] Import useSorobanTransaction
- [ ] Wrap signing calls
- [ ] Test in browser
- [ ] Check accessibility
- [ ] Test on mobile

Done! 🎉
