package main

import (
	"fmt"
)

func init() {
	HandleFunc("UpdateUser", func(req *Request) interface{} {
		return fmt.Errorf("Not implemented")
	})

}
