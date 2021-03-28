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
        this.#updateUserEvents()
    }

    #updateUserEvents() {
        this.componentEmitter.emit(
            constants.events.app.STATUS_UPDATED,
            Arrays.from(this.#allUsers.values())
        )
    }

    getEvents() {
        const evts = Reflect.ownKeys(EventManager.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => this[name].bind(this))

        return new Map(evts)
    }
}