pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Document {
  uint256 public totalDocument = 0;
  mapping (uint256 => DocumentData) public documents;
  mapping (address => DocumentData[]) public documentList;

  struct DocumentData {
    uint256 id;
    string data;
  }

  function createDocument(string memory _data,
    address _owner1, address _owner2) public {
    
    totalDocument++;
    documents[totalDocument] = DocumentData(totalDocument, _data);

    documentList[_owner1].push(documents[totalDocument]);
    documentList[_owner2].push(documents[totalDocument]);
  }

  function retrieveDocumentList(address _address) public returns (DocumentData[] memory) {
    return documentList[_address];
  }

  constructor() public {
    createDocument('myFirstDocument', 0x1898C85C2Ad7F3Ba1073a6Ca5a3323Ea6cDEFFf6, 0x9f448C0d30089C7a87D55e0A10BFFbD1B4deF927);
  }
}