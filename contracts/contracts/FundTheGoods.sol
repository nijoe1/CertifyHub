// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;


import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {SchemaResolver} from "./EAS/SchemaResolver.sol";
import {IHypercert} from "./interfaces/IHypercert.sol";
import {IEAS, Attestation} from "./interfaces/IEAS.sol";
import { ITableland } from "./interfaces/ITableland.sol";

/**
 * @title FundTheGoods
 * @notice A schema resolver that facilitates attestation resolution and incentives distribution.
 */
contract FundTheGoods is SchemaResolver{
    
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    IHypercert hypercertContract;
    IERC1155 tokenGatedProjectVerifiers;
    ITableland indexerContract;
    address thirdwebFactoryAddress;
    address splitterAddress;

    /// @dev Bitmask used to expose only upper 128 bits of uint256
    uint256 internal constant TYPE_MASK = type(uint256).max << 128;

    /// @dev Bitmask used to expose only lower 128 bits of uint256
    uint256 internal constant NF_INDEX_MASK = type(uint256).max >> 128;

    constructor(
        IERC1155 _tokenGatedProjectVerifiers,
        IHypercert _hypercertContract,
        ITableland _indexerContract, 
        address _thirdwebFactoryAddress, 
        address _splitterAddress,
        IEAS _eas
    ) SchemaResolver(_eas){
        hypercertContract = _hypercertContract;
        thirdwebFactoryAddress = _thirdwebFactoryAddress;
        splitterAddress = _splitterAddress;
        tokenGatedProjectVerifiers = _tokenGatedProjectVerifiers;
        indexerContract = _indexerContract;
    }

    struct Project{
        address creator;
        uint256 fundingPool;
        uint256 totalShares;
        EnumerableSet.AddressSet owners;
        EnumerableSet.UintSet fractions;
        mapping(address => uint256) ownersShares;
    }

    mapping(uint256 => Project) private projectInfo;

    EnumerableSet.UintSet private Projects;

    function registerHypercertProject(uint256 claimID, uint256[] memory fractionClaimIDs, string[] memory categories) external{
        require(msg.sender == hypercertContract.ownerOf(claimID));

        require(isBaseType(claimID),"not base type");

        uint256 baseType = getBaseType(claimID);

        uint256 totalShares = hypercertContract.unitsOf(claimID);

        uint size = fractionClaimIDs.length;

        Project storage project = projectInfo[claimID];

        for(uint i = 0; i < size; i++){
            uint256 fractionClaimID = fractionClaimIDs[i];
            require(baseType == getBaseType(fractionClaimID));
            require(isTypedItem(fractionClaimID));
            uint256 fractionShares = hypercertContract.unitsOf(fractionClaimID);
            address fractionOwner = hypercertContract.ownerOf(fractionClaimID);
            project.owners.add(fractionOwner);
            project.fractions.add(fractionClaimID);
            project.ownersShares[fractionOwner] += fractionShares;
        }

        project.creator = hypercertContract.ownerOf(claimID);
        Projects.add(claimID);
        project.totalShares = totalShares;
        indexerContract.insertHypercertInfo(claimID, categories);
    }

    function updateProject(uint256 claimID, uint256[] memory fractionClaimIDs) external{
        require(Projects.contains(claimID));
        uint size = fractionClaimIDs.length;

        Project storage project = projectInfo[claimID];

        for(uint i = 0; i < size; i++){
            uint256 fractionClaimID = fractionClaimIDs[i];
            if(project.fractions.contains(fractionClaimID)){
                continue;
            }
            require(isTypedItem(fractionClaimID));
            uint256 fractionShares = hypercertContract.unitsOf(fractionClaimID);
            address fractionOwner = hypercertContract.ownerOf(fractionClaimID);
            project.owners.add(fractionOwner);
            project.fractions.add(fractionClaimID);
            project.ownersShares[fractionOwner] += fractionShares;
        }

    }

    // VIEW FUNCTIONS

    function getProjects()external view returns(uint256[] memory projects){
        projects = Projects.values();
    }

    // INTERNAL HELPER FUNCTIONS

    /// @dev Get base type ID for token at `_id` by returning upper 128 bit values
    function getBaseType(uint256 tokenID) internal pure returns (uint256) {
        return tokenID & TYPE_MASK;
    }

    /// @dev Identify that token at `_id` is base type.
    /// @dev Upper 128 bits identify base type ID, lower bits should be 0
    function isBaseType(uint256 tokenID) internal pure returns (bool) {
        return (tokenID & TYPE_MASK == tokenID) && (tokenID & NF_INDEX_MASK == 0);
    }

    /// @dev Identify that token at `_id` is fraction of a claim.
    /// @dev Upper 128 bits identify base type ID, lower bits should be > 0
    function isTypedItem(uint256 tokenID) internal pure returns (bool) {
        return (tokenID & TYPE_MASK != 0) && (tokenID & NF_INDEX_MASK != 0);
    }


    // EAS Functions

    /**
    * @dev Handles attestation by validating the attester and bond value.
    * @param attestation The attestation data.
    * @return Boolean indicating the success of the attestation.
    */
    function onAttest(
        Attestation calldata attestation,
        uint256 value
    ) internal override returns (bool) {
        (string memory comment,uint256 projectID,uint8 rangeFeedback,string memory verifierFrom) = abi.decode(attestation.data, (string,uint256,uint8,string));
        if(!Projects.contains(projectID))return false;
        if(rangeFeedback > 6) return false;
        if(rangeFeedback == 0 && value > 0){
            // ADD FUNDING 
            indexerContract.insertFunding(projectID, verifierFrom, value);
            projectInfo[projectID].fundingPool += value;
            return true;
        }else if(tokenGatedProjectVerifiers.balanceOf(attestation.attester,uint256(keccak256(abi.encode(verifierFrom)))) > 0){
            indexerContract.insertAttestation(projectID, attestation.attester, verifierFrom, rangeFeedback, comment);
            return true;
        }
        return false;
    }

    /**
    * @dev Checks if an attestation can be revoked based on resolution status and time.
    * @return Boolean indicating whether the attestation can be revoked.
    */
    function onRevoke(
        Attestation calldata /* attestation */,
        uint256 /* value */
    ) internal override pure returns (bool) {
        return false;
    }

    /**
     * @notice Indicates whether the contract is designed to handle incoming payments.
     * @return True, indicating that the contract can accept payments.
     */
    function isPayable() public override pure returns (bool) {
        return true;
    }

    /** 
    * @dev Distributes minting funds among attesters using a splitter contract.
    * This function calculates the distribution of funds based on attestation counts and shares,
    * deploys a splitter contract, and sends the funds to it for distribution.
    */
    function splitFunds(uint256 projectID) external {
        Project storage project = projectInfo[projectID];

        require(Projects.contains(projectID), "non registered project");

        // Get the current distribution round and available funds to split
        uint256 fundsToSplit = project.fundingPool;

        // Get the list of valid attesters and calculate their shares across all rounds
        address[] memory owners = project.owners.values();
        uint256[] memory ownersShares = new uint256[](owners.length);
        address owner;
        uint256 ownerShares;
        for (uint256 i = 0; i < owners.length; i++) {
            owner = owners[i];
            ownerShares = project.ownersShares[owner];
            ownersShares[i] = ownerShares;
        }

                // Calculate the remaining shares needed to reach a multiple of 100
        uint256 remainingShares = (1000 - (project.totalShares % 1000)) % 1000;

        // Distribute one share to each address until no remaining shares are left
        uint256 currentIndex = 0;
        while (remainingShares > 0) {
            ownersShares[currentIndex]++;
            remainingShares--;
            currentIndex = (currentIndex + 1) % ownersShares.length;
        }

        address[] memory _trustedForwarders = new address[](0);

        // Deploy a splitter contract using thirdWeb factory and implementation with the calculated data
        bytes memory result = Address.functionCall(
            thirdwebFactoryAddress,
            abi.encodeWithSignature(
                "deployProxyByImplementation(address,bytes,bytes32)",
                splitterAddress,
                abi.encodePacked(
                    hex"b1a14437",
                    abi.encode(msg.sender, " ", _trustedForwarders, owners, ownersShares)
                ),
                bytes32(block.number)
            )
        );

        address splitterInstance = abi.decode(result, (address));

        // Send the funds to the splitter contract for distribution
        Address.sendValue(payable(splitterInstance), fundsToSplit);
        // Distribute funds to valid attestors
        Address.functionCall(splitterInstance, abi.encodeWithSignature("distribute()"));
    }

}