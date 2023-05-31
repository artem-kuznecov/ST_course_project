package model

type Playlist struct {
	Id     int `json:"id" gorm:"primary_key;auto_increment"`
	UserId int `json:"user_id"`
}
