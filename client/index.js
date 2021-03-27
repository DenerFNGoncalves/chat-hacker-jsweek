/**
 node index.js \
  --username dener \
  --room sala01 \
  --hostUrl localhost
 */

import CliConfig from './src/cliConfig.js'
import Events from 'events'
import SocketClient from './src/socket.js';

const [_, __, ...commands] = process.argv
const config = CliConfig.parseArguments(commands)
 
const socket = new SocketClient(config)
await socket.initialize()

// import TerminalController from "./src/terminalCtrl.js";
// const componentEmitter = new Events()
// const ctrl = new TerminalController()
// ctrl.initializeTable(componentEmitter)
