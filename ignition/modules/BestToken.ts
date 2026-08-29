import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Deployment module for BestToken via Hardhat Ignition.
// `symbol` and `initial` supply must be provided explicitly at deploy time (no sensible default exists for these);
// `name` and `owner` fall back to "BestToken" and the first configured account, respectively.
export default buildModule("BestToken", (m) => {
  const name = m.getParameter("name", "BestToken");
  const symbol = m.getParameter("symbol");
  const owner = m.getParameter("owner", m.getAccount(0));
  const initial = m.getParameter("initial");
  const BestToken = m.contract("BestToken", [name, symbol, owner, initial]);


  return { BestToken };
});
