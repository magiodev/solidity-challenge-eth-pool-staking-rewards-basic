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

    it("Unit OK: Users can deposit 100 Wei", async function() {
        const depositAmount = 100;
        const {c, accountUserA} = await loadFixture(deploymentFixture);
        await c.ETHPool.connect(accountUserA).deposit({
            from: accountUserA.address,
            value: depositAmount // wei
        })
        expect(await c.ETHPool.getUserBalance(accountUserA.address)).to.equal(depositAmount);
        expect(await c.ETHPool.getPoolBalance()).to.equal(depositAmount);
        expect(await c.ETHPool.userDepositsBalance()).to.equal(depositAmount);
    });

    it("Unit OK: Users can withdraw 100 Wei", async function() {
        const depositAmount = 100;
        const expectedAfterAmount = 0;
        const {c, accountUserA} = await loadFixture(deploymentFixture);
        await c.ETHPool.connect(accountUserA).deposit({
            from: accountUserA.address,
            value: depositAmount // wei
        })
        expect(await c.ETHPool.getUserBalance(accountUserA.address)).to.equal(depositAmount);
        expect(await c.ETHPool.getPoolBalance()).to.equal(depositAmount);
        expect(await c.ETHPool.userDepositsBalance()).to.equal(depositAmount);

        await c.ETHPool.connect(accountUserA).withdraw({
            from: accountUserA.address
        })
        expect(await c.ETHPool.getUserBalance(accountUserA.address)).to.equal(expectedAfterAmount);
        expect(await c.ETHPool.getPoolBalance()).to.equal(expectedAfterAmount);
        expect(await c.ETHPool.userDepositsBalance()).to.equal(expectedAfterAmount);
    });

    it("Unit KO: User A tries to deposit 0 Wei", async function() {
        const depositAmount = 0;
        const {c, accountUserB} = await loadFixture(deploymentFixture);
        await expect(c.ETHPool.connect(accountUserB).deposit({
            from: accountUserB.address,
            value: depositAmount // wei
        })).to.be.revertedWith('You cannot send empty value.')
    });

    it("Unit OK: Team can depositRewards 200 Wei", async function() {
        const depositAmount = 200;
        const {c, accountTeam} = await loadFixture(deploymentFixture);
        await c.ETHPool.connect(accountTeam).depositRewards({
            from: accountTeam.address,
            value: depositAmount // wei
        })
        expect(await c.ETHPool.getPoolBalance()).to.equal(depositAmount);
    });

    it("Unit KO: Team tries to deposit 0 Wei", async function() {
        const depositAmount = 0;
        const {c, accountTeam} = await loadFixture(deploymentFixture);
        await expect(c.ETHPool.connect(accountTeam).depositRewards({
            from: accountTeam.address,
            value: depositAmount // wei
        })).to.be.revertedWith('You cannot send empty value.')
    });
});
