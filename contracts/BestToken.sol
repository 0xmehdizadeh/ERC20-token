// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/// @title BestToken: An ERC20 token
/// @author 0xmehdizadeh
/// @notice ERC20 token with capped supply, burnability, gasless approvals, two-step ownership, and pausability.
/// @dev Combines OpenZeppelin v5 extensions. The supply cap is set to twice the initial mint amount at deployment.
///      Resolves the three-way `_update` override conflict between {ERC20}, {ERC20Capped}, and {ERC20Pausable}.
contract BestToken is ERC20, ERC20Capped, ERC20Burnable, ERC20Permit, Ownable2Step, ERC20Pausable {
    /// @notice Deploys the token and mints the initial supply to `owner_`.
    /// @param name_ Token name (e.g. "BestToken").
    /// @param symbol_ Token symbol (e.g. "BST").
    /// @param owner_ Address that receives the initial mint and ownership.
    /// @param initial_ Whole-token count for the initial mint (scaled internally by `10 ** decimals()`).
    ///                 The cap is set to `2 * initial_ * 10 ** decimals()`.
    constructor(
        string memory name_,
        string memory symbol_,
        address owner_,
        uint256 initial_
    ) ERC20(name_, symbol_) ERC20Capped(2 * initial_ * 10 ** decimals()) ERC20Permit(name_) Ownable(owner_) {
        _mint(owner_, initial_ * 10 ** decimals());
    }

    /// @dev Delegates to the parent override chain:
    ///      {ERC20Pausable} (pause check) → {ERC20Capped} (cap check) → {ERC20} (balance update).
    /// @param from Sender address (zero address for mints).
    /// @param to Recipient address (zero address for burns).
    /// @param value Amount of tokens transferred, minted, or burned, in smallest units (i.e. `10 ** decimals()` per whole token).
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped, ERC20Pausable)
    {
        super._update(from, to, value);
    }

    /// @notice Pauses all token transfers, mints, and burns.
    /// @dev Callable only by the contract owner.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Resumes token transfers, mints, and burns after a pause.
    /// @dev Callable only by the contract owner.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Mints new tokens to `to`, up to the supply cap.
    /// @param to Recipient of the newly minted tokens.
    /// @param amount Number of tokens to mint (in smallest units, i.e. `10 ** decimals()` per whole token).
    /// @dev Callable only by the contract owner. Reverts if minting would exceed the cap
    ///      (enforced via the `_update` override chain).
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}