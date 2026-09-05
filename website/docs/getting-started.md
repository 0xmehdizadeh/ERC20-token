# Getting Started

This guide walks you through cloning, testing, and deploying the BestToken contract locally.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- npm (comes with Node.js)
- Git

## Clone and Install

```bash
git clone https://github.com/0xmehdizadeh/ERC20-token.git
cd ERC20-token
npm install
```

## Run the Test Suite

The project includes a full test suite covering minting, burning, pausing, ownership transfer, and EIP-2612 permit signatures.

```bash
npx hardhat test
```

You should see all tests pass, covering the token's core behaviors and edge cases (e.g. exceeding the supply cap, unauthorized access, expired permit signatures).

## Deploy Locally

BestToken uses [Hardhat Ignition](https://hardhat.org/ignition) for deployments. To deploy to a local, ephemeral Hardhat network:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network hardhatMainnet
```

You'll be prompted for the required parameters (`symbol` and `initial` supply) unless you provide them via a parameters file:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts \
  --network hardhatMainnet \
  --parameters ignition/parameters.json
```

## Deploy to a Testnet

This project uses [Hardhat Keystore](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) to securely store sensitive values (RPC URLs and private keys) instead of a `.env` file.

Before deploying to Sepolia or Base Sepolia, set the required values:

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

You'll be prompted to enter each value securely (it won't be stored in plain text or committed to the repo). The exact variable names required for each network are defined in `hardhat.config.ts`.

> **Note:** The keystore is protected by a master password. You'll be asked to enter this password once when setting values, and again every time you run a command (like `deploy`) that needs to decrypt them.

Once set, deploy with:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network sepolia
```

## Next Steps

- See the [API Reference](/docs/api/BestToken) for a full breakdown of the contract's functions, parameters, and the `_update` override chain.