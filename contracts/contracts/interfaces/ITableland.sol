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
        string[] memory categories
    ) external; 

    function insertCompletedTask(
        uint256 claimID,
        address contributor,
        string memory name,
        string memory decription
    )external;
}