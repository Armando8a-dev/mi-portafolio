---
title: BestSwap
lang: en
project: bestswap
order: 1
summary: Uniswap V2 swap wrapper that computes slippage protection on-chain.
securityTag: on-chain slippage
stack: [Solidity, Foundry, Next.js, wagmi]
repo: https://github.com/Armando8a-dev/best-swap
demo: https://best-swap-b10.netlify.app
etherscan: https://sepolia.etherscan.io/address/0xfD372C5EbeCB55327955e7e72fab964DadC1d621
---

**TL;DR** — A swap wrapper on Uniswap V2 that derives the minimum acceptable output **on-chain** from the current price, instead of trusting a `minAmountOut` computed by a frontend against stale data. Deployed to Sepolia, 20 passing Foundry tests.

## Problem

Most swap UIs compute the minimum acceptable output off-chain and hand it to the router. Between quote and execution the price moves — users get sandwiched, or the transaction reverts with a confusing error. The protection is only as fresh as the frontend's last read.

## Approach

The user expresses intent as a slippage tolerance in basis points ("at most 0.5%"). At execution time the contract calls `getAmountsOut` on the Uniswap V2 router, derives `minOut` from that live quote, and only then executes the swap — so enforcement uses the actual reserves in the same transaction. A configurable protocol fee (capped at 5%) is deducted before the swap, and a `previewSwap` view lets the frontend show the expected output and fee up front.

## Security

Every path guards first (zero amount, path length, deadline), tokens are pulled with `SafeERC20`, and the router is the single external call. A `deadline` parameter rejects stale transactions.

```solidity
uint256[] memory expected = IV2Router(router).getAmountsOut(amountAfterFee, path);
uint256 expectedOut = expected[expected.length - 1];
uint256 minOut = expectedOut - (expectedOut * maxSlippageBps / BPS_BASE);

IERC20(path[0]).approve(router, amountAfterFee);
uint256[] memory amounts = IV2Router(router).swapExactTokensForTokens(
    amountAfterFee, minOut, path, msg.sender, deadline
);
```

The frontend (Next.js + wagmi) reads quotes for display only — it never participates in enforcement.
