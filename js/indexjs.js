

$(function() {
	// initialize with API key
	Parse.initialize("cLQ1TweezsDIp2ysSvYvXETLozVZIMdRfExqEg7u", "fgapofWIKhtAQfuToqAbRRlNHCAfBbFR6pusDzBk");
    // webRTC object
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVid',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remoteVid',
        autoRequestMedia: true
    });

    // wait until we get permission
    webrtc.on('localStream', function(stream) {
    	//console.log('got permission');
    	$("#wait").html("<p>You\'re all set! <i class='fa fa-check-circle'></i></p>");
    	$('#start').show();
    });

    // click "go", aka 'I'm ready to chat!'
    $('#start').click(function() {    	
        // look for some frands, join if there
        searchRequest(webrtc);       
    });

    // get rid of spinner when friend comes on
    webrtc.on('peerStreamAdded', function() {
    	$('#disconnected').hide();
    	$('#next').show();
    	$('.spinner').remove();
    });

    // allow 'next' option when partner leaves
    webrtc.on('peerStreamRemoved', function() {
    	$('#disconnected').show();
    	$('#next').show();
    });

    $('#next').click(function() {
    	webrtc.leaveRoom();
    	$('#disconnected').hide();
    	// look for some frands, join if there
    	$('#next').hide();
    	searchRequest(webrtc);
    });
});

function addRequest(webrtc) {
	var Request = Parse.Object.extend("Request");
	var request = new Request();
	request.save(null, {
		success: function(request) {
			id = request.id;
			console.log("Request added under id: " + id);
			webrtc.joinRoom(id);
		},
		error: function() {
			console.log("something's fucked up");
		}
	});	
}

// returns either request id or undefined
function searchRequest(webrtc) {
	$('#remoteVid').html('<div class="spinner">\
		<div class="double-bounce1"></div>\
		<div class="double-bounce2"></div>\
		</div>');
	var Request = Parse.Object.extend("Request");
	var requestQuery = new Parse.Query(Request);
	requestQuery.first({
		success: function(request) {
			// entry is in database
			// join room of other person, then destroy that persons
			if (request != undefined) {
				console.log("matched to: " + request.id);
				console.log('never tried...');
				webrtc.joinRoom(request.id);
				destroyPartner(request.id);
				return;
			}
			// entry is not in database;
			console.log("search returned no matches");
			console.log('about to add request...');
			addRequest(webrtc);
			return;
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}


function destroyPartner(searchResult) {
	var Request = Parse.Object.extend("Request") ;
	var requestQuery = new Parse.Query(Request);
	requestQuery.equalTo("objectId", searchResult);
	requestQuery.first({
		success: function(searchResult) {
			if (searchResult != undefined) {
				searchResult.destroy({
					success: function(searchResult) {
						console.log("deleted request object with id: " + searchResult.id);
					},
					error: function(searchResult, error) {
						alert("Error. Object could not be deleted: " + error.code + " " + error.message);
					}
				});
			}
		},
		error: function(error) {
			alert("Error. Request not found: " + error.code + " " + error.message);
		}
	});
}

function rageQuit()
{
	var Request = Parse.Object.extend("Request");
	var request = new Request();
	request.save(null, {
		success: function(request) {
			
		},
		error: function() {
			console.log("something's fucked up");
		}
	});	

}
