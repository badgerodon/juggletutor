package main

import (
	"crypto/hmac"
	"crypto/sha1"
	"fmt"
	"strings"
	"time"
)

func Sign(message string) string {
	tm := fmt.Sprintf("%x", time.Now().Unix())
	h := hmac.New(sha1.New, []byte(Settings.SecretKey))
	h.Write([]byte(tm))
	h.Write([]byte(message))
	signature := h.Sum(nil)
	return fmt.Sprintf("%x:%v", signature, tm)
}

func Verify(message, key string) bool {
	parts := strings.SplitN(key, ":", 2)
	if len(parts) < 2 {
		return false
	}

	signature := parts[0]
	tm := parts[1]

	h := hmac.New(sha1.New, []byte(Settings.SecretKey))
	h.Write([]byte(tm))
	h.Write([]byte(message))
	realSignature := h.Sum(nil)

	return signature == fmt.Sprintf("%x", realSignature)
}
