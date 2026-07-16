---
title: GoalFund
lang: en
project: goalfund
order: 3
summary: Trustless crowdfunding with reentrancy-safe automatic refunds.
securityTag: reentrancy-safe refunds
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/goal-fund
demo: https://goal-fund-b4.netlify.app
etherscan: https://sepolia.etherscan.io/address/0x05b68fB48C0448C8E6B46f6Db29D2d4629dE9CE9
---

**TL;DR** — A crowdfunding contract with no intermediary: the creator withdraws only if the goal is met by the deadline; otherwise every donor pulls a full refund — with refund logic hardened against reentrancy. Deployed to Sepolia, 18 passing Foundry tests.

## Problem

Crowdfunding requires trust that the platform will actually return funds when a campaign fails. And a refund flow that transfers ETH is the textbook reentrancy target: a malicious contract re-enters `refund()` before its balance is cleared and drains the pool.

## Approach

The deadline splits the contract into two mutually exclusive end states. Goal met → only the creator withdraws, and only once (a `withdrawn` flag blocks repeats). Goal missed → each donor calls `refund()` and pulls their own contribution back. It's a pull-payment design: no loop over donors, no list to run out of gas on.

## Security

The donor's recorded contribution is zeroed **before** the ETH transfer (checks-effects-interactions), so a re-entrant call sees a zero balance and reverts on the "nothing to refund" guard. The creator withdrawal is guarded by the one-shot `withdrawn` boolean.

```solidity
function refund() external {
    require(block.timestamp >= deadline, "Campaign still active");
    require(totalRaised < goal, "Goal was reached, no refund");

    uint256 amount = contributions[msg.sender];
    require(amount > 0, "Nothing to refund");

    contributions[msg.sender] = 0; // CEI: state before transfer
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Refund failed");

    emit Refunded(msg.sender, amount);
}
```
