package model

type PlaylistMusic struct {
	MusicId    int    `gorm:"primaryKey" json:"music_id"`
	PlaylistId int    `gorm:"primaryKey" json:"playlist_id"`
	Adedat     string `json:"adedat"`
}
