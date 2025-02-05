// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IArtworkRegistry {
    function getTokenIds() external view returns (uint256[] memory);
    function getTokenIdLength() external view returns (uint256);
}
