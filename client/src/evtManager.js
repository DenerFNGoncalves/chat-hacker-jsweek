import { constants } from "./constants.js"

export default class EventManager {
  #allUsers = new Map()

  constructor({ componentEmitter, socket }){
    this.componentEmitter= componentEmitter
    this.socket = socket        
  }
  
  joinRoomAndWaitMessage(data) {
    this.socket.sendMessage(constants.socket.JOIN_ROOM, data)
    this.componentEmitter.on(constants.events.app.MSG_SENT, msg => {
        this.socket.sendMessage(constants.socket.MSG, msg)
    })
  }

  updateUsers(users) {
    users.forEach(({ id, userName }) => this.#allUsers.set(id, userName))
    this.#emitComponentUpdate(constants.events.app.STATUS_UPDATED, Array.from(this.#allUsers.values()))
  }

  newUserConnected(user) {
    this.#allUsers.set(user.id, user.userName)
    this.#emitComponentUpdate( constants.events.app.STATUS_UPDATED, Array.from(this.#allUsers.values()))
    this.#emitComponentUpdate(constants.events.app.ACTYLOG_UPDATED, `${user.userName} joined!`)
  }
 
  #emitComponentUpdate(evt, message) {
    this.componentEmitter.emit(evt, message)
  }

  getEvents() {
      const evts = Reflect.ownKeys(EventManager.prototype)
          .filter(fn => fn !== 'constructor' && fn !== 'getEvents')
          .map(name => [name, this[name].bind(this)]) 

      return new Map(evts)
  }
}