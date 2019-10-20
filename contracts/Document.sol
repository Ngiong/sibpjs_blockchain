pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Document {
  uint256 public totalDocument = 0;
  uint256 public totalAuthorizedDocument = 0;
  mapping (address => OwnedDocumentData[]) public ownedDocumentList;
  mapping (address => AuthorizedDocumentData[]) public authorizedDocumentList;

  struct OwnedDocumentData {
    uint256 id;
    string data;
  }

  struct AuthorizedDocumentData {
    uint256 id;
    address owner;
    string data;
  }

  function createDocument(address _owner, string memory _data) public {
    totalDocument++;
    OwnedDocumentData memory _tmp = OwnedDocumentData(totalDocument, _data);
    ownedDocumentList[_owner].push(_tmp);
  }

  function authorizeDocument(address _recipient, address _granter, string memory _data) public {
    totalAuthorizedDocument++;
    AuthorizedDocumentData memory _tmp = AuthorizedDocumentData(totalAuthorizedDocument, _granter, _data);
    authorizedDocumentList[_recipient].push(_tmp);
  }

  function getOwnedDocumentList(address _account) public view returns (OwnedDocumentData[] memory) {
    return ownedDocumentList[_account];
  }

  function getAuthorizedDocumentList(address _account) public view returns (AuthorizedDocumentData[] memory) {
    return authorizedDocumentList[_account];
  }
}