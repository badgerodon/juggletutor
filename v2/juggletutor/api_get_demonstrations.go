package main

import (
//"fmt"
)

func init() {
	HandleFunc("GetDemonstrations", func(req *Request) interface{} {
		var args struct {
			Status     string
			Attributes map[string]string
			Offset     int
			Limit      int
		}
		err := req.Decode(&args)
		if err != nil {
			return err
		}
		demonstrations, err := req.GetDemonstrations(args.Status, args.Attributes, args.Offset, args.Limit)
		if err != nil {
			return err
		}
		return demonstrations
	})
}
