# Getting Started

This guide walks you through the quickest path to setting up, validating, and deploying BestToken. By the end, you'll have the project installed locally, the test suite passing, and a working deployment flow for local or testnet environments.

## 1. Prerequisites

This step ensures your machine has the runtime and tooling required to build, test, and deploy the contract.

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) v20 or later
- npm (comes with Node.js)
- Git

## 2. Clone and Install

This step downloads the repository and installs all dependencies so Hardhat and the project tooling are available.

```bash
git clone https://github.com/0xmehdizadeh/ERC20-token.git
cd ERC20-token
npm install
```

Expected result:

- The command should finish successfully with exit code 0.
- `npm install` will download the project dependencies and print a normal package installation summary.
- You should not see missing-module or dependency resolution errors.

## 3. Run the Test Suite

This step verifies the token logic before you deploy it, ensuring minting, burning, access control, and EIP-2612 permit behavior are working as expected.

```bash
npx hardhat test
```

Expected result:

- The test run should complete successfully.
- The final summary should show all tests passing, ending in a form similar to `N passing`.
- You should see the contract's key behaviors validated without failures or revert errors.

## 4. Deploy Locally

This step lets you test the deployment flow in a temporary local environment before you move to a public network.

BestToken uses [Hardhat Ignition](https://hardhat.org/ignition) for deployments. To deploy to a local, ephemeral Hardhat network:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network hardhatMainnet
```

If you want to use the built-in deployment parameters instead of entering them interactively, provide the parameters file:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts \
  --network hardhatMainnet \
  --parameters ignition/parameters.json
```

You will be prompted for the required values (`symbol` and `initial` supply) unless they are already supplied through the parameters file.

Expected result:

- Ignition will print the deployment status and a contract address.
- The deployed address usually looks like this: `0x4F3A...` or `0x1234abcd...`.
- The address should be a valid Ethereum-style checksum or hex address.

## 5. Deploy to a Testnet

This step moves the contract from your local environment to a public test network so it can be exercised with real RPC endpoints and wallet accounts.

This project uses [Hardhat Keystore](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) to securely store sensitive values such as RPC URLs and private keys instead of a `.env` file.

Before deploying to Sepolia or Base Sepolia, set the required values:

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

You will be prompted to enter each value securely, and it will not be stored in plain text or committed to the repo. The exact variable names required for each network are defined in `hardhat.config.ts`.

> **Note:** The keystore is protected by a master password. You will be asked to enter this password when setting values and again whenever a command needs to decrypt them.

Once your credentials are set, deploy to the target network:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network sepolia
```

Expected result:

- Deployment succeeds only if your RPC URL is valid and your wallet has enough funds.
- The output will include the deployed contract address in the same Ethereum-style format: `0x...`.

## Troubleshooting

If something does not work as expected, use the checks below.

### Error: Invalid RPC URL

This usually happens when the RPC endpoint is missing, malformed, or points to the wrong network.

Common fix:

- Verify the value stored in the keystore matches your provider's endpoint.
- Re-set it with:

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
```

- Check that the URL starts with the correct protocol, for example `https://` and not a placeholder value.
- Confirm the RPC corresponds to the same network you are deploying to, such as Sepolia.

### Error: Account has no funds for gas

This means the deployment wallet is connected to a network where the account balance is too low to pay transaction fees.

Common fix:

- Fund the wallet used for deployment with test ETH for Sepolia or the relevant network's test currency.
- Confirm you are using the correct private key by checking the account address in your wallet or provider.
- Re-run the deployment after funding the account:

```bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network sepolia
```

### Other common issues

- Make sure you are using Node.js v20 or newer.
- Re-run `npm install` if dependencies are missing or the project was recently updated.
- Confirm that the network name in your command matches a valid network defined in `hardhat.config.ts`.
- If deployment fails because configuration values are missing, re-run the `npx hardhat keystore set ...` commands for the required environment variables.
- When prompted for the keystore password, enter the same master password you used when first storing the values.

## Next Steps

- Review the [API Reference](./api/BestToken.md) for a complete breakdown of the contract's functions, parameters, and the `_update` override chain.
- Explore the project docs for additional detail on architecture and deployment patterns.
