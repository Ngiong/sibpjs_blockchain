import NodeRSA from 'node-rsa'

const RSA_BIT_LENGTH = 512

const generateRSAKeyPair = () => {
  const key = new NodeRSA()
  key.generateKeyPair(RSA_BIT_LENGTH)

  return {
    publicKey: key.exportKey('public'),
    privateKey: key.exportKey('private')
  }
}

export { generateRSAKeyPair }