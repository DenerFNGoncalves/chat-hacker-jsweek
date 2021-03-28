import CliConfig from './src/cliConfig.js'
import Events from 'events'
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalCtrl.js";
import EventManager from './src/evtManager.js';

const [_, __, ...commands] = process.argv
const config = CliConfig.parseArguments(commands)
 
const componentEmitter = new Events()
const socket = new SocketClient(config)
await socket.initialize()

const manager = new EventManager({componentEmitter, socket})
socket.attachEvents(manager.getEvents())

const data = {
  roomId: config.room,
  userName: config.username
}

manager.joinRoomAndWaitMessage(data)

const ctrl = new TerminalController()
ctrl.initializeTable(componentEmitter)
