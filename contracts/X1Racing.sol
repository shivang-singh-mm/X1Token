// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract X1Racing is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct Staker {
        uint256 amount;
        uint256 stakingTime;
        uint256 reward;
    }

    uint256 public rewardRate = 833333333333333;
    mapping(address => Staker) public stakers;

    constructor(address payable account) ERC20("StakingToken", "STK") {
        _mint(account, 1000000 * 10 ** decimals());
    }
    function stake(address payable account, uint256 amount) external {
        uint256 _amount = amount * 10 ** decimals();
        require(_amount > 0, "Amount must be greater than zero");
        require(balanceOf(account) >= _amount, "Not enough balance");

        if (stakers[account].amount > 0) {
            stakers[account].reward += calculateReward(account);
        }

        _transfer(account, address(this), _amount);

        stakers[account].amount += _amount;
        stakers[account].stakingTime = block.timestamp;
    }

    function unstake(address payable account) external {
        require(stakers[account].amount > 0, "No staked tokens");

        uint256 stakedAmount = stakers[account].amount;

        stakers[account].amount = 0;
        stakers[account].stakingTime = 0;
        stakers[account].reward = 0;

        _mint(address(this), stakedAmount * 4);

        _transfer(address(this), account, stakedAmount + stakedAmount);
    }

    function calculateReward(address _staker) internal view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakers[_staker].stakingTime;
        return (stakers[_staker].amount * rewardRate * timeStaked) / 1e18;
    }

    function setRewardRate(uint256 _rate) external {
        rewardRate = _rate;
    }

    function mint(address payable to, uint256 amount) external {
        _mint(to, amount * 10 ** decimals());
    }
}
