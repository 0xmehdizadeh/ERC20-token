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

```bash
mkdir BestToken
cd BestToken
```

Then, initialize your hardhat project by:

```bash
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

**The \_update Override**

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

Token holders can permanently remove tokens from circulation by burning them, both their own tokens or those they have approval for. The ERC20Burnable extension provides the `burn()` function for this.

**No _update Override Needed**

Unlike Capped, Burnable doesn't require an `_update()` override. The `burn()` function is already implemented by the extension and works independently.

**The burn() Function**

Users call `burn()` like this:

```solidity
// Burn 100 tokens from the caller's account
bestToken.burn(100 * 10 ** 18);
```

**Updated Contract**

Here's the full contract with Burnable added:

```solidity
contract BestToken is ERC20, ERC20Burnable, ERC20Capped, ... {
    // ... constructor and _update() ...
}
```

Burnable is now active. Any user can burn their own tokens at any time.

### 4. Add Pausable Extension

The Pausable extension allows the owner of the contract to temporarily stop all token transfers in case of security issues or detected bugs. Once resolved, transfers can be unpaused. This is an emergency safeguard, not meant for regular operation.

**The _update Override**

Pausable requires an `_update()` override to check if transfers are paused before allowing any transfer or mint:

```solidity
function _update(address from, address to, uint256 amount)
    internal
    override(ERC20, ERC20Pausable, ERC20Capped)
{
    super._update(from, to, amount);
}
```

Notice the override list now includes three extensions: `ERC20`, `ERC20Pausable`, and `ERC20Capped`.

**The pause() and unpause() Functions**

Only the owner can pause or unpause:

```solidity
function pause() public onlyOwner {
    _pause();
}

function unpause() public onlyOwner {
    _unpause();
}
```

**Updated Contract**

```solidity
contract BestToken is ERC20, ERC20Burnable, ERC20Pausable, ERC20Capped, ... {
    // ... constructor ...

    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Pausable, ERC20Capped)
    {
        super._update(from, to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
```

**Use Case**

If a vulnerability is discovered, the owner calls `pause()` to stop all transfers immediately while the fix is deployed.

### 5. Add Permit (ERC2612) Extension

The Permit extension allows changing an account's allowance by presenting a message signed by the account. The token holder doesn't need to send a transaction, so they don't need to hold Ether at all.

**The permit() Function**

Instead of calling `approve()`, users sign a permit message:

```solidity
function permit(
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) public
```

**How It Works**

1. User signs a message off-chain (using MetaMask, etc.)
2. Someone submits the signed message to `permit()`
3. The contract recovers the signer and sets the allowance
4. No ETH required for the approval transaction

**No _update() Override**

Permit doesn't override `_update()`. It works independently through cryptographic signatures.

**Updated Contract**

The contract now inherits from `ERC20Permit`:

```solidity
contract BestToken is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, ERC20Capped, ... {
    constructor()
        ERC20("BestToken", "BEST")
        ERC20Permit("BestToken")  // Add this line
        ERC20Capped(1000000 * 10 ** decimals())
    {}
    
    // _update() and other functions remain the same
}
```

**Use Case**

An employee signs a permit message, allowing a marketplace to spend their tokens. The marketplace submits the permit on-chain in one transaction, no separate approve needed.

### 6. Add Ownable2Step Extension

Ownable2Step makes ownership transfer safer with a two-step process. Ownership transfer requires acceptance from the new owner. This prevents accidentally transferring ownership to a wrong address. If the current owner makes a typo, the new owner must accept the transfer before it completes.

**The Two Functions**

`transferOwnership(address newOwner)` — Called by the current owner to propose a new owner

`acceptOwnership()` — Called by the proposed new owner to accept and finalize the transfer

**Ownership Transfer Flow**

1. Current owner calls `transferOwnership("0xNewOwnerAddress")`
2. New owner receives proposal notification
3. New owner calls `acceptOwnership()` to complete transfer
4. If new owner doesn't call it, transfer stays pending

This two-step process prevents ownership accidents.

### 7. Deploy with Hardhat

Hardhat's flexibility allows you to deploy your smart contracts in two ways:
* using Hardhat Ignition
* using a script

Here we continue to deploy the contract using Hardhat Ignition modules.

To build a deployment module, create `ignition/modules/BestToken.ts`:

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BestToken", (m) => {
  const name = m.getParameter("name", "BestToken");
  const symbol = m.getParameter("symbol", "BEST");
  const owner = m.getParameter("owner", m.getAccount(0));
  const initial = m.getParameter("initial", 1000000n);

  const bestToken = m.contract("BestToken", [name, symbol, owner, initial]);

  return { bestToken };
});
```

Now that the module definition is ready, let's deploy it to a local Hardhat node. Start by spinning up a local node:

```bash
npx hardhat node
```

In another terminal, run:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network localhost
```

You'll see the deployed contract address. Save it — you'll need it for testing and verification.

## Conclusion
