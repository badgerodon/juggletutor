package main

import (
	"encoding/json"
	"sort"

	"appengine/datastore"
	"appengine/memcache"
)

const (
	setKeyLength = 5
)

type (
	setKey          [setKeyLength]int
	attributeRecord struct {
		idx    int
		values map[string]int
	}
	Attributes struct {
		Values [][]string
		Sets   [][]int

		request     *Request
		valueLookup map[string]attributeRecord
		setLookup   map[setKey]int
	}
)

func (this *Request) GetCachedAttributes() (*Attributes, error) {
	bs, err := memcache.Get(this.context, "Attributes")
	if err != nil {
		return nil, err
	}
	var attributes Attributes
	err = json.Unmarshal(bs.Value, &attributes)
	attributes.request = this
	return &attributes, err
}

func (this *Request) GetAttributes() (*Attributes, error) {
	attributes := &Attributes{
		Values: make([][]string, 0),
		Sets:   make([][]int, 0),

		request:     this,
		valueLookup: make(map[string]attributeRecord),
		setLookup:   make(map[setKey]int),
	}
	var video Video

	q := datastore.NewQuery("Video")
	q = q.Filter("Status=", "Approved")
	it := q.Run(this.context)
	for {
		_, err := it.Next(&video)
		if err == datastore.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		attributes.update(video.Attributes)
	}
	return attributes, nil
}

func (this *Attributes) Update(values map[string]string) error {
	if this.valueLookup == nil {
		this.init()
	}
	this.update(values)
	return this.save()
}

func (this *Attributes) init() {
	this.valueLookup = make(map[string]attributeRecord)
	for i, vs := range this.Values {
		name := vs[0]
		this.valueLookup[name] = attributeRecord{
			idx:    i,
			values: make(map[string]int),
		}
		for j := 1; j < len(vs); j++ {
			this.valueLookup[name].values[vs[j]] = j
		}
	}
	this.setLookup = make(map[setKey]int)
	for i, set := range this.Sets {
		var key setKey
		copy(key[:], set)
		this.setLookup[key] = i
	}
}

func (this *Attributes) getSet(values map[string]string) (setKey, []int) {
	keys := make([]string, 0, len(values))
	for k, _ := range values {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	var set setKey
	for _, k := range keys {
		attr, ok := this.valueLookup[k]
		if !ok {
			continue
		}
		idx, ok := attr.values[values[k]]
		if !ok {
			continue
		}
		set[attr.idx] = idx
	}
	return set, set[:]
}

func (this *Attributes) update(values map[string]string) {
	for k, v := range values {
		attr, ok := this.valueLookup[k]
		if !ok {
			attr = attributeRecord{
				idx:    len(this.valueLookup),
				values: make(map[string]int),
			}
			this.valueLookup[k] = attr
			this.Values = append(this.Values, []string{k})
		}
		idx, ok := attr.values[v]
		if !ok {
			idx = len(attr.values) + 1
			attr.values[v] = idx
			this.Values[attr.idx] = append(this.Values[attr.idx], v)
		}
	}
	key, set := this.getSet(values)
	idx, ok := this.setLookup[key]
	if !ok {
		idx = len(this.setLookup)
		this.setLookup[key] = idx
		this.Sets = append(this.Sets, set)
	}
}
func (this *Attributes) save() error {
	bs, err := json.Marshal(this)
	if err != nil {
		return err
	}
	err = memcache.Set(this.request.context, &memcache.Item{
		Key:   "Attributes",
		Value: bs,
	})
	return err
}
