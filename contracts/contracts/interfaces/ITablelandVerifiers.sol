pragma solidity 0.8.19;

interface ITablelandVerifiers {
    function insertCompany(
        string memory company,
        address[] memory verifiers,
        address admin
    ) external; 
}