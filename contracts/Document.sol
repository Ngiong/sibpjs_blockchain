pragma solidity ^0.5.0;

contract Document {
  uint256 public totalDocument;
  mapping (uint256 => string) public document;
  mapping (uint256 => address) public documentOwner;
  mapping (address => uint256[]) public ownedDocumentList;
  mapping (address => uint256[]) public authorizedDocumentList;

  struct OwnedDocumentData {
    uint256 id;
    string data; // TODO: nambah digital signature
  }

  struct AuthorizedDocumentData {
    uint256 id;
    address owner;
    string data;
  }

  function createDocument(address _owner, string memory _data) public {
    totalDocument++;
    document[totalDocument] = _data;
    documentOwner[totalDocument] = _owner;
    ownedDocumentList[_owner].push(totalDocument);
  }

  function authorizeDocument(address _requester, address _granter, string memory _data) public {
    totalDocument++;
    document[totalDocument] = _data;
    documentOwner[totalDocument] = _granter;
    authorizedDocumentList[_requester].push(totalDocument);
  }

  function getOwnedDocumentList(address _account) public view returns (uint256[] memory) {
    return ownedDocumentList[_account];
  }

  function getAuthorizedDocumentList(address _account) public view returns (uint256[] memory) {
    return authorizedDocumentList[_account];
  }
}