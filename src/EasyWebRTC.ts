import { defineEventBus } from "@bestime/utils";
type Message = string | ArrayBuffer

export const eReadyBus = defineEventBus('ready')
export const eMessageBus = defineEventBus<(data: Message) => void>('on-message')

export default class EasyWebRTC {
  _cfg: EasyWebRTC.BaseConfig;
  _connection: RTCPeerConnection;
  _channel: RTCDataChannel

  constructor(config: EasyWebRTC.BaseConfig) {
    this._cfg = config;
    this._connection = new RTCPeerConnection({
      iceServers: [{ urls: this._cfg.server }]
    });

    this._channel = this._connection.createDataChannel('testChannel', {
      negotiated: true,
      id: 0
    });

    this._channel.onmessage = (ev) => {
      eMessageBus.emit(ev.data)
    }

    this._channel.onopen = (e) => {
      console.log('连接上了');
      eReadyBus.emit()      
    };
  }


  sendMessage (data: Message) {
    this._channel.send(data as any)
  }

  on(name: 'ready' | 'message', handler: any) {
    switch(name) {
      case 'ready':
        eReadyBus.on(handler)
        break;
      case 'message':
        eMessageBus.on(handler)
        break;
    }
    
  }

}
