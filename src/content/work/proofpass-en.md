---
title: ProofPass
lang: en
project: proofpass
order: 4
summary: Soulbound ERC-721 credentials with owner-controlled revoke and re-issue.
securityTag: soulbound ERC-721
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/proof-pass
demo: https://proof-pass-b8.netlify.app
etherscan: https://sepolia.etherscan.io/address/0x981607d51671520D00546e95C5dD50bE29e07916
---

**TL;DR** — A soulbound (non-transferable) ERC-721 credential system for issuing verifiable on-chain badges, with revoke and re-issue controlled by the issuing authority. Deployed to Sepolia, 15 passing Foundry tests.

## Problem

Certificates and badges only mean something if they can't be bought. A standard NFT credential can be sold or transferred, destroying its value as proof of achievement.

## Approach

ProofPass extends OpenZeppelin's ERC-721 and overrides the transfer entry points to revert, so tokens can be minted and burned but never moved between wallets. The owner issues a badge with a type label, can revoke it (burn), and — because revoking clears the holder's slot — can re-issue to the same address later, covering re-certification and lost wallets. One badge per address at a time, checked in O(1).

## Security

Non-transferability lives at the two public transfer entry points, both overridden to revert — minting and burning route through OpenZeppelin's internal `_update`, which the overrides don't touch, so the owner's issue/revoke paths keep working. `issueBadge` and `revokeBadge` are `onlyOwner`; `issueBadge` reverts early if the recipient already holds a badge.

```solidity
function transferFrom(address, address, uint256) public pure override {
    revert TransferNotAllowed();
}

function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
    revert TransferNotAllowed();
}
```

Minting still works because `_safeMint` calls the internal `_update` directly, never `transferFrom`.
