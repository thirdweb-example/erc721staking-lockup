// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@thirdweb-dev/contracts/base/Staking721Base.sol";
import "@thirdweb-dev/contracts/token/TokenERC20.sol";

contract NFTLock is Staking721Base {
    // This contract allows users to stake their nft for 30 days
    // User can only withdraw their NFT after 30 days of time limit is reached
    // User can earn and claim their staking rewards anytime

    mapping(uint256 => uint256) public nftLockTime;
    mapping(uint256 => bool) public nftLocked;

    constructor(
        uint256 _timeUnit,
        uint256 _rewardsPerUnitTime,
        address _stakingToken,
        address _rewardToken,
        address _nativeTokenWrapper
    )
        Staking721Base(
            _timeUnit,
            _rewardsPerUnitTime,
            _stakingToken,
            _rewardToken,
            _nativeTokenWrapper
        )
    {}

    function _stake(uint256[] calldata _tokenIds) internal override {
        super._stake(_tokenIds);
        for (uint i = 0; i < _tokenIds.length; i++) {
            nftLocked[_tokenIds[i]] = true;
            nftLockTime[_tokenIds[i]] = block.timestamp + 30 days;
        }
    }

    function _withdraw(uint256[] calldata _tokenIds) internal override {
        for (uint i = 0; i < _tokenIds.length; i++) {
            require(
                block.timestamp > nftLockTime[_tokenIds[i]],
                "You can't withdraw unless your 30 days are completed!"
            );
            nftLocked[_tokenIds[i]] = false;
        }
        super._withdraw(_tokenIds);
    }

    function _mintRewards(address _staker, uint256 _rewards) internal override {
        TokenERC20(rewardToken).mintTo(_staker, _rewards);
    }
}
