package main

import (
	"fmt"
)

func init() {
	type TokenResponse struct {
		Audience  string `json:"audience"`
		Scope     string `json:"scope"`
		UserId    string `json:"userid"`
		ExpiresIn int    `json:"expires_in"`
	}
	type ProfileResponse struct {
		Id      string `json:"id"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}

	HandleFunc("Login", func(req *Request) interface{} {
		var args struct {
			AccessToken string
		}
		err := req.Decode(&args)
		if err != nil {
			return err
		}
		var user User

		var tokenResponse TokenResponse
		err = req.GoogleGet(args.AccessToken, "oauth2/v1/tokeninfo", &tokenResponse)
		if err != nil {
			return fmt.Errorf("Invalid username or password")
		}
		if tokenResponse.Audience != Settings.GoogleClientId {
			return fmt.Errorf("Invalid username or password")
		}
		var profileResponse ProfileResponse
		err = req.GoogleGet(args.AccessToken, "oauth2/v2/userinfo", &profileResponse)
		if err != nil {
			return fmt.Errorf("Invalid username or password")
		}
		if profileResponse.Id == "" {
			return fmt.Errorf("Invalid username or password")
		}
		user, err = req.GetUser(profileResponse.Id)
		user.Name = profileResponse.Name
		user.Picture = profileResponse.Picture
		if err == nil {
			err = req.UpdateUser(user)
		} else {
			user.Id = profileResponse.Id
			user.Type = "User"
			err = req.CreateUser(user)
		}
		if err != nil {
			return fmt.Errorf("Unable to Login: %v", err)
		}
		req.Session["User.Id"] = user.Id
		req.Session["User.Type"] = user.Type
		return user
	})
}
