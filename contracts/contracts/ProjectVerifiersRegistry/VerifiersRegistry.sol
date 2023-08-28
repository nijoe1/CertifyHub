// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {ITablelandVerifiers} from "../interfaces/ITablelandVerifiers.sol";

contract VerifiersRegistry is ERC1155, AccessControl {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  bytes32 constant private REGISTRAR_ROLE = keccak256(abi.encode("REGISTRAR_ROLE"));

  ITablelandVerifiers indexerContract;

  EnumerableSet.Bytes32Set RegisteredVerifierRoles;

  // Constructor
  constructor(ITablelandVerifiers _indexerContract) ERC1155("") {
    _grantRole(REGISTRAR_ROLE, msg.sender);
    indexerContract = _indexerContract;
  }

  function registerCompany(string memory company,string memory image,string memory description, address admin) external onlyRole(REGISTRAR_ROLE){
      bytes32 ADMIN_ROLE = keccak256(abi.encode(company,"ADMIN"));  
      _grantRole(ADMIN_ROLE, admin);
      indexerContract.insertCompany(company, image, description, admin);
  }

  function registerEvent(string memory company, string memory eventType, string memory eventName, string memory cid, address[] memory eventVerifiers, uint256 duration) external onlyRole(getCompanyAdminRole(company)){
    
    bytes32 VERIFIER_ROLE = keccak256(abi.encode(company,eventType,eventName));

    require(!RegisteredVerifierRoles.contains(VERIFIER_ROLE), "ALREADY REGISTERED");

    for(uint i = 0; i < eventVerifiers.length; i++){
      _mint(eventVerifiers[i], uint256(VERIFIER_ROLE), 1, "");
    }
    
    indexerContract.insertEvent(company, cid , VERIFIER_ROLE, duration + block.timestamp, eventVerifiers);
  }

  // function addVerifiers(string memory company,address[] memory verifiers) external onlyRole(getCompanyAdmin(company)){
  //   bytes32 VERIFIER_ROLE = keccak256(abi.encode(company));
  //   for(uint i = 0; i < verifiers.length; i++){
  //     _mint(verifiers[i], uint256(VERIFIER_ROLE), 1, "");
  //   }
  //   indexerContract.insertCompany(company, verifiers, msg.sender);
  // }

  // function removeVerifiers(string memory company,address[] memory verifiers) external onlyRole(getCompanyAdmin(company)){
  //   bytes32 VERIFIER_ROLE = keccak256(abi.encode(company));
  //   for(uint i = 0; i < verifiers.length; i++){
  //     _mint(verifiers[i], uint256(VERIFIER_ROLE), 1, "");
  //   }
  //   indexerContract.insertCompany(company, verifiers, msg.sender);
  // }

  function addAdmins(string memory company,address[] memory admins) external onlyRole(getCompanyAdminRole(company)){
    for(uint i = 0; i < admins.length; i++){
      bytes32 ADMIN_ROLE = keccak256(abi.encode(company,admins[i]));
      _grantRole(ADMIN_ROLE, admins[i]);
    }
  }

  
  function _beforeTokenTransfer(
      address  /* operator */,
      address from,
      address to,
      uint256[] memory /* ids */,
      uint256[] memory /* amounts */,
      bytes memory /* data */
  ) pure override internal {
    require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred.");
  }
  
  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
      bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC1155) returns (bool) {
      return
          interfaceId == type(AccessControl).interfaceId;
  }

  function getCompanyAdminRole(string memory company)internal pure returns(bytes32){
    return keccak256(abi.encode(company,"ADMIN"));
  }

}
