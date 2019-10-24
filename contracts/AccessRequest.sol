pragma solidity ^0.5.0;

contract AccessRequest {
  uint256 public totalRequest = 0;
  mapping (uint256 => AccessRequestData) public accessRequest;
  mapping (address => uint256[]) public accessRequestList;

  struct AccessRequestData {
    uint256 id;
    address requester;
    address granter;
    bool completed; 
  }

  function createAccessRequest(address _requester, address _granter) public {
    totalRequest++;
    AccessRequestData memory _tmp = AccessRequestData(totalRequest, _requester, _granter, false);
    accessRequest[totalRequest] = _tmp;
    accessRequestList[_granter].push(totalRequest);
  }

  function completeAccessRequest(uint256 _id) public {
    AccessRequestData memory _tmp = accessRequest[_id];
    _tmp.completed = true;
    accessRequest[_id] = _tmp;

    uint256[] memory _acList = accessRequestList[_tmp.granter];
    for (uint i = 0; i < _acList.length; i++) if (_acList[i] == _id) _acList[i] = -_id;
    accessRequestList[_tmp.granter] = _acList;
  }

  function getAccessRequestList(address _account) public view returns (uint256[] memory) {
    return accessRequestList[_account];
  }
}