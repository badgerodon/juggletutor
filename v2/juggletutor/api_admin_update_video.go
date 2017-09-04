package main

import (
	"fmt"
)

func init() {
	HandleFunc("UpdateVideo", func(req *Request) interface{} {
		if typ, _ := req.Session.String("User.Type"); typ != "Admin" {
			return fmt.Errorf("Access Denied")
		}
		var args struct {
			Id                int64
			Status            string
			StatusDescription string
		}

		err := req.Decode(&args)
		if err != nil {
			return err
		}

		video, err := req.GetVideo(args.Id)
		if err != nil {
			return fmt.Errorf("Unknown Video")
		}
		video.Status = Status(args.Status)
		video.StatusDescription = args.StatusDescription

		err = req.PutVideo(&video)
		if err != nil {
			return fmt.Errorf("Error Updating Video")
		}

		return nil
	})
}
