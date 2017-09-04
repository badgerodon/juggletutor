package main

func init() {
	HandleFunc("GetAttributes", func(req *Request) interface{} {
		attributes, err := req.GetAttributes()
		if err != nil {
			return err
		}
		return attributes
	})
}
