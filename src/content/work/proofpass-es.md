---
title: ProofPass
lang: es
project: proofpass
order: 4
summary: Credenciales ERC-721 soulbound con revocación y re-emisión controladas por el emisor.
securityTag: ERC-721 soulbound
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/proof-pass
demo: https://proof-pass-b8.netlify.app
etherscan: https://sepolia.etherscan.io/address/0x981607d51671520D00546e95C5dD50bE29e07916
---

**TL;DR** — Un sistema de credenciales ERC-721 soulbound (no transferibles) para emitir insignias verificables on-chain, con revocación y re-emisión controladas por la autoridad emisora. Desplegado en Sepolia, 15 tests de Foundry en verde.

## Problema

Los certificados e insignias solo valen si no se pueden comprar. Una credencial NFT estándar puede venderse o transferirse, destruyendo su valor como prueba de logro.

## Enfoque

ProofPass extiende el ERC-721 de OpenZeppelin y sobreescribe los puntos de entrada de transferencia para que reviertan, así los tokens pueden mintearse y quemarse pero nunca moverse entre wallets. El owner emite una insignia con una etiqueta de tipo, puede revocarla (quemarla) y — como revocar limpia el slot del titular — puede re-emitir a la misma dirección después, cubriendo re-certificación y wallets perdidas. Una insignia por dirección a la vez, verificado en O(1).

## Seguridad

La no transferibilidad vive en los dos puntos de entrada públicos de transferencia, ambos sobreescritos para revertir — mintear y quemar pasan por el `_update` interno de OpenZeppelin, que los overrides no tocan, así que las rutas de emisión/revocación del owner siguen funcionando. `issueBadge` y `revokeBadge` son `onlyOwner`; `issueBadge` revierte temprano si el destinatario ya tiene una insignia.

```solidity
function transferFrom(address, address, uint256) public pure override {
    revert TransferNotAllowed();
}

function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
    revert TransferNotAllowed();
}
```

Mintear sigue funcionando porque `_safeMint` llama directamente al `_update` interno, nunca a `transferFrom`.
