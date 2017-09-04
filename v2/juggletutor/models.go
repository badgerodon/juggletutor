package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"appengine/datastore"
	"github.com/golibs/uuid"
)

type (
	Status           string
	Attributes       map[int]int
	AttributeOptions map[int][]int
	Json             struct{ Value []byte }

	User struct {
		Id      string
		Name    string
		Picture string
		Type    string
	}
	Demonstration struct {
		Id            string
		UserId        string
		Family        string
		Attributes    map[string]string
		DateSubmitted time.Time
		Status        Status
	}
	Lesson struct {
		Id            string
		UserId        string
		Family        string
		Attributes    map[string]string
		Text          string
		DateSubmitted time.Time
		Status        Status
	}

	Family struct {
		Name       string
		Attributes map[string][]string
	}
)

const (
	Submitted Status = "Submitted"
	Accepted  Status = "Accepted"
	Rejected  Status = "Rejected"
)

func GenerateId() string {
	return uuid.Rand().Hex()
}

func NewAttributes(str string) Attributes {
	attributes := map[int]int{}

	for _, s := range strings.Split(str, "|") {
		kv := strings.SplitN(s, ":", 2)
		if len(kv) == 2 {
			k, err := strconv.Atoi(kv[0])
			if err != nil {
				continue
			}
			v, err := strconv.Atoi(kv[1])
			if err != nil {
				continue
			}
			attributes[k] = v
		}
	}

	return Attributes(attributes)
}
func (this Attributes) String() string {
	keys := make([]int, 0, len(this))
	for k, _ := range this {
		keys = append(keys, k)
	}
	sort.Ints(keys)

	str := ""
	for i, k := range keys {
		if i > 0 {
			str += "|"
		}
		str += fmt.Sprint(k, ":", this[k])
	}
	return str
}
func NewAttributeOptions(str string) AttributeOptions {
	attributeOptions := map[int][]int{}

	for _, s := range strings.Split(str, "|") {
		kv := strings.SplitN(s, ":", 2)
		if len(kv) == 2 {
			k, err := strconv.Atoi(kv[0])
			if err != nil {
				continue
			}
			vs := make([]int, 0)
			for _, sv := range strings.Split(kv[1], ",") {
				v, err := strconv.Atoi(sv)
				if err != nil {
					continue
				}
				vs = append(vs, v)
			}
			attributeOptions[k] = vs
		}
	}

	return AttributeOptions(attributeOptions)
}
func (this AttributeOptions) String() string {
	str := ""
	keys := make([]int, len(this))
	for k, _ := range this {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for i, k := range keys {
		if i > 0 {
			str += "|"
		}
		str += fmt.Sprint(k, ":")
		vs := this[k]
		sort.Ints(vs)
		for j, v := range vs {
			if j > 0 {
				str += ","
			}
			str += fmt.Sprint(v)
		}
	}
	return str
}

// Create a new demonstration
func (this *Request) CreateDemonstration(demonstration Demonstration) error {
	key := datastore.NewKey(this.context, "Demonstration", GenerateId(), 0, nil)
	_, err := datastore.Put(this.context, key, &demonstration)
	return err
}

// Create a new user
func (this *Request) CreateUser(user User) error {
	key := datastore.NewKey(this.context, "User", user.Id, 0, nil)
	_, err := datastore.Put(this.context, key, &user)
	return err
}

func (this *Request) GetFamilies() ([]Family, error) {
	var families []Family
	_, err := datastore.NewQuery("Family").GetAll(this.context, &families)
	return families, err
}

// Get all the demonstrations for a family
func (this *Request) GetFamilyDemonstrations(familyId int, attributes Attributes) ([]Demonstration, error) {
	var demonstrations []Demonstration
	q := datastore.NewQuery("Demonstration")
	q = q.Filter("FamilyId=", familyId)
	for k, v := range attributes {
		q = q.Filter(fmt.Sprint("Attribute[%v]=", k), v)
	}
	_, err := q.GetAll(this.context, &demonstrations)
	return demonstrations, err
}

// Get a user
func (this *Request) GetUser(id string) (User, error) {
	var user User
	key := datastore.NewKey(this.context, "User", id, 0, nil)
	err := datastore.Get(this.context, key, &user)
	return user, err
}

func (this *Request) GetUsers(limit, offset int, order string) ([]User, int, error) {
	users := []User{}
	q := datastore.NewQuery("User")
	n, err := q.Count(this.context)
	if err != nil {
		return users, n, err
	}
	q = q.Limit(limit)
	q = q.Offset(offset)
	q = q.Order(order)
	_, err = q.GetAll(this.context, &users)
	return users, n, err
}

// Get all the demonstrations for a user
func (this *Request) GetUserDemonstrations(userId string) ([]Demonstration, error) {
	demonstrations := []Demonstration{}
	_, err := datastore.NewQuery("Demonstration").
		Filter("UserId=", userId).
		GetAll(this.context, &demonstrations)
	return demonstrations, err
}

// Update a user
func (this *Request) UpdateUser(user User) error {
	key := datastore.NewKey(this.context, "User", user.Id, 0, nil)
	_, err := datastore.Put(this.context, key, &user)
	return err
}
