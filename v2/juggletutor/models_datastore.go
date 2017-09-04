package main

import (
	"strings"
	"time"

	"appengine/datastore"
)

func toUnixMicro(t time.Time) int64 {
	// We cannot use t.UnixNano() / 1e3 because we want to handle times more than
	// 2^63 nanoseconds (which is about 292 years) away from 1970, and those cannot
	// be represented in the numerator of a single int64 divide.
	return t.Unix()*1e6 + int64(t.Nanosecond()/1e3)
}

func fromUnixMicro(t int64) time.Time {
	return time.Unix(t/1e6, (t%1e6)*1e3)
}

func (this *Demonstration) Load(c <-chan datastore.Property) error {
	this.Attributes = make(map[string]string)
	for p := range c {
		switch p.Name {
		case "Id":
			str, ok := p.Value.(string)
			if ok {
				this.Id = str
			}
		case "UserId":
			str, ok := p.Value.(string)
			if ok {
				this.UserId = str
			}
		case "VideoId":
			str, ok := p.Value.(string)
			if ok {
				this.VideoId = str
			}
		case "DateSubmitted":
			i, ok := p.Value.(int64)
			if ok {
				this.DateSubmitted = fromUnixMicro(i)
			}
		case "Status":
			str, ok := p.Value.(string)
			if ok {
				this.Status = Status(str)
			}
		default:
			if strings.HasPrefix(p.Name, "Attributes.") {
				str, ok := p.Value.(string)
				if ok {
					this.Attributes[p.Name[len("Attributes."):]] = str
				}
			}
		}
	}
	return nil
}
func (this *Demonstration) Save(c chan<- datastore.Property) error {
	defer close(c)
	c <- datastore.Property{
		Name:  "Id",
		Value: this.Id,
	}
	c <- datastore.Property{
		Name:  "UserId",
		Value: this.UserId,
	}
	c <- datastore.Property{
		Name:  "VideoId",
		Value: this.VideoId,
	}
	c <- datastore.Property{
		Name:  "DateSubmitted",
		Value: toUnixMicro(time.Now()),
	}
	c <- datastore.Property{
		Name:  "Status",
		Value: string(this.Status),
	}
	for k, v := range this.Attributes {
		c <- datastore.Property{
			Name:  "Attributes." + k,
			Value: v,
		}
	}
	return nil
}
