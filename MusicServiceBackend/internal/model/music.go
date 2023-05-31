package model

type Music struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	Username string `json:"author"`
	File     string `json:"file"`
	Img      string `json:"img"`
	Adedat   string `json:"adedat"`
}
