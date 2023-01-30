
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':1511/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var EasyWebRTC = (function (exports) {
'use strict';

/**  
 * 个人工具库 (TS版) bestime.esm.min.js
 * @QQ 1174295440
 * @author Bestime
 * @see https://github.com/bestime/tool
 * @update 2022-11-10 11:11:13
 */
var $undefinedValue=undefined;document.getElementsByTagName("head")[0];var events={};function defineEventBus(i){if(events[i])throw '"'+i+'" Has already been registered!';return events[i]=events[i]||[],{on:function(e){events[i].push(e);},emit:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];for(var r=0;r<events[i].length;r++)events[i][r].apply($undefinedValue,t);},off:function(e){if(!e)throw "the hander of off is required!";for(var t=0;t<events[i].length;t++)events[i][t]===e&&events[i].splice(t--,1);},dispose:function(){for(var e=0;e<events[i].length;e++)events[i].splice(e--,1);delete events[i];}}}

const eReadyBus = defineEventBus('ready');
const eMessageBus = defineEventBus('on-message');
class EasyWebRTC {
    _cfg;
    _connection;
    _channel;
    constructor(config) {
        this._cfg = config;
        this._connection = new RTCPeerConnection({
            iceServers: [{ urls: this._cfg.server }]
        });
        this._channel = this._connection.createDataChannel('testChannel', {
            negotiated: true,
            id: 0
        });
        this._channel.onmessage = (ev) => {
            eMessageBus.emit(ev.data);
        };
        this._channel.onopen = (e) => {
            console.log('连接上了');
            eReadyBus.emit();
        };
    }
    sendMessage(data) {
        this._channel.send(data);
    }
    on(name, handler) {
        switch (name) {
            case 'ready':
                eReadyBus.on(handler);
                break;
            case 'message':
                eMessageBus.on(handler);
                break;
        }
    }
}

class Channel extends EasyWebRTC {
    constructor(config) {
        super(config);
        this.init();
    }
    init() {
        this._connection.addEventListener('icecandidate', function (event) {
            const iceCandidate = event.candidate;
            if (iceCandidate) {
                const newIce = new RTCIceCandidate(iceCandidate);
                const ice = JSON.stringify(newIce);
                console.log('通知对端添加 ice =>', ice);
            }
        });
        this._connection.createOffer().then((description) => {
            this._connection.setLocalDescription(description);
            console.log('通知对端设置：description => ', JSON.stringify(description));
        });
    }
    updateDescription(description) {
        const desc = JSON.parse(description);
        this._connection.setRemoteDescription(desc);
    }
}

class Remote extends EasyWebRTC {
    constructor(config) {
        super(config);
    }
    updateSecret(description, ice) {
        const desc = JSON.parse(description);
        const ICE = JSON.parse(ice);
        this._connection.setRemoteDescription(desc);
        this._connection.addIceCandidate(ICE);
        this._connection.createAnswer().then((channelDesc) => {
            this._connection.setLocalDescription(channelDesc);
            console.log('通知各个频道更新channelDesc => ', JSON.stringify(channelDesc));
        });
    }
}

exports.Channel = Channel;
exports.Remote = Remote;

return exports;

})({});
//# sourceMappingURL=index.js.map
