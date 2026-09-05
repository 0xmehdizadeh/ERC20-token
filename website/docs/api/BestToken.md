# BestToken
[Git Source](https://github.com/0xmehdizadeh/ERC20-token/blob/b7e0722d63646645f3e07fa822fd35c179cb785a/contracts/BestToken.sol)

**Inherits:**
ERC20, ERC20Capped, ERC20Burnable, ERC20Permit, Ownable2Step, ERC20Pausable

**Title:**
BestToken: An ERC20 token

**Author:**
0xmehdizadeh

ERC20 token with capped supply, burnability, gasless approvals, two-step ownership, and pausability.

Combines OpenZeppelin v5 extensions. The supply cap is set to twice the initial mint amount at deployment.
Resolves the three-way `_update` override conflict between `ERC20`, `ERC20Capped`, and `ERC20Pausable`.


## Functions
### constructor

Deploys the token and mints the initial supply to `owner_`.


```solidity
constructor(string memory name_, string memory symbol_, address owner_, uint256 initial_)
    ERC20(name_, symbol_)
    ERC20Capped(2 * initial_ * 10 ** decimals())
    ERC20Permit(name_)
    Ownable(owner_);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`name_`|`string`|Token name (e.g. "BestToken").|
|`symbol_`|`string`|Token symbol (e.g. "BST").|
|`owner_`|`address`|Address that receives the initial mint and ownership.|
|`initial_`|`uint256`|Whole-token count for the initial mint (scaled internally by `10 ** decimals()`). The cap is set to `2 * initial_ * 10 ** decimals()`.|


### _update

Delegates to the parent override chain:
`ERC20Pausable` (pause check) → `ERC20Capped` (cap check) → `ERC20` (balance update).


```solidity
function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped, ERC20Pausable);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`|Sender address (zero address for mints).|
|`to`|`address`|Recipient address (zero address for burns).|
|`value`|`uint256`|Amount of tokens transferred, minted, or burned, in smallest units (i.e. `10 ** decimals()` per whole token).|


### pause

Pauses all token transfers, mints, and burns.

Callable only by the contract owner.


```solidity
function pause() external onlyOwner;
```

### unpause

Resumes token transfers, mints, and burns after a pause.

Callable only by the contract owner.


```solidity
function unpause() external onlyOwner;
```

### mint

Mints new tokens to `to`, up to the supply cap.

Callable only by the contract owner. Reverts if minting would exceed the cap
(enforced via the `_update` override chain).


```solidity
function mint(address to, uint256 amount) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`to`|`address`|Recipient of the newly minted tokens.|
|`amount`|`uint256`|Number of tokens to mint (in smallest units, i.e. `10 ** decimals()` per whole token).|


