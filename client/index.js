import CliConfig from './src/cliConfig.js'
import Events from 'events'
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalCtrl.js";
import EventManager from './src/evtManager.js';

const [_, __, ...commands] = process.argv
const config = CliConfig.parseArguments(commands)
 
const socket = new SocketClient(config)
await socket.initialize()

const componentEmitter = new Events()
const ctrl = new TerminalController()

const manager = new EventManager({componentEmitter, socket})
socket.attachEvents(manager.getEvents())


ctrl.initializeTable(componentEmitter)
