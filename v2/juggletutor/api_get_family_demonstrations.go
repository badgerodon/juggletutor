package main

import (
	"fmt"
	"strconv"
)

func init() {
	HandleFunc("GetFamilyDemonstrations", func(req *Request) interface{} {
		var args struct {
			FamilyId   int
			Properties map[string]int
		}
		err := req.Decode(&args)
		if err != nil {
			return err
		}

		if args.FamilyId == 0 {
			return fmt.Errorf("invalid family id")
		}

		properties := make(map[int]int, len(args.Properties))
		for k, v := range args.Properties {
			i, err := strconv.Atoi(k)
			if err != nil {
				return fmt.Errorf("invalid family properties")
			}
			properties[i] = v
		}

		demonstrations, err := req.GetFamilyDemonstrations(args.FamilyId, properties)
		if err != nil {
			return err
		}
		return demonstrations
	})
}
