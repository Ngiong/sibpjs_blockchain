pragma solidity ^0.5.0;

contract AccessRequest {
  uint256 public totalRequest = 0;
  mapping (uint256 => AccessRequestData) public accessRequest;
  mapping (address => uint256[]) public accessRequestByGranterList;
  mapping (address => uint256[]) public accessRequestByRequesterList;

  struct AccessRequestData {
    uint256 id;
    address requester;
    address granter;
    string status;
    uint256 authorizedDocumentId;
  }

  function createAccessRequest(address _requester, address _granter) public {
    totalRequest++;
    AccessRequestData memory _tmp = AccessRequestData(totalRequest, _requester, _granter, "PENDING", 0);
    accessRequest[totalRequest] = _tmp;
    accessRequestByGranterList[_granter].push(totalRequest);
    accessRequestByRequesterList[_requester].push(totalRequest);
  }

  function completeAccessRequest(uint256 _id, string memory status, uint256 _authorizedDocumentId) public {
    AccessRequestData memory _tmp = accessRequest[_id];
    _tmp.status = status;
    _tmp.authorizedDocumentId = _authorizedDocumentId;
    accessRequest[_id] = _tmp;

    uint256[] memory _acList = accessRequestByGranterList[_tmp.granter];
    for (uint i = 0; i < _acList.length; i++) if (_acList[i] == _id) _acList[i] = 0;
    accessRequestByGranterList[_tmp.granter] = _acList;
  }

  function getAccessRequestByGranterList(address _account) public view returns (uint256[] memory) {
    return accessRequestByGranterList[_account];
  }

  function getAccessRequestByRequesterList(address _account, uint take) public view returns (uint256[] memory) {
    return accessRequestByRequesterList[_account];
  }
}