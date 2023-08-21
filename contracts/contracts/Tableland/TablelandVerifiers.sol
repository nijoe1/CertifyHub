// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DB_NFT.
 * @author Nick Lionis (github handle: nijoe1)
 * @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
 * All the data inside the tables are pointing on an IPFS CID.
 */

contract TablelandVerifiers is Ownable {

    ITablelandTables private tablelandContract;
    string main;
    string attribute;
    string contribution;
    uint256 mainID;
    uint256 attributeID;
    uint256 contributionID;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    string private baseURIString;
        
    string private constant COMPANY_TABLE_PREFIX = "verifier_company";
    string private constant COMPANY_SCHEMA = "company text, verifier text, isAdmin text"; 

    constructor() {
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(COMPANY_SCHEMA, COMPANY_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);
   
        tables.push(SQLHelpers.toNameFromId(COMPANY_TABLE_PREFIX, tableIDs[0]));
    }


    function insertCompany(
        string memory company,
        address[] memory verifiers,
        address admin
    ) public onlyOwner {
        mutate(
                tableIDs[0],
                SQLHelpers.toInsert(
                    COMPANY_TABLE_PREFIX,
                    tableIDs[0],
                    "company, verifier, isAdmin",
                    string.concat(
                        SQLHelpers.quote(company),
                        ",",
                        SQLHelpers.quote(Strings.toHexString(admin)),
                        ",",
                        SQLHelpers.quote("true")
                    )
                )
            );

        for(uint i = 0; i < verifiers.length; i++){
            mutate(
                tableIDs[0],
                SQLHelpers.toInsert(
                    COMPANY_TABLE_PREFIX,
                    tableIDs[0],
                    "company, verifier, isAdmin",
                    string.concat(
                        SQLHelpers.quote(company),
                        ",",
                        SQLHelpers.quote(Strings.toHexString(verifiers[i])),
                        ",",
                        SQLHelpers.quote("false")
                    )
                )
            );
        }
    }

    /*
     * @dev Internal function to execute a mutation on a table.
     * @param {uint256} tableId - Table ID.
     * @param {string} statement - Mutation statement.
     */
    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }
}