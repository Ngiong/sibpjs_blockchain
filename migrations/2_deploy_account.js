var Account = artifacts.require('./Account.sol')

module.exports = deployer => {
  deployer.deploy(Account)
}