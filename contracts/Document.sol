pragma solidity ^0.5.0;
import './AccessRequest.sol';

contract Document {
  uint256 public totalDocument;
  uint256 public totalAuthorizedDocument;
  mapping (address => uint256[]) public ownedDocumentList;
  mapping (address => uint256[]) public authorizedDocumentList;
  
  mapping(uint256 => DocumentData) public ownedDocumentData;
  mapping(uint256 => AuthorizedDocumentData) public authorizedDocumentData;

  // -- deprecated
  // mapping (uint256 => string) public document; //document id to document data
  // mapping (uint256 => address) public documentOwner; //document id to user (owner) address
  // mapping(string => uint256[]) public documentIdsOfType;

  struct DocumentData {
    uint256 id;
    address issuer;
    string documentType;
    string data;
    string signature;
  }

  struct AuthorizedDocumentData {
    uint256 id;
    address documentOwner;
    string documentDataList;
  }

  function createDocument(
    address _owner,
    address _issuer,
    string memory _type,
    string memory _data,
    string memory _signature) public {

    totalDocument++;
    ownedDocumentData[totalDocument] = DocumentData(totalDocument, _issuer, _type, _data,  _signature);
    ownedDocumentList[_owner].push(totalDocument);
  }

  function authorizeDocument(
    uint256 _accessRequestId,
    address _requester,
    address _owner,
    string memory _documentDataList) public {

    AccessRequest ar = new AccessRequest();
    bytes memory _documentBytes = bytes(_documentDataList);
    if (_documentBytes.length > 0) {
        totalAuthorizedDocument++;
        authorizedDocumentData[totalAuthorizedDocument] = AuthorizedDocumentData(totalAuthorizedDocument, _owner, _documentDataList);
        authorizedDocumentList[_requester].push(totalAuthorizedDocument);
        ar.completeAccessRequest(_accessRequestId, "COMPLETED", totalAuthorizedDocument);

    } else {
        ar.completeAccessRequest(_accessRequestId, "DECLINED", 0);
    }
  }

  function getOwnedDocumentList(address _account) public view returns (uint256[] memory) {
    return ownedDocumentList[_account];
  }

  function getAuthorizedDocumentList(address _account) public view returns (uint256[] memory) {
    return authorizedDocumentList[_account];
  }

  // // function createDocumentNew(address _owner, string memory _type, string memory _data) public {
  // //   createDocument(_owner, _data);

  // //   //assume totalDocument is incremented in createDocument() method
  // //   uint newId = totalDocument;
  // //   DocumentData memory newDocument = DocumentData(totalDocument, _type, _data, "signature");
  // //   ownedDocumentData[newId] = newDocument;

  // //   //insert mapping of document type to ids
  // //   // documentIdsOfType[_type].push(newId);
  // // }

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