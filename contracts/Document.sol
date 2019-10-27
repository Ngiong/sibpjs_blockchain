pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Document {
  uint256 public totalDocument;
  mapping (uint256 => string) public document; //document id to document data
  mapping (uint256 => address) public documentOwner; //document id to user (owner) address
  mapping (address => uint256[]) public ownedDocumentList; //address to list of document ids
  mapping (address => uint256[]) public authorizedDocumentList; //address to list of authorized documents
  
  mapping(address => DocumentData[]) public ownedDocumentOfAddress;
  mapping(address => DocumentData[]) public authorizedDocumentOfAddress;

  struct DocumentData {
    uint256 id;
    string documentType;
    string data;
    string signature;
  }

  // TODO: if unused, delete this
  struct OwnedDocumentData {
    uint256 id;
    string data; // TODO: nambah digital signature
  }

  // TODO: if unused, delete this
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

  function createDocumentNew(address _owner, string memory _type, string memory _data) public {
    createDocument(_owner, _data);

    //assume totalDocument is incremented in createDocument() method
    DocumentData[] storage currentDocuments = ownedDocumentOfAddress[_owner];
    DocumentData memory newDocument = DocumentData(totalDocument, _type, _data, "signature");
    currentDocuments.push(newDocument);
  }

  function getOwnedDocumentOf(address _owner) public view returns (DocumentData[] memory) {
    return ownedDocumentOfAddress[_owner];
  }

  function getAuthorizedDocumentOf(address _owner) public view returns (DocumentData[] memory) {
    return authorizedDocumentOfAddress[_owner];
  }
}