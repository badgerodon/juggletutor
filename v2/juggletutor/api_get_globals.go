package main

func init() {
	HandleFunc("GetGlobals", func(req *Request) interface{} {
		return Globals
	})
}
