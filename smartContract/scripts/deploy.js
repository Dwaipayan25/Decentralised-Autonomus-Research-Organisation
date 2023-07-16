const hre = require("hardhat");

async function main() {
  // Get the accounts
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the contract
  const DAROSmartContract = await hre.ethers.getContractFactory("DAROSmartContract");
  const daroContract = await DAROSmartContract.deploy(
    // Pass the constructor arguments if required
    "0xe432150cce91c13a887f7D836923d5597adD8E31", // Alexar gateway contract for Filecoin testnet
    "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6" // Alexar service contract for Filecoin testnet
  );

  await daroContract.deployed();

  console.log("DARO Smart Contract deployed to:", daroContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
