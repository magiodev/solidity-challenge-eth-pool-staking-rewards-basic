// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.16;

contract ETHPool is Ownable {
    mapping (address => UserDeposit[]) public usersDeposits;
    TeamDeposit[] public teamDeposits;
    uint256 public userDepositsBalance;
    uint256 public teamDepositsBalance;

    // struct for both deposits
    struct UserDeposit {
        uint256 amount;
        uint256 timestamp;
        uint256 rewardsDepositsLength;
    }
    struct TeamDeposit {
        uint256 amount;
        uint256 timestamp;
        uint256 userDepositsBalance;
    }

    // Events
    event Deposited(uint256 amount, uint256 timestamp, address user);
    event Withdrawn(uint256 amount, uint256 timestamp, address user);
    event DepositedReward(uint256 amount, uint256 timestamp);

    // PUBLIC METHODS

    // Deposit method allow users to deposit ETH keeping track of who, how much and when he deposited in order to
    function deposit() public payable {
        require(msg.value > 0, "You cannot send empty value.");
        usersDeposits[msg.sender].push(
            UserDeposit(
                msg.value,
                block.timestamp,
                teamDeposits.length
            )
        );

        userDepositsBalance = userDepositsBalance + msg.value;

        emit Deposited(msg.value, block.timestamp, msg.sender);
    }

    function withdraw() public {
        uint256 balance = getUserBalance(msg.sender);
        uint256 rewards = getUserRewardsAmount(msg.sender);

        uint256 amount = balance + rewards; // balance + rewards
        payable(msg.sender).transfer(amount); // sending amount to user
        userDepositsBalance = userDepositsBalance - balance;
        teamDepositsBalance = teamDepositsBalance - rewards; // decreasing teamDepositsBalance

        delete usersDeposits[msg.sender]; // deleting userDeposits

        emit Withdrawn(amount, block.timestamp, msg.sender);
    }

    function getUserRewardsAmount(address user) public view returns (uint256) {
        uint256 rewards = 0;

        for (uint256 i = 0; i < usersDeposits[user].length; i++) {
            // starting from next rewardsDeposit respect when deposited
            for (uint256 t = usersDeposits[user][i].rewardsDepositsLength; t < teamDeposits.length; t++) {
                uint256 poolShareInBasisPoints = (usersDeposits[user][i].amount * 10000) / teamDeposits[t].userDepositsBalance;
                uint256 currentRewardsAmount = (teamDeposits[t].amount * poolShareInBasisPoints) / 10000;
                rewards = rewards + currentRewardsAmount;
            }
        }

        return rewards;
    }

    // GETTERS

    function getPoolBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserBalance(address user) public view returns (uint256) {
        uint256 balance = 0;
        for (uint256 i = 0; i < usersDeposits[user].length; i++) {
            balance = balance + usersDeposits[user][i].amount;
        }
        return balance;
    }

    // OWNER

    function depositRewards() public payable onlyOwner {
        require(msg.value > 0, "You cannot send empty value.");
        teamDepositsBalance = teamDepositsBalance + msg.value; // incrementing teamDepositsBalance variable

        teamDeposits.push(
            TeamDeposit(
                msg.value,
                block.timestamp,
                userDepositsBalance
            )
        );

        emit DepositedReward(msg.value, block.timestamp);
    }
}
