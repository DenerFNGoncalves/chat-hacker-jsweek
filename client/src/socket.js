export default class SocketClient {
  #serverConnection
  constructor ({ host, port, protocol }) {
    this.host = host
    this.port = port
    this.protocol = protocol
  }
    
  async createConnection() {
    const opts = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: 'upgrade',
        Upgrade: 'websocket'
      }
    }

    console.log(this.protocol)
    const http = await import(this.protocol)
    const req = http.request(opts)
    req.end()

    return new Promise(resolve => {
      req.once('upgrade', (_, socket) => resolve(socket))  
    })
  }

  async initialize()  {
    this.#serverConnection = await this.createConnection()
    console.log('I connected to the server')
  }
}