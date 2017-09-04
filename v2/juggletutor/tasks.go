package main

import (
	"fmt"
	"net/http"
	"strconv"

	"appengine"
	"appengine/datastore"
	"appengine/taskqueue"
)

func getVideoStatistics(w http.ResponseWriter, r *http.Request) {
	req := Request{
		request: r,
		context: appengine.NewContext(r),
	}
	id, err := strconv.Atoi(r.FormValue("id"))
	// No id, so enqueue all videos
	if err != nil {
		q := datastore.NewQuery("Video").KeysOnly()
		it := q.Run(req.context)
		for {
			k, err := it.Next(nil)
			if err != nil {
				break
			}
			taskqueue.Add(req.context, taskqueue.NewPOSTTask("/internal/tasks/get-video-statistics", map[string][]string{
				"id": {fmt.Sprint(k.IntID())},
			}), "")
		}
		fmt.Fprintf(w, "done")
		return
	}
	video, err := req.GetVideo(int64(id))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	details, err := req.GetYouTubeVideoDetails(video.VideoId)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	video.Rating = details.Rating
	video.Statistics = details.Statistics
	err = req.PutVideo(&video)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	fmt.Fprintf(w, "done")
}

func init() {
	http.HandleFunc("/internal/tasks/get-video-statistics", getVideoStatistics)
}
