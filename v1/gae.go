package main

import (
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var (
	indexHTML string
	testHTML  string
)

func init() {
	testHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>Juggle Tutor Tests</title>
	  <link rel="stylesheet" href="//code.jquery.com/qunit/qunit-1.17.1.css">
  </head>
  <body>
	  <div id="qunit"></div>
	  <div id="qunit-fixture"></div>
	  <script src="//code.jquery.com/qunit/qunit-1.17.1.js"></script>
		<script src=//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.3.11/seedrandom.min.js></script>
`

	indexHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>Juggle Tutor</title>
		<link href="/build/juggletutor.css" rel="stylesheet">
  </head>
  <body>
		<script src="/build/juggletutor.js"></script>
`

	filepath.Walk("static/js", func(p string, fi os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !fi.IsDir() {
			bs, err := ioutil.ReadFile(p)
			if err != nil {
				return err
			}
			if !strings.HasSuffix(p, "main.js") {
				testHTML += "<script>\n" + string(bs) + "\n//@ sourceURL=" + p + "\n</script>\n"
			}
			if !strings.HasSuffix(p, "_tests.js") {
				//indexHTML += "<script>\n" + string(bs) + "\n//@ sourceURL=" + p + "\n</script>\n"
			}
		}
		return nil
	})

	indexHTML += `
  </body>
</html>
`

	http.Handle("/build/", http.StripPrefix("/build/", http.FileServer(http.Dir("build"))))
	http.Handle("/", http.HandlerFunc(ServeIndex))
}

func ServeIndex(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "text/html")
	if req.URL.Path == "/qunit_tests" {
		io.WriteString(res, testHTML)
	} else {
		io.WriteString(res, indexHTML)
	}
}
