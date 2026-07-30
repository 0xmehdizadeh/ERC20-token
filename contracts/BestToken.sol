// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract BestToken is ERC20, ERC20Capped, ERC20Burnable, ERC20Permit, Ownable2Step, ERC20Pausable{
   constructor(string memory name_, string memory symbol_, address owner_, uint256 initial_) ERC20(name_, symbol_) ERC20Capped(2 * initial_ * 10 ** decimals()) ERC20Permit(name_) Ownable(owner_){
    _mint(owner_, initial_ * 10 ** decimals());
   
   }

   function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped, ERC20Pausable) {
      super._update(from, to, value);
   }

   function pause() external onlyOwner {
      _pause();
   }
   function unpause() external onlyOwner {
      _unpause();
   }


   
}