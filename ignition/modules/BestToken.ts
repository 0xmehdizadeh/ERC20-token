import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BestToken", (m) => {
  const name = m.getParameter("name", "BestToken");
  const symbol = m.getParameter("symbol");
  const owner = m.getParameter("owner", m.getAccount(0));
  const initial = m.getParameter("initial");
  const BestToken = m.contract("BestToken", [name, symbol, owner, initial]);


  return { BestToken };
});
