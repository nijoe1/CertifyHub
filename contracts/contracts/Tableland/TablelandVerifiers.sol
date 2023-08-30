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

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    string private baseURIString;

    string private constant COMPANY_TABLE_PREFIX = "company";
    string private constant COMPANY_SCHEMA = "company text, image text, description text, admin text";
        
    string private constant EVENT_TABLE_PREFIX = "event";
    string private constant EVENT_SCHEMA = "company text, eventID text, cid text, startsAt text, endsAt text"; 

    string private constant EVENT_VERIFIERS_TABLE_PREFIX = "event_verifiers";
    string private constant EVENT_VERIFIERS_SCHEMA = "eventID text, verifierAddress text"; 

    constructor() {
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(COMPANY_SCHEMA, COMPANY_TABLE_PREFIX)
        );

        createStatements.push(
            SQLHelpers.toCreateFromSchema(EVENT_SCHEMA, EVENT_TABLE_PREFIX)
        );

        createStatements.push(
            SQLHelpers.toCreateFromSchema(EVENT_VERIFIERS_SCHEMA, EVENT_VERIFIERS_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);
   
        tables.push(SQLHelpers.toNameFromId(COMPANY_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(EVENT_TABLE_PREFIX, tableIDs[1]));
        tables.push(SQLHelpers.toNameFromId(EVENT_VERIFIERS_TABLE_PREFIX, tableIDs[2]));
    }


    function insertCompany(
        string memory company,
        string memory image,
        string memory description,
        address admin
    ) public onlyOwner {
        mutate(
                tableIDs[0],
                SQLHelpers.toInsert(
                    COMPANY_TABLE_PREFIX,
                    tableIDs[0],
                    "company, image, description, admin",
                    string.concat(
                        SQLHelpers.quote(company),
                        ",",
                        SQLHelpers.quote(image),
                        ",",
                        SQLHelpers.quote(description),
                        ",",                        
                        SQLHelpers.quote(Strings.toHexString(admin))
                    )
                )
            );
    }

    function insertEvent(
        string memory company,
        string memory cid,
        bytes32 eventId,
        uint256 endTime,
        address[] memory eventVerifiers
    ) public onlyOwner {
        string memory eventID = bytes32ToString(eventId);

        mutate(
                tableIDs[1],
                SQLHelpers.toInsert(
                    EVENT_TABLE_PREFIX,
                    tableIDs[1],
                    "company, eventID, cid, startsAt, endsAt",
                    string.concat(
                        SQLHelpers.quote(company),
                        ",",
                        SQLHelpers.quote(eventID),
                        ",",                     
                        SQLHelpers.quote(cid),
                        ",",                        
                        SQLHelpers.quote(Strings.toString(block.timestamp)),
                        ",",                        
                        SQLHelpers.quote(Strings.toString(endTime))
                    )
                )
        );
        for(uint256 i = 0; i < eventVerifiers.length; i++ ){
            mutate(
                    tableIDs[2],
                    SQLHelpers.toInsert(
                        EVENT_VERIFIERS_TABLE_PREFIX,
                        tableIDs[2],
                        "eventID, verifierAddress",
                        string.concat(
                            SQLHelpers.quote(eventID),
                            ",",
                            SQLHelpers.quote(Strings.toHexString(eventVerifiers[i]))
                        )
                    )
            );
        }
    }

    function bytes32ToString(bytes32 data) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(data.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < data.length; i++) {
            converted[i * 2] = _base[uint8(data[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(data[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
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