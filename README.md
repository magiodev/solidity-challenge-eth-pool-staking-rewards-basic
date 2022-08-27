# Proof of Concept: ETH Pool Staking Rewards Basic

## Solidity Challenge
A simple ETH Pool smart contract with staking rewards, redistributed taking in count of the time when the users deposited.

### Summary
ETHPool provides a service where people can deposit ETH and they will receive weekly rewards. Users must be able to take out their deposits along with their portion of rewards at any time. New rewards are deposited manually into the pool by the ETHPool team each week using a contract function.

### Requirements:
- Only the team can deposit rewards.
- Deposited rewards go to the pool of users, not to individual users.
- Users should be able to withdraw their deposits along with their share of rewards considering the time when they deposited.

### Example
```
Let say we have user A and B and team T.
A deposits 100, and B deposits 300 for a total of 400 in the pool. Now A has 25% of the pool and B has 75%. When T deposits 200 rewards, A should be able to withdraw 150 and B 450.
What if the following happens? A deposits then T deposits then B deposits then A withdraws and finally B withdraws. A should get their deposit + all the rewards. B should only get their deposit because rewards were sent to the pool before they participated.
```

### Goal
Design and code a contract for ETHPool, take all the assumptions you need to move forward. You can use any development tools you prefer: Hardhat, Truffle, Brownie, Solidity, Vyper.

### Tasks
- Write the smart contract
- Deploy your contract on a testnet
- - Verify it
- Interact with the contract. Create a script (or a Hardhat task) to query the total amount of ETH held in the contract.

<hr/>

### Deployed and verified contract
- Goerli Etherscan: https://goerli.etherscan.io/address/0x4E1716dc1Ea835b1F7f0565c7d8D3E49E4d638F5

<hr/>

## Project setup
Run installations in both root and in the frontend folder:
```bash
npm install
```

## Create .env files (root / frontend)
Set the environment you want to use and choose the related compiling method described as below
```bash
cp .env-template .env
```

## Tests

### Solidity/Hardhat
```bash
npx hardhat test
```

## Deployment to HardHat (best for testing)
check hardhat.config.js to have "hardhat" as default
```bash
npx hardhat run scripts/deploy.js
```

## Deployment to a remote Blockchain
```bash
npx hardhat run scripts/deploy.js --network goerli
```

## Verify on Etherscan (if remote Blockchain)
```bash
npx hardhat --network mainnet etherscan-verify --api-key <apikey>
```
