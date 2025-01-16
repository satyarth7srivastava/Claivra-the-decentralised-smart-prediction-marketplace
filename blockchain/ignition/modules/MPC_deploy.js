const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MPC", (m) => {
  const apollo = m.contract("MarketPlaceContract");

  return { apollo };
});