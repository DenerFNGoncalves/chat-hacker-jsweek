import SocketServer from "./socket.js"
import Event  from 'events' 
import { constants } from "./constants.js"
import Controller from "./controller.js"

const evtEmitter = new Event()
 
const port = process.eventNames.PORT || 9898
const socketServer = new SocketServer({ port })

const server = await socketServer.initialize(evtEmitter)
const controller = new Controller({socketServer})
evtEmitter.on(constants.event.USER_CONNECTED, controller.onNewConnection.bind(controller))


console.log('Socket server is running at', server.address().port)
