package main

import (
	"encoding/json"
	"net/http"

	"appengine"
)

type (
	Handler func(req *Request) interface{}
	Request struct {
		request *http.Request
		context appengine.Context
		Session map[string]string
	}
)

func (this Request) Decode(dst interface{}) error {
	return json.NewDecoder(this.request.Body).Decode(dst)
}

func HandleFunc(method string, handler Handler) {
	http.HandleFunc("/api/"+method, func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "expected POST", 400)
			return
		}
		defer r.Body.Close()
		request := Request{
			request: r,
			context: appengine.NewContext(r),
		}

		// Get the session
		session := r.Header.Get("Session")
		sessionKey := r.Header.Get("SessionKey")
		if session == "" {
			request.Session = make(map[string]string)
		} else {
			if !Verify(session, sessionKey) {
				http.Error(w, "invalid session", 400)
				return
			}
			err := json.Unmarshal([]byte(session), &request.Session)
			if err != nil {
				http.Error(w, "invalid session", 400)
				return
			}
		}

		result := handler(&request)

		// Update the session
		encoded, err := json.Marshal(request.Session)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.Header().Set("Session", string(encoded))
		w.Header().Set("SessionKey", Sign(string(encoded)))

		// If the result was an error return a 500
		if err, ok := result.(error); ok {
			http.Error(w, err.Error(), 500)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})
}
