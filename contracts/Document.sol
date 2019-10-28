pragma solidity ^0.5.0;

contract Document {
  uint256 public totalDocument;
  uint256 public totalAuthorizedDocument;
  // mapping (uint256 => string) public document; //document id to document data
  // mapping (uint256 => address) public documentOwner; //document id to user (owner) address
  mapping (address => uint256[]) public ownedDocumentList; //address to list of document ids
  mapping (address => uint256[]) public authorizedDocumentList; //address to list of authorized documents
  
  mapping(uint256 => DocumentData) public ownedDocumentData;
  mapping(uint256 => AuthorizedDocumentData) public authorizedDocumentData;
  // mapping(string => uint256[]) public documentIdsOfType;

  struct DocumentData {
    uint256 id;
    string documentType;
    string data;
    string signature;
  }

  // TODO: if unused, delete this
  struct AuthorizedDocumentData {
    uint256 id;
    address owner;
    string data;
  }

  // function createDocument(address _owner, string memory _data) public {
  //   totalDocument++;
  //   document[totalDocument] = _data;
  //   documentOwner[totalDocument] = _owner;
  //   ownedDocumentList[_owner].push(totalDocument);
  // }

  // function authorizeDocument(address _requester, address _granter, string memory _data) public {
  //   totalDocument++;
  //   document[totalDocument] = _data;
  //   documentOwner[totalDocument] = _granter;
  //   authorizedDocumentList[_requester].push(totalDocument);
  // }

  // function getOwnedDocumentList(address _account) public view returns (uint256[] memory) {
  //   return ownedDocumentList[_account];
  // }

  // function getAuthorizedDocumentList(address _account) public view returns (uint256[] memory) {
  //   return authorizedDocumentList[_account];
  // }

  // function createDocumentNew(address _owner, string memory _type, string memory _data) public {
  //   createDocument(_owner, _data);

  //   //assume totalDocument is incremented in createDocument() method
  //   uint newId = totalDocument;
  //   DocumentData memory newDocument = DocumentData(totalDocument, _type, _data, "signature");
  //   ownedDocumentData[newId] = newDocument;

  //   //insert mapping of document type to ids
  //   // documentIdsOfType[_type].push(newId);
  // }

  // // function getDocumentByType(string memory _type) public view returns (uint256[] memory) {
  // //   return documentIdsOfType[_type];
  // // }

  // function updateDocument(uint256 _id, string memory _data) public{
  //   require(msg.sender == documentOwner[_id], "unauthorized");
  //   document[_id] = _data;
  // }

  // function showSender() public view returns (address) {
  //   return (msg.sender);
  // }
}