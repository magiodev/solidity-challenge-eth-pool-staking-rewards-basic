const utils = require('./utils');
const hre = require('hardhat')

let deployerAddr

// write down contracts that you wish to deploy one-by-one
// after the run, find the ABIs and addresses in frontend/src/contracts
const contracts = [
  {
    path: '',
    libraries: [],
    name: "ETHPool", // names only, no .sol extension
    constructor: [],
    ethernal: false // if using ethernal as private rpc explorer (for hardhat/ganache)
  }
];


async function main() {
  let accounts = await hre.ethers.getSigners();
  deployerAddr = accounts[0].address
  await utils.logDeployer()
  for (const contract of contracts) {
    await utils.publishContract(contract);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
