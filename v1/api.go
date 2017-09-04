package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/rpc"
	jsonrpc "github.com/gorilla/rpc/json"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

const (
	ClientID     = "XXX"
	ClientSecret = "XXX"
)

func mkHMAC(txt string) string {
	h := hmac.New(sha256.New, []byte(ClientSecret))
	h.Write([]byte(txt))
	return hex.EncodeToString(h.Sum(nil))
}

type API struct {
}

func (api *API) GetAuthURL(req *http.Request, params *struct{ Origin string }, res *struct{ URL string }) error {
	state := fmt.Sprint(time.Now().UnixNano())
	state += "_" + mkHMAC(state)

	res.URL = "https://accounts.google.com/o/oauth2/auth" +
		"?response_type=code" +
		"&client_id=" + ClientID +
		"&redirect_uri=" + params.Origin + "/oauth2callback" +
		"&scope=profile" +
		"&state=" + state +
		"&access_type=online" +
		"&include_granted_scopes=true"
	return nil
}

type (
	GetAccessTokenRequest struct {
		Code  string
		State string
	}
	GetAccessTokenResult struct {
		AccessToken string
		Expires     time.Time
	}
)

func (api *API) GetAccessToken(req *http.Request, params *GetAccessTokenRequest, res *GetAccessTokenResult) error {
	parts := strings.SplitN(params.State, "_", 2)
	if len(parts) < 2 {
		return fmt.Errorf("invalid state")
	}
	if parts[1] != mkHMAC(parts[0]) {
		return fmt.Errorf("invalid state")
	}

	ctx := appengine.NewContext(req)
	client := urlfetch.Client(ctx)
	resp, err := client.Post("https://www.googleapis.com/oauth2/v3/token", "application/x-www-form-urlencoded", strings.NewReader(url.Values{
		"code":          []string{params.Code},
		"client_id":     []string{ClientID},
		"client_secret": []string{ClientSecret},
		"redirect_uri":  []string{"https://local.juggletutor.com/oauth2callback"},
		"grant_type":    []string{"authorization_code"},
	}.Encode()))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var r struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
		Error       string `json:"error"`
	}
	err = json.NewDecoder(resp.Body).Decode(&r)
	if err != nil {
		return err
	}
	if r.Error != "" {
		return fmt.Errorf("%s", r.Error)
	}

	res.AccessToken = r.AccessToken
	res.Expires = time.Now().Add(time.Duration(r.ExpiresIn) * time.Second)

	return nil
}

type (
	TrickViewRequest struct{}
	TrickViewResult  struct {
		ID                              string
		Title                           string
		Watched                         bool
		MachineVerified, SocialVerified bool
		LessonID                        string
		AdditionalLessons               []string
	}
)

func (api *API) TrickView(req *http.Request, params *TrickViewRequest, res *TrickViewResult) error {
	return nil
}

type (
	TrickListRequest     struct{}
	TrickListResultTrick struct {
		ID                              string
		Title                           string
		Watched                         bool
		MachineVerified, SocialVerified bool
	}
	TrickListResult struct {
		Tricks []TrickListResultTrick
	}
)

func (api *API) TrickList(req *http.Request, params *TrickListRequest, res *TrickListResult) error {
	res.Tricks = []TrickListResultTrick{
		{
			ID:    "Introduction",
			Title: "Introduction",
		},
	}
	return nil
}

func init() {
	s := rpc.NewServer()
	s.RegisterCodec(jsonrpc.NewCodec(), "application/json")
	s.RegisterService(new(API), "")
	http.Handle("/rpc", s)
}
