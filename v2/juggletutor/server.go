package main

import (
	"bytes"
	"encoding/base64"
	"html/template"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var (
	siteAuth = base64.StdEncoding.EncodeToString([]byte("beta:test"))

	TLS_CERT          = "keys/juggle-tutor.crt"
	TLS_KEY           = "keys/juggle-tutor.key"
	TLS_PORT          = "443"
	PORT              = "80"
	TAG               = "Web"
	WORKING_DIRECTORY = "juggletutor/"
)

func init() {
	http.Handle(
		"/assets/",
		http.StripPrefix(
			"/assets/",
			http.FileServer(http.Dir(WORKING_DIRECTORY+"assets")),
		),
	)
	http.HandleFunc("/", handleIndex)
}

func parseTemplate(name string, ctx interface{}) string {
	tpl, err := template.ParseFiles(name)
	if err != nil {
		panic(err)
	}
	var buf bytes.Buffer
	err = tpl.Execute(&buf, ctx)
	if err != nil {
		panic(err)
	}
	return buf.String()
}

func getRoot() string {
	tpls := map[string]interface{}{}
	root := WORKING_DIRECTORY + "assets/tpl/"
	filepath.Walk(root, func(p string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}
		contents, err := ioutil.ReadFile(p)
		if err != nil {
			return err
		}
		id := p[len(root):]
		id = id[:len(id)-4]
		id = strings.Replace(id, "\\", "/", -1)
		tpls[id] = template.JS(string(contents))
		return nil
	})

	animations := map[string]bool{}
	root = WORKING_DIRECTORY + "assets/img/animations/"
	filepath.Walk(root, func(p string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}
		f := p[len(root):]
		f = f[:len(f)-4]
		animations[f] = true
		return nil
	})

	scripts := []string{
		// libs
		"/assets/lib/js/jquery.js",
		"/assets/lib/js/jquery.textext.js",
		"/assets/lib/js/jquery-cookie.js",
		"/assets/lib/js/amplify.js",
		"/assets/lib/js/underscore.js",
		"/assets/lib/js/underscore-template-helpers.js",
		"/assets/lib/js/moment.js",
		// jt
		"/assets/js/format.js",
		"/assets/js/api.js",
		"/assets/js/route.js",
		"/assets/js/template.js",
		"/assets/js/youtube.js",
		"/assets/js/main.js",
	}
	root = WORKING_DIRECTORY + "assets/js/routes/"
	filepath.Walk(root, func(p string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}
		p = strings.Replace(p, "\\", "/", -1)
		p = strings.Replace(p, WORKING_DIRECTORY, "", 1)
		scripts = append(scripts, "/"+p)
		return nil
	})

	return parseTemplate(WORKING_DIRECTORY+"assets/htm/page.htm", map[string]interface{}{
		"constants": map[string]string{
			"Submitted": string(Submitted),
			"Accepted":  string(Accepted),
			"Rejected":  string(Rejected),
		},
		"settings": map[string]string{
			"GoogleClientId":    Settings.GoogleClientId,
			"GoogleRedirectUri": Settings.GoogleRedirectUri,
		},
		"templates": tpls,
		"scripts":   scripts,
	})
}

func handleNotFound(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(404)
	io.WriteString(w, "Not Found")
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth != "Basic "+siteAuth {
		w.Header().Set("WWW-Authenticate", "Basic realm=\"beta\"")
		http.Error(w, "Not Authorized", 401)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/api") {
		http.Error(w, "Unknown method", 404)
		return
	}

	io.WriteString(w, getRoot())
}
