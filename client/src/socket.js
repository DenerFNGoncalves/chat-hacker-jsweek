import { constants } from "./constants.js"
import Event from 'events'

export default class SocketClient {
  #serverConnection
  #serverListener = new Event()
  constructor ({ host, port, protocol }) {
    this.host = host
    this.port = port
    this.protocol = protocol
  }
    

  attachEvents(events) {
    this.#serverConnection.on(constants.socket.DATA, data => {
      try {
        data.toString()
        .split('\n')
        .filter(line => !!line)
        .map(JSON.parse)
        .map(({ event, message}) => this.#serverListener.emit(event, message))
      } catch (error) {
        console.error('Invalid!', error)
      }
    })

    this.#serverConnection.on(constants.socket.ERROR, err => {
      console.log('Oh no, no, no!', err.toString())
    })

    this.#serverConnection.on(constants.socket.END, () => {
      console.log('Disconnected')
    })
    
   
    for( const [key, value] of events) {
      this.#serverListener.on(key, value)
    }
  }

  sendMessage(event, message) {
    this.#serverConnection.write(JSON.stringify({ event, message }))
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