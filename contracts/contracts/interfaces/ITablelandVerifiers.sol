pragma solidity 0.8.19;

interface ITablelandVerifiers {
    function insertCompany(
        string memory company,
        string memory image,
        string memory description,
        address admin
    ) external; 

    function insertEvent(
        string memory company,
        string memory cid,
        bytes32 eventId,
        uint256 endTime,
        address[] memory eventVerifiers
    ) external; 
}