import SocketServer from "./socket.js"
import Event  from 'events' 
import { constants } from "./constants.js"
import Controller from "./controller.js"

const evtEmitter = new Event()

// async function testServer() {
//   const opts = {
//     port: 9898,
//     host: 'localhost',
//     headers: {
//       Connection: 'upgrade',
//       Upgrade: 'websocket'
//     }
//   }

//   const http = await import('http')
//   const req = http.request(opts)
//   req.end()


//   req.on('upgrade', (res, socket) => {
//     socket.on('data', data => {
//       console.log('client received', data.toString())
//     })

//     setInterval(() => {
//       socket.write('Alive!')
//     }, 500);
//   })
// }


const port = process.eventNames.PORT || 9898
const socketServer = new SocketServer({ port })

const server = await socketServer.initialize(evtEmitter)

console.log('Socket server is running at', server.address().port)

const controller = new Controller(server)
evtEmitter.on(constants.event.USER_CONNECTED, controller.onNewConnection.bind(controller))
// evtEmitter.on(constants.event.USER_CONNECTED, (socket) => {
//   socket.on('data', data => {
//     console.log('server received', data.toString())
//     socket.write('Welcome!')
//   })
// })

// await testServer()