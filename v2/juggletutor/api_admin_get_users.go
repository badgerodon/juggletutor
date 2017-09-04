package main

import (
	"fmt"
)

func init() {
	HandleFunc("GetUsers", func(req *Request) interface{} {
		typ, ok := req.Session["User.Type"]
		if !ok || typ != "Admin" {
			return fmt.Errorf("access denied")
		}

		var args struct {
			Limit  int
			Offset int
			Order  string
		}
		if req.Decode(&args) != nil {
			return fmt.Errorf("invalid arguments")
		}

		var res struct {
			Users []User
			Count int
		}

		var err error
		res.Users, res.Count, err = req.GetUsers(args.Limit, args.Offset, args.Order)
		if err != nil {
			return err
		}
		return res
	})
}
