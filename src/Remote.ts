import EasyWebRTC, { eReadyBus } from './EasyWebRTC'

export default class Remote {
  
  _cfg: EasyWebRTC.BaseConfig;
  _connection: RTCPeerConnection;
  _channel: RTCDataChannel;

  constructor (config: EasyWebRTC.BaseConfig) {
    this._cfg = config;
    this._connection = new RTCPeerConnection({
      iceServers: [{ urls: this._cfg.server }]
    });

    this._channel = this._connection.createDataChannel('testChannel', {
      negotiated: true,
      id: 0
    });

    this._channel.onmessage = (ev) => {
      this.onmessage(ev.data)
    }

    this._channel.onopen = (e) => {
      this.onconnect()      
    };
    
  }

  onmessage (data: any) {}
  onconnect () {}
  send (data: any) {
    this._channel.send(data)
  }

  setSecret (description: string, ice: string) {
    

    const desc: RTCSessionDescriptionInit = JSON.parse(description)
    const ICE: RTCIceCandidateInit = JSON.parse(ice)

    this._connection.setRemoteDescription(desc);
    this._connection.addIceCandidate(ICE)
    this._connection.createAnswer().then((channelDesc) => {
      this._connection.setLocalDescription(channelDesc);
      console.log('通知各个频道更新channelDesc => ', JSON.stringify(channelDesc))
    });
  }
}