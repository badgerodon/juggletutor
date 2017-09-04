package main

import (
	"encoding/json"
	"io/ioutil"
	"net/url"

	"appengine/urlfetch"
)

func (this *Request) GoogleGet(accessToken, path string, result interface{}) error {
	client := urlfetch.Client(this.context)
	url := "https://www.googleapis.com/" +
		path + "?access_token=" +
		url.QueryEscape(accessToken)
	this.context.Debugf("[google] GET %v", url)
	resp, err := client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	bs, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	this.context.Debugf("[google] - " + string(bs))
	err = json.Unmarshal(bs, result)
	if err != nil {
		return err
	}
	return nil
}
