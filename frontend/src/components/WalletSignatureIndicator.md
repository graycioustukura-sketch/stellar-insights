# Wallet Signature Indicator

A lightweight, performant floating UI component that appears when a Soroban transaction enters a pending wallet signature state.

## Features

- **Fixed positioning**: Bottom-right corner, non-blocking
- **3D-like orb**: Hyper Violet gradient with soft glow effect
- **Breathing animation**: Smooth CSS-only scale animation (2.5s loop)
- **Accessible**: ARIA live region for screen readers
- **Reduced motion support**: Respects `prefers-reduced-motion` preference
- **Performance optimized**: No layout shifts, minimal re-renders, CSS-only animations
- **Auto-hide**: Disappears immediately when transaction completes
- **Cross-browser compatible**: Works on all modern browsers

## Installation

### 1. Add the Provider

Wrap your app with `WalletTransactionProvider`:

```tsx
// app/layout.tsx or _app.tsx
import { WalletTransactionProvider } from '@/contexts/WalletTransactionContext'
import { WalletSignatureIndicator } from '@/components/WalletSignatureIndicator'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WalletTransactionProvider>
          {children}
          <WalletSignatureIndicator />
        </WalletTransactionProvider>
      </body>
    </html>
  )
}
```

### 2. Use in Your Components

```tsx
import { useWalletTransaction } from '@/contexts/WalletTransactionContext'

function MyTransactionComponent() {
  const { setPendingSignature, setTransactionSigned, setTransactionRejected } = useWalletTransaction()

  const handleTransaction = async () => {
    try {
      // 1. Set pending state (indicator appears)
      setPendingSignature('tx-id-123')
      
      // 2. Request wallet signature
      const signedTx = await window.freighter.signTransaction(transaction)
      
      // 3. Set signed state (indicator disappears)
      setTransactionSigned()
      
    } catch (error) {
      // Handle rejection (indicator disappears)
      setTransactionRejected()
    }
  }

  return <button onClick={handleTransaction}>Send Transaction</button>
}
```

## API Reference

### Context Hook: `useWalletTransaction()`

```typescript
const {
  transactionState,        // Current transaction state
  setPendingSignature,     // (txId?: string) => void
  setTransactionSigned,    // () => void
  setTransactionRejected,  // () => void
  setTransactionError,     // (error: string) => void
  resetTransaction,        // () => void
} = useWalletTransaction()
```

### Transaction States

```typescript
enum WalletTransactionStatus {
  IDLE = 'idle',                      // No active transaction
  PENDING_SIGNATURE = 'pending_signature',  // Waiting for wallet signature
  SIGNED = 'signed',                  // Transaction signed
  REJECTED = 'rejected',              // User rejected
  ERROR = 'error',                    // Error occurred
}
```

## Styling

The component uses CSS custom properties for easy theming:

```css
/* Override in your global CSS if needed */
.wallet-signature-indicator {
  --orb-size: 48px;
  --orb-color-primary: #8b5cf6;
  --orb-color-secondary: #a78bfa;
  --text-color: rgba(139, 92, 246, 0.9);
}
```

## Accessibility

- **ARIA live region**: Status updates announced to screen readers
- **Semantic HTML**: Proper role and aria attributes
- **Keyboard navigation**: Non-interactive, doesn't trap focus
- **Reduced motion**: Animations disabled when `prefers-reduced-motion: reduce`
- **High contrast**: Enhanced visibility in high contrast mode

## Performance

- **CSS-only animations**: No JavaScript animation loops
- **Conditional rendering**: Component not in DOM when not needed
- **No layout shifts**: Fixed positioning with `will-change`
- **Optimized transitions**: Hardware-accelerated transforms
- **Memory safe**: Proper cleanup of timers and effects

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## Testing

Run the test suite:

```bash
npm test WalletSignatureIndicator
npm test WalletTransactionContext
```

## Examples

See `WalletSignatureIndicatorExample.tsx` for a complete integration example.

## Troubleshooting

### Indicator not appearing

1. Ensure `WalletTransactionProvider` wraps your app
2. Check that `setPendingSignature()` is called
3. Verify CSS file is imported

### Animation not smooth

1. Check browser DevTools for performance issues
2. Ensure no conflicting CSS animations
3. Verify hardware acceleration is enabled

### Accessibility issues

1. Test with screen reader (NVDA, JAWS, VoiceOver)
2. Verify ARIA attributes in DevTools
3. Check reduced motion preference

## License

MIT
