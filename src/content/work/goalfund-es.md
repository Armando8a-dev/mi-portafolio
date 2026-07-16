---
title: GoalFund
lang: es
project: goalfund
order: 3
summary: Crowdfunding sin intermediarios con reembolsos automáticos reentrancy-safe.
securityTag: reembolsos reentrancy-safe
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/goal-fund
demo: https://goal-fund-b4.netlify.app
etherscan: https://sepolia.etherscan.io/address/0x05b68fB48C0448C8E6B46f6Db29D2d4629dE9CE9
---

**TL;DR** — Un contrato de crowdfunding sin intermediarios: el creador retira solo si se cumple la meta antes de la fecha límite; si no, cada donante reclama un reembolso completo — con lógica de reembolso endurecida contra reentrancy. Desplegado en Sepolia, 18 tests de Foundry en verde.

## Problema

El crowdfunding exige confiar en que la plataforma realmente devolverá los fondos cuando una campaña falle. Y un flujo de reembolso que transfiere ETH es el objetivo de reentrancy de manual: un contrato malicioso reingresa a `refund()` antes de que su balance se limpie y drena el pool.

## Enfoque

La fecha límite divide el contrato en dos estados finales mutuamente excluyentes. Meta cumplida → solo el creador retira, y una sola vez (una bandera `withdrawn` bloquea repeticiones). Meta no cumplida → cada donante llama a `refund()` y recupera su propia contribución. Es un diseño pull-payment: sin loop sobre donantes, sin una lista que pueda quedarse sin gas.

## Seguridad

La contribución registrada del donante se pone en cero **antes** de la transferencia de ETH (checks-effects-interactions), así que una llamada reentrante ve un balance en cero y revierte en el guard de "nada que reembolsar". El retiro del creador está protegido por el booleano de un solo uso `withdrawn`.

```solidity
function refund() external {
    require(block.timestamp >= deadline, "Campaign still active");
    require(totalRaised < goal, "Goal was reached, no refund");

    uint256 amount = contributions[msg.sender];
    require(amount > 0, "Nothing to refund");

    contributions[msg.sender] = 0; // CEI: estado antes de transferir
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Refund failed");

    emit Refunded(msg.sender, amount);
}
```
