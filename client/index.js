import Events from 'events'
import TerminalController from "./src/terminalCtrl.js";


const componentEmitter = new Events()

const ctrl = new TerminalController()
ctrl.initializeTable(componentEmitter)
