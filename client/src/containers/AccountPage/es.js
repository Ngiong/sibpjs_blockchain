import request from 'superagent'

const storeToES = (address, name, bpjs, type) => {
  const url = 'http://localhost:9200/sibpjs/account/' + address
  const body = { name, bpjs, type }
  
  return request
    .put(url)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(body))
}

export { storeToES }