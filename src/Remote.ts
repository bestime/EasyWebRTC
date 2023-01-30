import EasyWebRTC, { eReadyBus } from './EasyWebRTC'

export default class Remote extends EasyWebRTC {
  

  constructor (config: EasyWebRTC.BaseConfig) {
    super(config)
    
  }

  updateSecret (description: string, ice: string) {
    

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