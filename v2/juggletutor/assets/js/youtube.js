jt.Youtube = {
	ready: [],
	OnReady: function(callback) {
		if (this.ready) {
			this.ready.push(callback);
		} else {
			callback();
		}
	},
	Widget: function(args) {
		jt.Youtube.OnReady(function() {
			var widget = new YT.UploadWidget("widget", {
				width: 640,
				events: {
					onStateChange: function() {
						console.log(arguments);
					},
					onUploadSuccess: function(args) {
						var videoId = args.data.videoId;
						// TODO: show some sort of progress bar or something
					},
					onApiReady: function() {
						widget.setVideoTitle("JuggleTutor.com - " + _.map(args.attributes(), function(v, k) { return v; }).join(" - "));
						widget.setVideoKeywords("juggle", "juggletutor", "juggletutor-" +  _.map(args.attributes(), function(v, k) { return v; }).join("-"));
					},
		    		onProcessingComplete: function(args) {
		    			args.complete(args.data.videoId);
		    		}
				}
			});
		});
	},
	Player: function(elementId, args) {
		return new YT.Player('player', args);
	}
};

function onYouTubeIframeAPIReady() {
	_.each(jt.Youtube.ready, function(callback) {
		callback();
	});
	jt.Youtube.ready = null;
}

(function() {
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();
