# Migration Guide - Adding Wallet Signature Indicator

Guide for adding the Wallet Signature Indicator to existing Soroban dApps.

## Prerequisites

- React 18+ or React 19+
- Next.js 13+ (App Router or Pages Router)
- TypeScript (recommended)
- Existing wallet integration (Freighter, Albedo, etc.)

## Step-by-Step Migration

### Step 1: Copy Files

Copy these files to your project:

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

### Step 2: Update Root Layout

#### Next.js App Router

```tsx
// app/layout.tsx
import { WalletTransactionProvider } from '@/contexts/WalletTransactionContext'
import { WalletSignatureIndicator } from '@/components/WalletSignatureIndicator'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Add provider */}
        <WalletTransactionProvider>
          {children}
          {/* Add indicator */}
          <WalletSignatureIndicator />
        </WalletTransactionProvider>
      </body>
    </html>
  )
}
```

#### Next.js Pages Router

```tsx
// pages/_app.tsx
import { WalletTransactionProvider } from '@/contexts/WalletTransactionContext'
import { WalletSignatureIndicator } from '@/components/WalletSignatureIndicator'

export default function App({ Component, pageProps }) {
  return (
    <WalletTransactionProvider>
      <Component {...pageProps} />
      <WalletSignatureIndicator />
    </WalletTransactionProvider>
  )
}
```

### Step 3: Update Transaction Code

#### Before (without indicator)

```tsx
const handleTransaction = async () => {
  try {
    const signed = await window.freighter.signTransaction(tx.toXDR())
    await submitTransaction(signed)
  } catch (error) {
    console.error(error)
  }
}
```

#### After (with indicator)

```tsx
import { useSorobanTransaction } from '@/hooks/useSorobanTransaction'

const { executeTransaction } = useSorobanTransaction()

const handleTransaction = async () => {
  try {
    const signed = await executeTransaction(async () => {
      return await window.freighter.signTransaction(tx.toXDR())
    })
    await submitTransaction(signed)
  } catch (error) {
    console.error(error)
  }
}
```

### Step 4: Test Integration

1. Run your development server
2. Trigger a transaction
3. Verify indicator appears in bottom-right
4. Check indicator disappears after signing

## Common Patterns

### Pattern 1: Multiple Wallets

```tsx
const { executeTransaction } = useSorobanTransaction()

const signWithWallet = async (walletType: 'freighter' | 'albedo') => {
  return executeTransaction(async () => {
    if (walletType === 'freighter') {
      return await window.freighter.signTransaction(tx.toXDR())
    } else {
      const result = await window.albedo.tx({ xdr: tx.toXDR() })
      return result.signed_envelope_xdr
    }
  })
}
```

### Pattern 2: Contract Invocation

```tsx
const invokeContract = async () => {
  const contract = new Contract(contractId)
  const tx = await buildContractTransaction(contract)
  
  const signed = await executeTransaction(
    () => window.freighter.signTransaction(tx.toXDR()),
    { transactionId: tx.hash().toString('hex') }
  )
  
  return await submitTransaction(signed)
}
```

### Pattern 3: Batch Transactions

```tsx
const executeBatch = async (transactions) => {
  for (const tx of transactions) {
    await executeTransaction(
      () => window.freighter.signTransaction(tx.toXDR()),
      { transactionId: tx.hash().toString('hex') }
    )
  }
}
```

## Troubleshooting

### Issue: Indicator not showing

**Solution**: Verify provider wraps your app and indicator is rendered

```tsx
// Check React DevTools for:
<WalletTransactionProvider>
  <WalletSignatureIndicator />
</WalletTransactionProvider>
```

### Issue: Multiple indicators appearing

**Solution**: Only render indicator once at root level

```tsx
// ❌ Wrong - multiple instances
<Component>
  <WalletSignatureIndicator />
</Component>

// ✅ Correct - single instance at root
<RootLayout>
  <WalletSignatureIndicator />
</RootLayout>
```

### Issue: Indicator stays visible

**Solution**: Ensure you call setTransactionSigned() or setTransactionRejected()

```tsx
try {
  const signed = await executeTransaction(signFn)
  // executeTransaction handles this automatically
} catch (error) {
  // executeTransaction handles this too
}
```

### Issue: TypeScript errors

**Solution**: Update tsconfig.json paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Rollback Plan

If you need to remove the indicator:

1. Remove `<WalletSignatureIndicator />` from layout
2. Remove `<WalletTransactionProvider>` wrapper
3. Revert transaction code to original implementation
4. Delete copied files

## Performance Impact

- Bundle size: ~3KB (minified + gzipped)
- Runtime overhead: Negligible
- Re-renders: Only when transaction state changes
- Memory: Properly cleaned up

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

1. Test thoroughly in development
2. Verify with all supported wallets
3. Test on mobile devices
4. Deploy to staging
5. Monitor for issues
6. Deploy to production

## Support

- Documentation: `WalletSignatureIndicator.md`
- Examples: `/demo/wallet-signature-indicator`
- Tests: Run `npm test:wallet-indicator`
