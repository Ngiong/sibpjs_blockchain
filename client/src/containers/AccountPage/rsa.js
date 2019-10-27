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

const checkRSAKeyPair = (_private, _public) => {
  try {
    const testMessage = 'Hello, World! #!@#$%^&*('
    const privateKey = new NodeRSA(_private, 'private')
    const publicKey = new NodeRSA(_public, 'public')

    const cipher = publicKey.encrypt(testMessage, 'base64')
    const returned = privateKey.decrypt(cipher, 'utf8')

    return returned === testMessage

  } catch (err) {
    return false;
  }
}

export { generateRSAKeyPair, checkRSAKeyPair }