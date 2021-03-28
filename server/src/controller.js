import { constants } from "./constants.js"

export default class Controller {
  #users = new Map()
  #rooms = new Map()

  constructor({socketServer}) {
    this.socketServer = socketServer
  }

  onNewConnection(socket){
    const {id } = socket 
    console.log('Connection stabilished with', id)

    const userData = { id, socket }
    this.#updateGlobalUserData(id, userData)

    socket.on('data', this.#onSocketData(id))
    socket.on('end', this.#onSocketClosed(id))
    socket.on('error', this.#onSocketClosed(id))
  }

  async joinRoom(socketId, data) { 
    const { roomId } = data
    const user = this.#updateGlobalUserData(socketId, data)

    const users = this.#joinUserOnRoom(roomId, user)
    const currentUsers = Array.from(users.values()).map(({userName, id}) => ({userName, id}))
    this.socketServer.sendMessage(user.socket, constants.event.UPDATE_USERS, currentUsers)

    this.#broadCast({ socketId, roomId, message: { id: socketId, userName: user.userName}, event: constants.event.USER_CONNECTED })
  }

  #broadCast ({roomId, socketId, event, message}) {
    const users = this.#rooms.get(roomId).values()
    for(const {socket, id} of users) if (socketId !== id) {
        this.socketServer.sendMessage(socket, event, message)
    }
  }

  #joinUserOnRoom(roomId, user) {
    const usersOnRoom = this.#rooms.get(roomId) ?? new Map()

    usersOnRoom.set(user.id, user)
    this.#rooms.set(roomId, usersOnRoom)

    return usersOnRoom
  }


  #onSocketData(id){
    return data => {
      try {   
        const { event, message } = JSON.parse(data)
        this[event](id, message)
      } catch (e) {
        console.error(`wrong event format ${data.toString()}`)
      }
    }
  }

  #onSocketClosed(id){
    return data => {
      console.log('onSocketClosed', id)
    }
  }


  #updateGlobalUserData (socketId, userData) {
    const users = this.#users
    const user = users.get(socketId) ?? {}


    const updatedUserData = {
      ...user,
      ...userData,

    }

    users.set(socketId, updatedUserData)

    return users.get(socketId)
  }
}