export default class CliConfig {

  constructor({username, hostUrl="https://hacker-chat-dg.herokuapp.com/" , room}) {
    this.username = username
    this.room = room

    const { hostname, port, protocol } = new URL(hostUrl)
    this.host = hostname
    this.port = port
    this.protocol = protocol.replace(/\W/g, '')
  }

  static parseArguments(commands) {
    const prefix = '--'
    const config = new Map()
    
    
    for(const key in commands) {

      const index = parseInt(key)
      const cmd = commands[key]

      if (!cmd.includes(prefix)) continue;

      config.set(
        cmd.replace(prefix, ''),
        commands[index+1]
      )
    }


    return new CliConfig(Object.fromEntries(config))
  }
}