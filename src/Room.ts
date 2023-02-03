import { eMessageBus } from "./EasyWebRTC";
import Remote from "./Remote";



export default class Room {
  _cfg: EasyWebRTC.BaseConfig;
  _rooms: Remote[] = []
  constructor (config: EasyWebRTC.BaseConfig) {
    this._cfg = config
  }

  onmessage (data: any) {}

  join (description: string, ice: string) {
    const iRoom = new Remote(this._cfg)
    iRoom.setSecret(description, ice)
    this._rooms.push(iRoom)
    iRoom.onmessage = (data) => {
      this.onmessage(data)
    }
    iRoom.onconnect = () => {
      iRoom.send('我加入了')
    }
  }

  sendMessage (msg: string) {
    console.log("发送消息", this._rooms)
    this._rooms.forEach(function (iRoom) {
      iRoom.send(msg)
    })
  }
}