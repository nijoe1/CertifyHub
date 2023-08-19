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

contract TablelandStorage is Ownable {

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
        
    string private constant HYPERCERT_CATEGORIES_TABLE_PREFIX = "hypercert_categories";
    string private constant HYPERCERT_CATEGORIES_SCHEMA = "claimID text, category text";

    string private constant HYPERCERT_FUNDINGS_TABLE_PREFIX = "hypercert_fundings";
    string private constant HYPERCERT_FUNDINGS_SCHEMA = "claimID text, funder text, fundAmount text";

    string private constant ATTESTATIONS_TABLE_PREFIX = "hypercert_attestations";
    string private constant ATTESTATIONS_SCHEMA = "claimID text, verifier text, company text, feedbackRange text, comment text";
    

    constructor() {
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(HYPERCERT_CATEGORIES_SCHEMA, HYPERCERT_CATEGORIES_TABLE_PREFIX)
        );
        createStatements.push(
            SQLHelpers.toCreateFromSchema(HYPERCERT_FUNDINGS_SCHEMA, HYPERCERT_FUNDINGS_TABLE_PREFIX)
        );
        createStatements.push(
            SQLHelpers.toCreateFromSchema(ATTESTATIONS_SCHEMA, ATTESTATIONS_TABLE_PREFIX)
        );


        tableIDs = tablelandContract.create(address(this), createStatements);

   
        tables.push(SQLHelpers.toNameFromId(HYPERCERT_CATEGORIES_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(HYPERCERT_FUNDINGS_TABLE_PREFIX, tableIDs[1]));
        tables.push(SQLHelpers.toNameFromId(ATTESTATIONS_TABLE_PREFIX, tableIDs[2]));
    }

    // /*
    //  * @dev Internal function to perform an update on the main table.
    //  * @param {stringp[]} set: Array of SET statements for the update.
    //  * @param {string} filter:Filter condition for the update.
    //  */
    // function toUpdate(string[] memory set, string memory filter) public onlyOwner {
    //     mutate(mainID, SQLHelpers.toUpdate(HYPERCERT_TABLE_PREFIX, mainID, set[0], filter));
    //     mutate(mainID, SQLHelpers.toUpdate(HYPERCERT_TABLE_PREFIX, mainID, set[1], filter));
    // }

    function insertHypercertInfo(
        uint256 claimID,
        string[] memory categories
    ) public onlyOwner {

        for(uint i = 0; i < categories.length; i++){
            mutate(
                tableIDs[0],
                SQLHelpers.toInsert(
                    HYPERCERT_CATEGORIES_TABLE_PREFIX,
                    tableIDs[0],
                    "claimID, category",
                    string.concat(
                        SQLHelpers.quote(Strings.toString(claimID)),
                        ",",
                        SQLHelpers.quote(categories[i])
                    )
                )
            );
        }
    }

    function insertAttestation(
        uint256 claimID,
        address verifier,
        string memory company,
        uint8 feedbackRange,
        string memory comment
    ) public onlyOwner {
        mutate(
            tableIDs[2],
            SQLHelpers.toInsert(
                ATTESTATIONS_TABLE_PREFIX,
                tableIDs[2],
                "claimID, verifier, company, feedbackRange, comment",
                string.concat(
                    SQLHelpers.quote((Strings.toString(claimID))),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(verifier)),
                    ",",
                    SQLHelpers.quote(company),
                    ",",
                    SQLHelpers.quote((Strings.toString(feedbackRange))),
                    ",",
                    SQLHelpers.quote(comment)
                )
            )
        );
    }

    function insertFunding(
        uint256 claimID,
        string memory company,
        uint256 fundAmount
    ) public onlyOwner {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                HYPERCERT_FUNDINGS_TABLE_PREFIX,
                tableIDs[1],
                "claimID, funder, fundAmount",
                string.concat(
                    SQLHelpers.quote((Strings.toString(claimID))),
                    ",",
                    SQLHelpers.quote(company),
                    ",",
                    SQLHelpers.quote((Strings.toString(fundAmount)))
                )
            )
        );
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