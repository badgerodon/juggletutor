package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"

	"appengine/urlfetch"
)

type (
	YouTubeRating struct {
		Average   float64 `xml:"average,attr"`
		Max       int     `xml:"max,attr"`
		Min       int     `xml:"min,attr"`
		NumRaters int     `xml:"numRaters,attr"`
		Likes     int     `xml:"numLikes,attr"`
		Dislikes  int     `xml:"numDislikes,attr"`
	}
	YouTubeStatistics struct {
		Favorites int `xml:"favoriteCount,attr"`
		Views     int `xml:"viewCount,attr"`
	}
	YouTubeVideoDetails struct {
		UserId     string            `xml:"author>userId"`
		VideoId    string            `xml:"group>videoid"`
		License    string            `xml:"group>license"`
		Rating     YouTubeRating     `xml:"rating"`
		Statistics YouTubeStatistics `xml:"statistics"`
	}
	YouTubeProfile struct {
		UserId           string `xml:"userId"`
		UserName         string `xml:"username"`
		Name             string `xml:"author>name"`
		GooglePlusUserId string `xml:"googlePlusUserId"`
	}
)

func (this *Request) GetYouTube(path string, result interface{}) error {
	client := urlfetch.Client(this.context)
	url := "https://gdata.youtube.com/" + path
	this.context.Debugf("[youtube] GET: %v", url)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("X-GData-Key", "key="+Settings.YouTubeApiKey)
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 {
		bs, _ := ioutil.ReadAll(resp.Body)
		this.context.Debugf("[youtube] RESULT: %v, %v", resp.StatusCode, string(bs))
		return fmt.Errorf("Invalid Status Code: %v, %v", resp.StatusCode, resp.Status)
	}
	defer resp.Body.Close()
	err = xml.NewDecoder(resp.Body).Decode(result)
	if err != nil {
		return err
	}
	this.context.Debugf("[youtube] RESULT: %v, %v", resp.StatusCode, result)
	return nil
}

func (this *Request) GetYouTubeVideoDetails(videoId string) (*YouTubeVideoDetails, error) {
	var details YouTubeVideoDetails
	return &details, this.GetYouTube("feeds/api/videos/"+videoId+"?v=2", &details)
}

func (this *Request) GetYouTubeProfile(userId string) (*YouTubeProfile, error) {
	var profile YouTubeProfile
	return &profile, this.GetYouTube("feeds/api/users/"+userId+"?v=2", &profile)
}
