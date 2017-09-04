package main

func init() {
	type Result struct {
		User           User
		Demonstrations []Demonstration
	}
	HandleFunc("GetProfile", func(req *Request) interface{} {
		var args struct{ Id string }
		err := req.Decode(&args)
		if err != nil {
			return err
		}

		user, err := req.GetUser(args.Id)
		if err != nil {
			return err
		}

		demonstrations, err := req.GetUserDemonstrations(args.Id)
		if err != nil {
			return err
		}

		return Result{user, demonstrations}
	})
}
