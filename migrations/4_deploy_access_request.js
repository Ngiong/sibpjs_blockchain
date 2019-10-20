var AccessRequest = artifacts.require('./AccessRequest.sol')

module.exports = deployer => {
  deployer.deploy(AccessRequest)
}