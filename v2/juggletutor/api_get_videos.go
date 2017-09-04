package main

import (
//"fmt"
)

func init() {
	getUserIds := func(videos []Video) []int64 {
		hash := map[int64]bool{}
		for _, v := range videos {
			hash[v.OwnerId] = true
			hash[v.SubmitterId] = true
		}
		ids := make([]int64, 0, len(hash))
		for id, _ := range hash {
			ids = append(ids, id)
		}
		return ids
	}

	HandleFunc("GetVideos", func(req *Request) interface{} {
		var args struct {
			Type       string
			Status     string
			Attributes map[string]string
			Offset     int
			Limit      int
		}
		err := req.Decode(&args)
		if err != nil {
			return err
		}
		videos, err := req.GetVideos(args.Type, args.Status, args.Attributes, args.Offset, args.Limit)
		if err != nil {
			return err
		}
		users, err := req.GetUserNames(getUserIds(videos))
		if err != nil {
			return err
		}
		return struct {
			Videos interface{}
			Users  interface{}
		}{videos, users}
	})
}
