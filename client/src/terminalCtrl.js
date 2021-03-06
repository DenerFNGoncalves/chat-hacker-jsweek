import ComponentsBuilder from "./components.js";
import { constants as c } from './constants.js'

export default class TerminalController {
  #userCollors = new Map()
  constructor() {}

  #pickCollor()  {
    return `#${((1<<24) * Math.random() | 0).toString(16)}-fg`
  }

  #getUserCollor(userName) {
    if (this.#userCollors.has(userName))
      return this.#userCollors.get(userName)

    const collor = this.#pickCollor()
    this.#userCollors.set(userName, collor)

    return collor
  }

  #onInputReceived(evtEmitter) {
    return function() {
      const msg = this.getValue() 
      evtEmitter.emit(c.events.app.MSG_SENT, msg)
      this.clearValue()
    }
  }

  #onMsgReceived({ screen, chat }){
    return   (msg) => {
      const { userName, message } = msg
      const collor = this.#getUserCollor(userName)
      chat.addItem(`{${collor}}{bold}${userName}{/}{/}: ${message}`)
      screen.render()
    }
  }


  #onLogChanged({ screen, actyLog }){
    return   (msg) => {
     const [userName] = msg.split(/\s/)
     const collor = this.#getUserCollor(userName)
     actyLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)
     screen.render()
    }
  }

  #onStatusChanged({ screen, status }){
    return   (users) => {
      const { content } = status.items.shift()
      status.clearItems()
      status.addItem(content)
      
      users.forEach(userName => {
        const collor = this.#getUserCollor(userName)
        status.addItem(`{${collor}}{bold}${userName}{/}`)
      })

      screen.render()
    }
  }


  #registerEvents (evtEmitter, components) {
    evtEmitter.on(c.events.app.MSG_RECEIVED, this.#onMsgReceived(components))
    evtEmitter.on(c.events.app.ACTYLOG_UPDATED, this.#onLogChanged(components))
    evtEmitter.on(c.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
  }


  async initializeTable (evtEmitter)  {
   const components = new ComponentsBuilder()
    .setScreen({ title: 'Chatting with friends '})
    .setLayoutComponent()
    .setInputComponent(this.#onInputReceived(evtEmitter))
    .setChatComponent()
    .setActivityLog()
    .setStatusComponent()
    .build()

    this.#registerEvents(evtEmitter, components)
    components.input.focus()
    components.screen.render()
    
  }
}