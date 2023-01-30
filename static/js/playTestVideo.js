var playTestVideo = (function () {
  var assetURL = './frag_bunny.mp4'
  var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  
  return function (callback) {
    var video = document.createElement('video')
    var oButton = document.createElement('button')
    oButton.innerText = '播放'

    var mediaSource = new MediaSource;
    var sourceBuffer = null;

    var totalSegments = 30;
    var segmentLength = 0;
    var segmentDuration = 0;
    var bytesFetched = 0;
    var requestedSegments = [];

    for (var i = 0; i < totalSegments; ++i) requestedSegments[i] = false;
    video.src = URL.createObjectURL(mediaSource);

    video.addEventListener('canplay', function () {
      console.log('可以播放222222222222222')
      play()
    });

    mediaSource.addEventListener('sourceopen', sourceOpen);

    function getFileLength (url, cb) {
      var xhr = new XMLHttpRequest;
      xhr.open('head', url);
      xhr.onload = function () {
          cb(xhr.getResponseHeader('content-length'));
        };
      xhr.send();
    };
        
        
    function sourceOpen (_) {
      
      sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
      getFileLength(assetURL, function (fileLength) {
        console.log((fileLength / 1024 / 1024).toFixed(2), 'MB');
        //totalLength = fileLength;
        segmentLength = Math.round(fileLength / totalSegments);
        //console.log(totalLength, segmentLength);
        fetchRange(assetURL, 0, segmentLength, appendSegment);
        requestedSegments[0] = true;
        video.addEventListener('timeupdate', checkBuffer);
        
        
        video.addEventListener('seeking', seek);
      });
    };


    

    function fetchRange (url, start, end, cb) {
      
      var xhr = new XMLHttpRequest;
      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end);
      xhr.onload = function () {
        console.log('fetched bytes: ', start, end);
        bytesFetched += end - start + 1;
        cb(xhr.response);        
      };
      xhr.send();
    };

    function appendSegment (chunk) {
      sourceBuffer.appendBuffer(chunk);
      callback && callback(chunk)
    };

    function checkBuffer (_) {
      var currentSegment = getCurrentSegment();
      if (currentSegment === totalSegments && haveAllSegments()) {
        console.log('last segment', mediaSource.readyState);
        mediaSource.endOfStream();
        video.removeEventListener('timeupdate', checkBuffer);
      } else if (shouldFetchNextSegment(currentSegment)) {
        requestedSegments[currentSegment] = true;
        console.log('time to fetch next chunk', video.currentTime);
        fetchRange(assetURL, bytesFetched, bytesFetched + segmentLength, appendSegment);
      }
      //console.log(video.currentTime, currentSegment, segmentDuration);
    };

    function seek (e) {
      console.log(e);
      if (mediaSource.readyState === 'open') {
        sourceBuffer.abort();
        console.log(mediaSource.readyState);
      } else {
        console.log('seek but not open?');
        console.log(mediaSource.readyState);
      }
    };

    function getCurrentSegment () {
      return ((video.currentTime / segmentDuration) | 0) + 1;
    };

    function haveAllSegments () {
      return requestedSegments.every(function (val) { return !!val; });
    };

    function shouldFetchNextSegment (currentSegment) {
      // console.log('当前', segmentDuration, video.currentTime)
      return video.currentTime > segmentDuration * currentSegment * 0.1 &&
        !requestedSegments[currentSegment];
    };

    oButton.onclick = function () {
      
    }

    document.body.appendChild(video)
    document.body.appendChild(oButton)

    function play () {
      console.log('嘎嘎嘎', video.duration, totalSegments)
      segmentDuration = video.duration / totalSegments;
      video.play();
      
    }

  }
})();