import EasyWebRTC, { eMessageBus } from './EasyWebRTC'

export default class Channel extends EasyWebRTC {
  
  constructor (config: EasyWebRTC.BaseConfig) {
    super(config)
    this.init()


    
  }

  init () {
    


    
    this._connection.addEventListener('icecandidate', function (event) {
      
      const iceCandidate = event.candidate;
  
      if (iceCandidate) {
        const newIce = new RTCIceCandidate(iceCandidate);
        const ice = JSON.stringify(newIce)
        console.log('通知对端添加 ice =>',ice);
      }
    });

    this._connection.createOffer().then((description) => {
      this._connection.setLocalDescription(description);
      
      console.log('通知对端设置：description => ', JSON.stringify(description))
    })
  }

  

  updateDescription (description: string) {
    const desc: RTCSessionDescriptionInit = JSON.parse(description)
    this._connection.setRemoteDescription(desc);
  }
}