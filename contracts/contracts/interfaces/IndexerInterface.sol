// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IndexerInterface {

    function insertFunding(
        uint256 claimID,
        string memory company,
        uint256 fundAmount,
        address ERC20Token,
        address splitterAddress
    )  external; 

    function insertAttestation(
        uint256 claimID,
        address verifier,
        string memory company,
        uint8 feedbackRange,
        string memory comment
    ) external; 

    function insertHypercertInfo(
        uint256 claimID,
        string[] memory categories,
        string[] memory events
    ) external; 

    function insertCompletedTask(
        uint256 claimID,
        address contributor,
        string memory cid
    ) external;

    function insertSplitter(
        uint256 claimID,
        address splitterAddress
    ) external;

    function registerEvents(        
        uint256 claimID,
        string[] memory events
    )external;
}