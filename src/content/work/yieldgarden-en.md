---
title: YieldGarden
lang: en
project: yieldgarden
order: 2
summary: Stake ERC-20 SEED tokens, earn ETH rewards that accrue per second.
securityTag: per-second rewards
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/yield-garden
demo: https://yield-garden-b7.netlify.app
etherscan: https://sepolia.etherscan.io/address/0xEC53a51c83b9cC5372312EEaAE0d5BE3193F4b60
---

**TL;DR** — A staking protocol where users lock SEED tokens and earn ETH rewards that accrue every second. Reward math is a single timestamp per user, so every operation is constant-gas regardless of how many stakers exist. Deployed to Sepolia, 20 passing Foundry tests.

## Problem

Naive staking contracts recompute each user's rewards from full history or iterate over stakers — cost grows with users and elapsed time until the contract is too expensive to use.

## Approach

Each stake stores just two things: the amount and the `stakedAt` timestamp. Pending rewards are a pure function of stake × rate × elapsed time, so there is nothing to loop over and nothing to accumulate globally. Claiming resets `stakedAt` to now — the checkpoint — so rewards start accruing fresh from that moment.

## Security

Reward-bearing paths follow checks-effects-interactions: `claimRewards` moves the `stakedAt` checkpoint **before** sending ETH, and `unstake` clears the stake and decrements `totalStaked` before any transfer, so a re-entrant call finds nothing left to claim. Custom errors gate the edge cases (no stake, no rewards, empty reward pool).

```solidity
function pendingRewards(address user) public view returns (uint256) {
    StakeInfo memory info = stakes[user];
    if (info.amount == 0) return 0;
    uint256 elapsed = block.timestamp - info.stakedAt;
    return (info.amount * rewardRatePerTokenPerSecond * elapsed) / 1e18;
}
```

In `claimRewards`, the checkpoint is advanced before the external call:

```solidity
stakes[msg.sender].stakedAt = block.timestamp; // effects before interaction
(bool ok,) = msg.sender.call{value: reward}("");
if (!ok) revert TransferFailed();
```
