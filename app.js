videojs('example-video').ready(function(){
  let player = this;
  player.play();

  videojs.Hls.xhr.beforeRequest = function(options) {
    console.log('request options', options);
    return options
  };
  let segmentMetadataTrack;
  let tracks = player.textTracks().tracks_;
  function getVttCuesName(cues) {
    return cues.map(function(item) {
      return item.text
    })
  }
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].label === 'segment-metadata') {
      segmentMetadataTrack = tracks[i];
    }
  }

  let previousPlaylist;
  if (segmentMetadataTrack) {
    segmentMetadataTrack.on('cuechange', function() {
      let activeCue = segmentMetadataTrack.activeCues[0];
      if (activeCue) {
        console.log('active chunk', activeCue.text);
        console.log('segments buffered:', getVttCuesName(segmentMetadataTrack.cues.cues_));
        console.log('-------------------------------');
        if (previousPlaylist !== activeCue.value.playlist) {
          console.log('Switched from rendition ' + previousPlaylist + ' to a new one - ' + activeCue.value.playlist);
        }
        previousPlaylist = activeCue.value.playlist;
      }
    });
  }
});
