// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { SchemaResolver } from "./EAS/SchemaResolver.sol";
import { IHypercert } from "./interfaces/IHypercert.sol";
import { IEAS, Attestation } from "./interfaces/IEAS.sol";
import { ITableland } from "./interfaces/ITableland.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CertifyHub
 * @notice A schema resolver that facilitates attestation resolution and incentives distribution.
 */
contract CertifyHub is SchemaResolver {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    // Contracts and addresses
    IHypercert public hypercertContract;
    IERC1155 public tokenGatedProjectVerifiers;
    ITableland public indexerContract;
    address public thirdwebFactoryAddress;
    address public splitterAddress;

    // Bitmasks for extracting upper and lower 128 bits of uint256
    uint256 internal constant TYPE_MASK = type(uint256).max << 128;
    uint256 internal constant NF_INDEX_MASK = type(uint256).max >> 128;

    constructor(
        IERC1155 _tokenGatedProjectVerifiers,
        IHypercert _hypercertContract,
        ITableland _indexerContract,
        address _thirdwebFactoryAddress,
        address _splitterAddress,
        IEAS eas
    ) SchemaResolver(eas) {
        hypercertContract = _hypercertContract;
        thirdwebFactoryAddress = _thirdwebFactoryAddress;
        splitterAddress = _splitterAddress;
        tokenGatedProjectVerifiers = _tokenGatedProjectVerifiers;
        indexerContract = _indexerContract;
    }

    // Project struct to store project-related information
    struct Project {
        uint256 fundingPool;
        uint256 totalShares;
        EnumerableSet.AddressSet owners;
        EnumerableSet.UintSet fractions;
        mapping(address => uint256) ownersShares;
        address splitAddress;
    }

    mapping(uint256 => Project) private projectInfo;
    EnumerableSet.UintSet private Projects;

    /**
     * @notice Register a hypercert project with fractions and categories.
     * @param claimID The ID of the base project.
     * @param fractionClaimIDs The IDs of the fractions.
     * @param categories The categories associated with the project.
     */
    function registerHypercertProject(
        uint256 claimID,
        uint256[] memory fractionClaimIDs,
        string[] memory categories,
        string[] memory events
    ) external {
        require(!Projects.contains(claimID), "already registered");
        require(isBaseType(claimID), "not base type");

        uint256 baseType = getBaseType(claimID);
        uint256 totalShares = hypercertContract.unitsOf(claimID);
        uint256 projectTotalShares;

        Project storage project = projectInfo[claimID];

        for (uint256 i = 0; i < fractionClaimIDs.length; i++) {
            uint256 fractionClaimID = fractionClaimIDs[i];
            require(baseType == getBaseType(fractionClaimID), "fraction from different claimID");
            require(isTypedItem(fractionClaimID), "invalid fraction");

            uint256 fractionShares = hypercertContract.unitsOf(fractionClaimID);
            address fractionOwner = hypercertContract.ownerOf(fractionClaimID);

            project.owners.add(fractionOwner);
            project.fractions.add(fractionClaimID);
            project.ownersShares[fractionOwner] += fractionShares;
            projectTotalShares += fractionShares;
        }

        Projects.add(claimID);
        project.totalShares = totalShares;

        project.splitAddress = createSplitter(claimID);

        indexerContract.insertHypercertInfo(claimID, categories, events);

        indexerContract.insertSplitter(claimID, project.splitAddress);
    }

    /**
     * @notice Update a project with new fractions.
     * @param claimID The ID of the base project.
     * @param fractionClaimIDs The IDs of the new fractions.
     */
    function updateProject(uint256 claimID, uint256[] memory fractionClaimIDs) external {
        require(Projects.contains(claimID), "register first");

        uint256 baseType = getBaseType(claimID);
        uint256 projectTotalShares;

        Project storage project = projectInfo[claimID];

        for (uint256 i = 0; i < project.owners.length(); i++) {
            project.ownersShares[project.owners.at(i)] = 0;
        }

        for (uint256 i = 0; i < fractionClaimIDs.length; i++) {
            uint256 fractionClaimID = fractionClaimIDs[i];
            require(baseType == getBaseType(fractionClaimID), "fraction from different claimID");
            require(isTypedItem(fractionClaimID), "invalid fraction");

            uint256 fractionShares = hypercertContract.unitsOf(fractionClaimID);
            address fractionOwner = hypercertContract.ownerOf(fractionClaimID);

            project.owners.add(fractionOwner);
            project.fractions.add(fractionClaimID);
            project.ownersShares[fractionOwner] += fractionShares;
            projectTotalShares += fractionShares;
        }

        project.totalShares = projectTotalShares;

        project.splitAddress = createSplitter(claimID);

        indexerContract.insertSplitter(claimID, project.splitAddress);
    }

    // VIEW FUNCTIONS

    /**
     * @notice Get the list of registered projects.
     * @return projects  An array of project IDs.
     */
    function getProjects() external view returns (uint256[] memory projects) {
        projects = Projects.values();
    }

    // ... (internal helper functions)

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


    // ... (EAS functions)

    /**
     * @notice Handles attestation by validating the attester and bond value.
     * @param attestation The attestation data.
     * @return Boolean indicating the success of the attestation.
     */
    function onAttest(
        Attestation calldata attestation,
        uint256 
    ) internal override returns (bool) {
        (string memory cid, uint256 projectID, uint8 rangeFeedback, bytes32 eventID) =
            abi.decode(attestation.data, (string, uint256, uint8, bytes32));
        string memory ID = bytes32ToString(eventID);
        if (!Projects.contains(projectID)) return false;
        if (rangeFeedback >= 6) return false;
        if (tokenGatedProjectVerifiers.balanceOf(attestation.attester, uint256((eventID))) > 0 || eventID == bytes32(0)) {
            indexerContract.insertAttestation(projectID, attestation.attester, ID, rangeFeedback, cid);
            return true;
        }
        return false;
    }

    /**
     * @notice Checks if an attestation can be revoked based on resolution status and time.
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


    function insertProjectUpdate(uint256 projectID, string memory cid) external {
        require(projectInfo[projectID].owners.contains(msg.sender));
        indexerContract.insertCompletedTask(projectID, msg.sender, cid);
    }

    function fundProject(uint256 projectID, bytes32 fromEvent)external payable{
        indexerContract.insertFunding(projectID, bytes32ToString(fromEvent), msg.value, address(0),projectInfo[projectID].splitAddress);
        address payable to = payable(projectInfo[projectID].splitAddress);
        Address.sendValue(to, msg.value);
        Address.functionCall(to, abi.encodeWithSignature("distribute()"));
    }        

    function fundProjectERC20(uint256 projectID, bytes32 fromEvent, address fundingToken, uint256 fundingAmount) external payable{
        indexerContract.insertFunding(projectID, bytes32ToString(fromEvent), msg.value, fundingToken,projectInfo[projectID].splitAddress);
        address payable to = payable(projectInfo[projectID].splitAddress);
        IERC20(fundingToken).transferFrom(msg.sender, projectInfo[projectID].splitAddress, fundingAmount);
        Address.functionCall(to, abi.encodeWithSignature("distribute(address)",fundingToken));
    }


        /**
     * @notice Distributes minting funds among attesters using a splitter contract.
     * This function calculates the distribution of funds based on attestation counts and shares,
     * deploys a splitter contract, and sends the funds to it for distribution.
     * @param projectID The ID of the project to split funds for.
     */
    function createSplitter(uint256 projectID) internal returns(address) {
        Project storage project = projectInfo[projectID];
        require(Projects.contains(projectID), "non registered project");
        address[] memory owners = project.owners.values();
        uint256[] memory ownersShares = new uint256[](owners.length);
        address owner;
        uint256 ownerShares;
        uint256 shareholdersNum;

        for (uint256 i = 0; i < owners.length; i++) {
            owner = owners[i];
            ownerShares = project.ownersShares[owner];
            if (ownerShares > 0) {
                ownersShares[i] = ownerShares;
                shareholdersNum++;
            }
        }

        require(shareholdersNum > 0);

        uint256 totalShares = project.totalShares;
        uint256 modBy;
        if (totalShares <= 100) {
            modBy = 100;
        } else if (totalShares <= 1000) {
            modBy = 1000;
        } else if (totalShares <= 10000) {
            modBy = 10000;
        } else {
            modBy = 100000;
        }

        // Calculate the remaining shares needed to reach a multiple of modBy
        uint256 remainingShares = (modBy - (totalShares % modBy)) % modBy;

        uint256 currentIndex = 0;
        while (remainingShares > 0) {
            uint256 highestStep = remainingShares / shareholdersNum;
            if (highestStep == 0) {
                highestStep = 1;
            }
            if (ownersShares[currentIndex] > 0) {
                ownersShares[currentIndex] += highestStep;
                remainingShares -= highestStep;
            }
            currentIndex = (currentIndex + 1) % ownersShares.length;
        }

        address[] memory _trustedForwarders = new address[](0);

        // Deploy a splitter contract using thirdWeb factory and implementation with the calculated data
        bytes memory result = Address.functionCall(
            thirdwebFactoryAddress,
            abi.encodeWithSignature(
                "deployProxyByImplementation(address,bytes,bytes32)",
                splitterAddress,
                abi.encodePacked(hex"b1a14437", abi.encode(msg.sender, " ", _trustedForwarders, owners, ownersShares)),
                bytes32(block.number)
            )
        );
        return abi.decode(result, (address));
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

    function getCurrentTime() public view returns(uint256) {
        return block.timestamp;
    }

}