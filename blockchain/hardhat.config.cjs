require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// require("@nomicfoundation/hardhat-ignition-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: API_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      accounts: [`0x${PRIVATE_KEY}`] ,
    }
  }
};
