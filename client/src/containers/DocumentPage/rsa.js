import NodeRSA from 'node-rsa'

const encryptRSA = (publicKey, text) => {
  const _publicKey = new NodeRSA(publicKey, 'public')
  return _publicKey.encrypt(text, 'base64')
}

const decryptRSA = (privateKey, cipher) => {
  try {
    const _privateKey = new NodeRSA(privateKey, 'private')
    return _privateKey.decrypt(cipher, 'utf8')
  } catch (err) {
    return 'Invalid key.'
  }
}

export { encryptRSA, decryptRSA }