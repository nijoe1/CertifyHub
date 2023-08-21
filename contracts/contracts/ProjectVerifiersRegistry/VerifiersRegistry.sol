// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {ITablelandVerifiers} from "../interfaces/ITablelandVerifiers.sol";

contract VerifiersRegistry is ERC1155, AccessControl {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  bytes32 constant private REGISTRAR_ROLE = keccak256(abi.encode("VerifierCompany_Registrar"));

  ITablelandVerifiers indexerContract;

  EnumerableSet.Bytes32Set RegisteredVerifierRoles;

  // Constructor
  constructor(ITablelandVerifiers _indexerContract) ERC1155("") {
    _grantRole(REGISTRAR_ROLE, msg.sender);
    indexerContract = _indexerContract;
  }

  function registerVerifier(string memory company, address admin, address[] memory verifiers) external onlyRole(REGISTRAR_ROLE){
    
    bytes32 VERIFIER_ROLE = keccak256(abi.encode(company));
    
    bytes32 ADMIN_ROLE = keccak256(abi.encode(company,admin));
    require(!RegisteredVerifierRoles.contains(VERIFIER_ROLE), "ALREADY REGISTERED");

    _grantRole(ADMIN_ROLE, admin);
    _mint(admin, uint256(VERIFIER_ROLE), 1, "");
    for(uint i = 0; i < verifiers.length; i++){
      _mint(verifiers[i], uint256(VERIFIER_ROLE), 1, "");
    }
    
    indexerContract.insertCompany(company, verifiers, admin);
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

}
