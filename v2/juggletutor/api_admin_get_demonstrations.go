package main

import (
	"fmt"
)

func init() {
	HandleFunc("GetDemonstrations", func(req *Request) interface{} {
		typ, ok := req.Session["User.Type"]
		if !ok || typ != "Admin" {
			return fmt.Errorf("access denied")
		}
		return fmt.Errorf("not implemented")
	})
}
