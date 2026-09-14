# Build an ERC20 with OpenZeppelin v5 library

## Introduction

In this tutorial, you'll build BestToken, an ERC20 token with a fixed supply and production-ready features: burnable, pausable, permit (gasless approvals), and Ownable2Step. All features come from OpenZeppelin v5, the industry-standard library for secure smart contracts. https://docs.openzeppelin.com/

## Prerequisites

What you need to build this contract

- **Hardhat** — Install from https://hardhat.org/
- **Node.js** — Version 18+
- **Solidity knowledge** — Understanding of basic contract structure https://www.soliditylang.org/
- **A terminal** — Commands run on Linux, macOS, or Windows with WSL

This tutorial uses Hardhat for development and testing. We assume you've worked with smart contracts before.

## Steps to follow

### 1. Set up the contract

First, create a new directory for your project:
``` bash
mkdir BestToken
cd BestToken
```
Then, initialize your hardhat project by:
``` bash
npx hardhat --init
```
This command will prompt you with a few configuration options. You can accept the default answers to quickly create a working setup. Using the defaults will initialize the project in the current directory and automatically install all required dependencies.

**Project Structure**
The Hardhat project initialization creates the following file structure:

```
BestToken/
├── contracts/
├── test/
├── hardhat.config.ts
└── package.json
```
Now, install OpenZeppelin Contracts v5:

```bash
npm install @openzeppelin/contracts
```

Next, create the contract file `contracts/BestToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract BestToken is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, ERC20Capped, Ownable2Step {
    constructor()
        ERC20("BestToken", "BEST")
        ERC20Permit("BestToken")
        ERC20Capped(1000000 * 10 ** decimals())
    {}
}
```

This is your starting point. In the next steps, we'll add the specific overrides for each extension.

### 2. Add Capped Extension

Capped extension adds a cap to the supply of tokens. It restricts the amount of tokens that can be minted, ensuring the total supply never exceeds the cap defined in the constructor.

**The _update Override**

To enforce the cap, we need to override the `_update()` function:

```solidity
function _update(address from, address to, uint256 amount)
    internal
    override(ERC20, ERC20Capped)
{
    super._update(from, to, amount);
}
```

This override ensures that every transfer (including minting) checks the cap constraint.

**Updated Contract**

Here's BestToken with Capped working:

```solidity
// ... imports ...

contract BestToken is ERC20, ERC20Capped, ... {
    constructor()
        ERC20("BestToken", "BEST")
        ERC20Capped(1000000 * 10 ** decimals())
    {}

    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, amount);
    }
}
```

Now, if you try to mint more than 1 million tokens, the transaction will revert.

### 3. Add Burnable Extension

### 4. Add Pausable Extension

### 5. Add Permit (ERC2612) Extension

### 6. Add Ownable2Step Extension

### 7. Deploy with Foundry

## Conclusion
