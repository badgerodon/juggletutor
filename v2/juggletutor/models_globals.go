package main

import (
	"strings"
)

var (
	Globals = struct {
		Families map[string]Family
	}{
		Families: map[string]Family{},
	}
)

func init() {
	families := `
Cascade
	Style: Balls, Clubs
	Count: 3, 5, 7
Fountain
	Style: Balls
	Count: 2, 4, 6, 8, 10
Shower
	Style: Balls
	Count: 3, 4, 5, 6, 7
	Direction: Clockwise, Counter Clockwise
`
	var family Family
	for _, ln := range strings.Split(families, "\n") {
		ln = strings.TrimRight(ln, " \r\n\t")
		// skip blank lines
		if len(ln) == 0 {
			continue
		}
		// attribute
		if strings.HasPrefix(ln, " ") || strings.HasPrefix(ln, "\t") {
			parts := strings.Split(ln, ":")
			attr := strings.Trim(parts[0], " \r\n\t")
			values := strings.Split(parts[1], ",")
			for i, v := range values {
				values[i] = strings.Trim(v, " \r\n\t")
			}
			family.Attributes[attr] = values
			// family
		} else {
			family = Family{
				Name:       ln,
				Attributes: make(map[string][]string),
			}
			Globals.Families[ln] = family
		}
	}

}
