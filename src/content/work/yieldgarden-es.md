---
title: YieldGarden
lang: es
project: yieldgarden
order: 2
summary: Haz staking de tokens ERC-20 SEED y gana recompensas en ETH que se acumulan por segundo.
securityTag: recompensas por segundo
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/yield-garden
demo: https://yield-garden-b7.netlify.app
etherscan: https://sepolia.etherscan.io/address/0xEC53a51c83b9cC5372312EEaAE0d5BE3193F4b60
---

**TL;DR** — Un protocolo de staking donde los usuarios bloquean tokens SEED y ganan recompensas en ETH que se acumulan cada segundo. El cálculo de recompensas es un solo timestamp por usuario, así que toda operación es de gas constante sin importar cuántos stakers existan. Desplegado en Sepolia, 20 tests de Foundry en verde.

## Problema

Los contratos de staking ingenuos recalculan las recompensas de cada usuario desde el historial completo o iteran sobre los stakers — el costo crece con los usuarios y el tiempo transcurrido hasta que el contrato es demasiado caro de usar.

## Enfoque

Cada stake guarda solo dos cosas: el monto y el timestamp `stakedAt`. La recompensa pendiente es una función pura de monto × tasa × tiempo transcurrido, así que no hay nada que recorrer ni un acumulador global. Al reclamar se reinicia `stakedAt` al momento actual — el checkpoint — y las recompensas vuelven a acumularse desde ahí.

## Seguridad

Las rutas que pagan recompensas siguen checks-effects-interactions: `claimRewards` mueve el checkpoint `stakedAt` **antes** de enviar ETH, y `unstake` limpia el stake y descuenta `totalStaked` antes de cualquier transferencia, así que una llamada reentrante no encuentra nada que reclamar. Errores personalizados cubren los casos borde (sin stake, sin recompensas, pool de recompensas vacío).

```solidity
function pendingRewards(address user) public view returns (uint256) {
    StakeInfo memory info = stakes[user];
    if (info.amount == 0) return 0;
    uint256 elapsed = block.timestamp - info.stakedAt;
    return (info.amount * rewardRatePerTokenPerSecond * elapsed) / 1e18;
}
```

En `claimRewards`, el checkpoint se adelanta antes de la llamada externa:

```solidity
stakes[msg.sender].stakedAt = block.timestamp; // efectos antes de la interacción
(bool ok,) = msg.sender.call{value: reward}("");
if (!ok) revert TransferFailed();
```
