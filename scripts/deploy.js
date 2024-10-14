const hre = require("hardhat");

async function main() {
  try {
    const X1Racing = await hre.ethers.getContractFactory("X1Racing");

    // Deploy the contract
    const contract = await X1Racing.deploy("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");

    // Wait for the deployment transaction to be mined
    // await contract.waitForDeployment()

    console.log(`X1Racing deployed to: ${contract.address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
