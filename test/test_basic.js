const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Suite testing", () => {

    async function deploymentFixture() {
        const accounts = await ethers.getSigners();
        const accountTeam = accounts[0];
        const accountUserA = accounts[1];
        const accountUserB = accounts[2];

        // contracts instances
        let c = {
            ETHPool: null
        }

        // Deploying contracts

        const ETHPool = await ethers.getContractFactory("ETHPool")
        c.ETHPool = await ETHPool.deploy();
        await c.ETHPool.deployed();

        return {c, accountTeam, accountUserA, accountUserB}
    }

    it("User A can deposit 100 Wei", async function() {
        const depositAmount = 100;
        const {c, accountUserA} = await loadFixture(deploymentFixture);
        await c.ETHPool.connect(accountUserA).deposit({
            from: accountUserA.address,
            value: depositAmount // wei
        })
        expect(await c.ETHPool.getPoolBalance()).to.equal(depositAmount);
    });

    it("User B can deposit 300 Wei", async function() {
        const depositAmount = 300;
        const {c, accountUserB} = await loadFixture(deploymentFixture);
        await c.ETHPool.connect(accountUserB).deposit({
            from: accountUserB.address,
            value: depositAmount // wei
        })
        expect(await c.ETHPool.getPoolBalance()).to.equal(depositAmount);
    });

    it("Team can depositRewards 200 Wei", async function() {
        const depositAmount = 200;
        const {c, accountTeam} = await loadFixture(deploymentFixture);
        await c.ETHPool.connect(accountTeam).depositRewards({
            from: accountTeam.address,
            value: depositAmount // wei
        })
        expect(await c.ETHPool.getPoolBalance()).to.equal(depositAmount);
    });

    it("A and B can withdraw their deposits + rewards as they both deposited before", async function() {
        const userADepositAmount = 100
        const userBDepositAmount = 300
        const teamDepositRewardsAmount = 200
        const expectedBeforeAmountA = 150;
        const expectedBeforeAmountB = 450;
        const expectedAfterAmount = 0;
        const {c, accountUserA, accountUserB, accountTeam} = await loadFixture(deploymentFixture);

        // userA deposits
        await c.ETHPool.connect(accountUserA).deposit({
            from: accountUserA.address,
            value: userADepositAmount // wei
        })

        // userB deposits
        await c.ETHPool.connect(accountUserB).deposit({
            from: accountUserB.address,
            value: userBDepositAmount // wei
        })

        // team deposits
        await c.ETHPool.connect(accountTeam).depositRewards({
            from: accountTeam.address,
            value: teamDepositRewardsAmount // wei
        })

        // check balance before withdraws
        let beforeA = Number(await c.ETHPool.getUserBalance(accountUserA.address)) + Number(await c.ETHPool.getUserRewardsAmount(accountUserA.address))
        expect(beforeA).to.equal(expectedBeforeAmountA);
        let beforeB = Number(await c.ETHPool.getUserBalance(accountUserB.address)) + Number(await c.ETHPool.getUserRewardsAmount(accountUserB.address))
        expect(beforeB).to.equal(expectedBeforeAmountB);
        expect(beforeA + beforeB).to.equal(await c.ETHPool.getPoolBalance());

        await c.ETHPool.connect(accountUserA).withdraw({
            from: accountUserA.address
        })
        await c.ETHPool.connect(accountUserB).withdraw({
            from: accountUserB.address
        })

        let afterA = Number(await c.ETHPool.getUserBalance(accountUserA.address)) + Number(await c.ETHPool.getUserRewardsAmount(accountUserA.address))
        expect(afterA).to.equal(expectedAfterAmount);
        let afterB = Number(await c.ETHPool.getUserBalance(accountUserB.address)) + Number(await c.ETHPool.getUserRewardsAmount(accountUserB.address))
        expect(afterB).to.equal(expectedAfterAmount);
        expect(afterA + afterB).to.equal(expectedAfterAmount);
    });

});
