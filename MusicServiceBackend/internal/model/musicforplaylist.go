package model

type Musicforplaylist struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	Username string `json:"author"`
	File     string `json:"file"`
	Img      string `json:"img"`
}
