package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"testing"

	"code.google.com/p/go.net/websocket"
)

type (
	fakeGoogle struct {
		responses []string
		current   int
	}
)

func mkFakeGoogle(responses ...string) *fakeGoogle {
	return &fakeGoogle{responses, 0}
}
func (this *fakeGoogle) Get(accessToken, path string, result interface{}) error {
	next := this.responses[this.current%len(this.responses)]
	this.current++
	return json.Unmarshal([]byte(next), result)
}

func init() {
	TLS_KEY = "../" + TLS_KEY
	TLS_CERT = "../" + TLS_CERT
}

func TestApi(t *testing.T) {
	l, err := startSecureServer()
	if err != nil {
		t.Fatal(err)
	}
	defer l.Close()

	cfg, err := websocket.NewConfig(
		"wss://127.0.0.1:"+TLS_PORT+"/api/ws",
		"https://127.0.0.1:"+TLS_PORT,
	)
	if err != nil {
		t.Fatal(err)
	}
	cfg.TlsConfig = &tls.Config{}
	cfg.TlsConfig.InsecureSkipVerify = true

	ws, err := websocket.DialConfig(cfg)
	if err != nil {
		t.Fatal(err)
	}
	testLogin(t, ws)
	ws.Close()

}

func call(ws *websocket.Conn, method string, input interface{}, output interface{}) error {
	err := websocket.JSON.Send(ws, []interface{}{
		1,
		method,
		input,
	})
	if err != nil {
		return err
	}
	var result [3]json.RawMessage
	err = websocket.JSON.Receive(ws, &result)
	if err != nil {
		return err
	}
	err = json.Unmarshal(result[1], output)
	if err != nil {
		return err
	}
	var errorString string
	err = json.Unmarshal(result[2], &errorString)
	if errorString != "" {
		return fmt.Errorf(errorString)
	}
	return err
}
