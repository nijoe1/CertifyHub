// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface ITableland {

    function insertFunding(
        uint256 claimID,
        string memory company,
        uint256 fundAmount
    ) external; 

    function insertAttestation(
        uint256 claimID,
        address verifier,
        string memory company,
        uint8 feedbackRange,
        string memory comment
    ) external; 

    function insertHypercertInfo(
        uint256 claimID,
        string memory uri,
        address creator,
        address[] memory owners,
        uint256[] memory shares,
        string[] memory categories
    ) external; 
}