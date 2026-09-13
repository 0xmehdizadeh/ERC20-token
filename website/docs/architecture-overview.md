# BestToken

BestToken is an ERC20 token designed for scenarios that require a **fixed supply, controlled distribution, and emergency safeguards**. One example is an internal company currency where employees earn and redeem tokens. But it can also serve other use cases: governance tokens for DAOs, community rewards, or any tokenized system needing supply certainty and pause capabilities.

## Design Decisions

Several key design choices make BestToken suitable for these scenarios:

### Capped supply

Why the token's supply is limited?
A fixed supply cap ensures predictability. Users know there will never be more than [X] tokens, preventing hidden inflation. This is critical for trust whether the token is company currency, governance tokens, or community rewards.

### Burnable

Why tokens can be destroyed?
Token holders can permanently remove tokens from circulation by burning them. This is useful if an employee leaves and wants to exit their position cleanly, or if the company needs to reduce supply for any reason.

### Permit

Why gasless approval?
It can be used to change an account's allowance by presenting a message signed by the account. The token holder account doesn't need to send a transaction, and thus is not required to hold Ether at all. This feature reduces the number of onchain transactions.

### Pausable

Why pause transfers?
Pausing allows the owner to temporarily stop all token transfers in case of security issues or detected bugs. Once the issue is resolved, transfers can be unpaused. This is an emergency safeguard, not meant for regular operation.

### Ownable2Step

Why two-step ownership?
Ownership transfer requires acceptance from the new owner. This prevents accidentally transferring ownership to a wrong address. If the current owner makes a typo, the new owner must accept the transfer before it completes.

### The \_update Override Chain

How do these extensions work together?

BestToken uses OpenZeppelin's `_update` hook, which is called every time tokens are transferred or minted. Each extension overrides this hook to enforce its rules in sequence:

1. **Pausable** checks first: "Are transfers paused right now?"
2. **Capped** checks second: "Is minting this amount allowed by the cap?"
3. **Permit** and **Burnable** work independently (not in the override chain)

When a transfer happens, all checks run in order. If any fails, the transfer reverts.

## Deployment & Security

### Initial Setup

- Deploy with cap amount (e.g., 1,000,000 tokens)
- Owner is set to the company treasury or multisig wallet
- Tokens minted to initial holders

### Who controls what?

- Only the owner can pause/unpause transfers
- Only the owner can mint tokens
- Any user can burn their own tokens
- Any user can approve via Permit without holding ETH

### Security Considerations

- Ensure the owner address is correct before deployment
- Use a multisig wallet as owner for critical systems
- Test pause/unpause mechanism before production
