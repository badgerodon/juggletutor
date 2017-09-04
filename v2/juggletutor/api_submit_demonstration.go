package main

import (
	"fmt"
	"time"
)

func init() {
	HandleFunc("SubmitDemonstration", func(req *Request) interface{} {
		userId, ok := req.Session["User.Id"]
		if !ok {
			return fmt.Errorf("not logged in")
		}

		var args struct {
			VideoId    string
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
		if _, ok := args.Attributes["Family"]; !ok {
			return fmt.Errorf("expected family")
		}
		if _, ok := args.Attributes["Style"]; !ok {
			return fmt.Errorf("expected style")
		}
		if _, ok := args.Attributes["Count"]; !ok {
			return fmt.Errorf("expected count")
		}
		// TODO: Confirm the video belongs to the user who submitted it
		demonstration := Demonstration{
			Id:            GenerateId(),
			UserId:        userId,
			VideoId:       args.VideoId,
			Attributes:    args.Attributes,
			DateSubmitted: time.Now(),
			Status:        Submitted,
		}
		return req.PutDemonstration(demonstration)
	})
}
