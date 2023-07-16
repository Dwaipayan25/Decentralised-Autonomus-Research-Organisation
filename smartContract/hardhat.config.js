require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hyperspace",
  networks: {
    localnet: {
        chainId: 31415926,
        url: "http://127.0.0.1:1234/rpc/v1",
        accounts: [PRIVATE_KEY],
    },
    hyperspace: {
        chainId: 3141,
        url: "https://api.hyperspace.node.glif.io/rpc/v1",
        accounts: [PRIVATE_KEY],
    },
    filecoinmainnet: {
        chainId: 314,
        url: "https://api.node.glif.io",
        accounts: [PRIVATE_KEY],
    },
  }
};
