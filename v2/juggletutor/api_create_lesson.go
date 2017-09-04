package main

import (
	"fmt"
)

func init() {
	HandleFunc("CreateLesson", func(req *Request) interface{} {
		userId, ok := req.Session["User.Id"]
		if !ok {
			return fmt.Errorf("not logged in")
		}

		return userId
	})
}
