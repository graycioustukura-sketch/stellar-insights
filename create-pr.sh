#!/bin/bash

# Create PR for Wallet Signature Indicator
# This script provides the command to create a PR via GitHub web interface

echo "=========================================="
echo "Wallet Signature Indicator PR"
echo "=========================================="
echo ""
echo "Branch pushed successfully!"
echo ""
echo "To create the PR, visit:"
echo "https://github.com/graycioustukura-sketch/stellar-insights/pull/new/feature/wallet-signature-indicator"
echo ""
echo "Or use GitHub CLI:"
echo ""
echo "gh pr create \\"
echo "  --title 'Add Wallet Signature Indicator for Soroban Transactions' \\"
echo "  --body-file PR_WALLET_SIGNATURE_INDICATOR.md \\"
echo "  --base main \\"
echo "  --head feature/wallet-signature-indicator"
echo ""
echo "=========================================="
echo "PR Description Preview:"
echo "=========================================="
cat PR_WALLET_SIGNATURE_INDICATOR.md
