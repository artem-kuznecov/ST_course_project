package model

type MusicForCreate struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Author int    `json:"author"`
	File   string `json:"file"`
	Img    string `json:"img"`
	Adedat string `json:"adedat"`
}
