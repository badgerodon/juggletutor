_.extend(jt, {
	views: {},
	onYoutubeReady: function(callback) {
		if (jt._youtubeready === null) {
			callback();
		} else {
			jt._youtubeready.push(callback);
		}
	}
})
jt.views.tricks = {
	view: function(key, body) {
		var keys = key.split('-');
		var family = _.find(Globals.trick_families, function(f) {
			return f.key === keys[0];
		});

		if (!family) {
			jt.render('404');
			return;
		}

		var tabs = [
			{ 'link': 'watch', 'name': 'Watch' },
			{ 'link': 'learn', 'name': 'Learn' },
			{ 'link': 'submit', 'name': 'Submit' }
		];
		_.each(tabs, function(tab) {
			tab.selected = jt.url.substr(jt.url.length - tab.link.length) === tab.link;
		});

		var options = _.map(family.options, function(option, i) {
			var values = _.map(option.values, function(value) {
				var newKey = _.map(keys, function(k, j) {
					return i === (j-1) ? value : k;
				}).join("-");
				var link = "/tricks/" + newKey;
				return {
					"name": _.str.titleize(value),
					"link": link,
					"selected": key === newKey
				}
			});
			return {
				"name": _.str.titleize(option.key),
				"values": values
			};
		});

		jt.render("tricks/view", {
			key: key,
			name: family.names[0],
			body: body,
			tabs: tabs,
			options: options,
			animation: Globals.animations[key]
				? ("/assets/img/animations/" + key + ".gif")
				: null
		});
	},
	watch: function(key, submissions) {
		jt.views.tricks.view(key, jt.renderTemplate("tricks/watch", {
			key: key,
			submissions: submissions
		}));
	},
	learn: function(key) {
		var body = "No Lesson Available";
		if (Templates["lessons/" + key]) {
			body = jt.renderTemplate("lessons/" + key, {
				key: key
			});
		}

		jt.views.tricks.view(key, jt.renderTemplate("tricks/learn", {
			key: key,
			body: body
		}));
	},
	submit: function(key) {
		jt.views.tricks.view(key, jt.renderTemplate("tricks/submit"));

		var $el = $("#trick-submit");

		var showUploadWidget = function() {
			jt.youtube.onReady(function() {
				$el.html('<div id="widget"></div>');
				var widget = jt.youtube.widget("widget", {
					width: 640,
					events: {
						onUploadSuccess: function(args) {
							var videoId = args.data.videoId;
							$el.html("");
						},
						onApiReady: function() {
							widget.setVideoTitle("JuggleTutor.com - " + key);
							widget.setVideoKeywords("juggle", "juggletutor", "juggletutor-" + key);
						},
	      		onProcessingComplete: function(args) {
	      			var videoId = args.data.videoId;
	      			jt.api("submit", {
	      				"key": key,
	      				"video_id": videoId,
	      				"success": function(submission) {
	      					showPlayerWidget(submission);
	      				}
	      			});
	      		}
					}
				});
			});
		};
		var showPlayerWidget = function(submission) {
			jt.youtube.onReady(function() {
				$el.html(jt.renderTemplate('tricks/submit-player', submission))
				jt.youtube.player("player", {
					videoId: submission.video_id,
					width: 350,
					height: 213,
					events: {}
				});
			});
		};

		jt.api("getUserSubmission", {
			"key": key,
			"success": function(submission) {
				if (submission) {
					showPlayerWidget(submission);
				} else {
					showUploadWidget();
				}
			}
		});
	}
};

