$(function() {
	$('#start').click(function() {
	});

	// complicated way to get user media 
	navigator.getUserMedia  = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

	var video = document.querySelector('video');

	if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true, audio: true}, function(stream) {
			console.log('succcess');
			video.src = window.URL.createObjectURL(stream);
			setTimeout(function() {
				$("#wait").html("<p>You\'re all set! <i class='fa fa-check-circle'></i></p>");
				$('#start').show();
			},1000)
		}, errorCall);
	} else
		alert('Update your browser, you dinosaur.');


	var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVid',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotesVideos',
    });

	// we have to wait until it's ready
	webrtc.on('readyToCall', function () {
  // you can name it anything
  webrtc.joinRoom('roomName');
});


});


function errorCall() {
	alert('you\'re gunna need to allow that...');
}
    /*function hasGetUserMedia() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    if (hasGetUserMedia()) {
      // Good to go!
      console.log('yay');
    } else {
      console.log('getUserMedia() is not supported in your browser');
    }*/