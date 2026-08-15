BestToken
An ERC20 token built with OpenZeppelin v5, combining multiple extensions through Solidity inheritance: capped supply, burnability, gasless approvals (EIP-2612), two-step ownership transfer, and pausability.

Overview
BestToken demonstrates a multi-inheritance ERC20 implementation, resolving a three-way _update override conflict between ERC20, ERC20Capped, and ERC20Pausable. The initial token supply and the supply cap are structurally linked: the cap is always set to double the initial minted amount, so the two values can never conflict at deployment.

Features
ERC20 — standard token functionality (transfer, approve, balances)
ERC20Capped — enforces a hard ceiling on total supply
ERC20Burnable — allows token holders to burn their own tokens, or burn from an approved allowance via burnFrom
ERC20Permit (EIP-2612) — gasless approvals via off-chain EIP-712 signatures
Ownable2Step — two-step ownership transfer, preventing accidental transfer to an unreachable address
ERC20Pausable — owner-gated pause()/unpause(), blocking transfers while paused
Owner-gated mint() — allows the owner to mint additional tokens up to the cap

Contract Design
BestToken
├── ERC20            base: balances, transfer, approve, name/symbol
├── ERC20Capped       hard ceiling on total supply
├── ERC20Burnable     burn(), burnFrom()
├── ERC20Permit       permit() — gasless approval via signature
├── Ownable2Step      owner, two-step ownership transfer
└── ERC20Pausable     paused state, blocks transfers when paused

Constructor
solidity
constructor(string memory name_, string memory symbol_, address owner_, uint256 initial_)
initial_ is a whole-token count (e.g. 1000000 for 1,000,000 tokens). The constructor scales it internally by 10 ** decimals().
The initial mint amount is initial_, and the cap is set to 2 * initial_ — guaranteeing the constructor's mint can never exceed the cap.
_update Override

ERC20, ERC20Capped, and ERC20Pausable all override _update. BestToken resolves this with a single override that delegates via super, producing the call chain:

BestToken._update() → ERC20Pausable._update() [pause check] → ERC20Capped._update() [cap check] → ERC20._update() [balance update]
Development

Built with Hardhat 3, TypeScript, Mocha, ethers.js, and OpenZeppelin Contracts v5.

Install
bash
npm install
Compile
bash
npx hardhat compile
Test
bash
npx hardhat test

Test coverage includes:

Deployment/constructor correctness (name, symbol, owner, initial balance, total supply, cap)
mint() — happy path, cap enforcement, owner-only access control
pause()/unpause() — happy path (blocked/restored transfers), owner-only access control
Two-step ownership transfer — happy path and wrong-acceptor rejection
burn() and burnFrom()
permit() — signature-based approval, expired deadline rejection, wrong-signer rejection
Deploy

Deployment is managed with Hardhat Ignition. Constructor arguments are supplied via ignition/parameters.json.

bash
npx hardhat ignition deploy ignition/modules/BestToken.ts --network <network> --parameters ignition/parameters.json
Verify
bash
npx hardhat verify --network <network> <deployed_address> "<name>" "<symbol>" "<owner>" "<initial>"


Deployments
Network	Address	Explorer
Base Sepolia (testnet)	0x04C191f15daA795f0c02973EE44eF3e358463b51	Basescan Sepolia
Base Mainnet	0x73E58dc609e2D38AC09871BE6bD97e0f126A92ea	Basescan
Ethereum Mainnet	0xcBEEEF9a0F2163a873cfAEF01dAeECC441954F50	Etherscan

License MIT