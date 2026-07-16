---
title: BestSwap
lang: es
project: bestswap
order: 1
summary: Wrapper de swap sobre Uniswap V2 que calcula la protección de slippage on-chain.
securityTag: slippage on-chain
stack: [Solidity, Foundry, Next.js, wagmi]
repo: https://github.com/Armando8a-dev/best-swap
demo: https://best-swap-b10.netlify.app
etherscan: https://sepolia.etherscan.io/address/0xfD372C5EbeCB55327955e7e72fab964DadC1d621
---

**TL;DR** — Un wrapper de swap sobre Uniswap V2 que deriva el mínimo aceptable de salida **on-chain** a partir del precio actual, en lugar de confiar en un `minAmountOut` calculado por un frontend con datos desactualizados. Desplegado en Sepolia, 20 tests de Foundry en verde.

## Problema

La mayoría de las UIs de swap calculan el mínimo aceptable off-chain y se lo pasan al router. Entre la cotización y la ejecución el precio se mueve — el usuario termina sandwicheado o su transacción revierte con un error confuso. La protección solo es tan fresca como la última lectura del frontend.

## Enfoque

El usuario expresa su intención como una tolerancia de slippage en puntos base ("máximo 0.5%"). Al momento de ejecutar, el contrato llama a `getAmountsOut` del router de Uniswap V2, deriva `minOut` de esa cotización en vivo, y solo entonces ejecuta el swap — así la protección usa las reservas reales en la misma transacción. Una comisión de protocolo configurable (con tope de 5%) se descuenta antes del swap, y una vista `previewSwap` permite al frontend mostrar el resultado esperado y la comisión de antemano.

## Seguridad

Cada ruta valida primero (monto cero, longitud del path, deadline), los tokens se transfieren con `SafeERC20`, y el router es la única llamada externa. Un parámetro `deadline` rechaza transacciones vencidas.

```solidity
uint256[] memory expected = IV2Router(router).getAmountsOut(amountAfterFee, path);
uint256 expectedOut = expected[expected.length - 1];
uint256 minOut = expectedOut - (expectedOut * maxSlippageBps / BPS_BASE);

IERC20(path[0]).approve(router, amountAfterFee);
uint256[] memory amounts = IV2Router(router).swapExactTokensForTokens(
    amountAfterFee, minOut, path, msg.sender, deadline
);
```

El frontend (Next.js + wagmi) lee cotizaciones solo para mostrarlas — nunca participa en la protección.
