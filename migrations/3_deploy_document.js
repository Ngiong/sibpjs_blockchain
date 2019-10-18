var Document = artifacts.require('./Document.sol')

module.exports = deployer => {
  deployer.deploy(Document)
}