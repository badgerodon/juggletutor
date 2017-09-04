package main

import (
	"fmt"
	"time"
)

func init() {
	/*
		Example:
		jt.Api("SubmitVideo", {
			"Type": "Tutorial",
			"VideoId": "vak8sqfIkiI",
			"Attributes": {
				"Style": "Toss Juggling",
				"Equipment": "Balls",
				"Count": "3",
				"Trick": "Shower"
			}
		}, function(_, err) {
			console.log(err);
		})

	*/
	HandleFunc("SubmitVideo", func(req *Request) interface{} {
		userId, ok := req.Session.Int("User.Id")
		if !ok {
			return fmt.Errorf("not logged in")
		}

		var args struct {
			Type       string
			VideoId    string
			Start      string
			End        string
			Attributes map[string]string
		}
		err := req.Decode(&args)
		if err != nil {
			return err
		}
		// Validate the arguments
		if args.VideoId == "" {
			return fmt.Errorf("expected video id")
		}
		if args.Type == "" {
			return fmt.Errorf("expected video type")
		}
		for _, attr := range []string{"Style", "Equipment", "Count", "Trick"} {
			v, ok := args.Attributes[attr]
			if !ok || v == "_" || v == "" {
				return fmt.Errorf("%v is a required field", attr)
			}
		}

		details, err := req.GetYouTubeVideoDetails(args.VideoId)
		if err != nil {
			return fmt.Errorf("Error retrieving YouTube video")
		}
		profile, err := req.GetYouTubeProfile(details.UserId)
		if err != nil {
			return fmt.Errorf("Error retrieving YouTube profile")
		}
		owner, err := req.GetUserFromYouTube(profile)
		if err != nil {
			return fmt.Errorf("Error retrieving user")
		}
		_, err = req.GetVideoById(details.VideoId)
		if err == nil {
			return fmt.Errorf("Video has already been submitted")
		}
		video := &Video{
			OwnerId:       owner.Id,
			SubmitterId:   userId,
			VideoId:       details.VideoId,
			Attributes:    args.Attributes,
			DateSubmitted: time.Now(),
			Status:        Submitted,
			Type:          args.Type,
		}
		return req.PutVideo(video)
	})
}
