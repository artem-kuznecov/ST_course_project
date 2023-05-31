package postgres

import (
	"MusicServiceBackend/internal/model"
	"fmt"
	"gorm.io/gorm"
	"time"
)

type PlaylistRepo struct {
	db *gorm.DB
}

func NewPlaylistRepo(db *gorm.DB) *PlaylistRepo {
	return &PlaylistRepo{db}
}

func (p *PlaylistRepo) GetPlaylist(userId int) ([]model.Musicforplaylist, error) {
	var pl []model.Musicforplaylist
	result := p.db.Table("playlist_music").Select("music.id, music.title, users.username, music.file, music.img").Joins("JOIN music ON music.id = playlist_music.music_id ").Joins("JOIN playlist ON playlist.id = playlist_music.playlist_id").Joins("JOIN users ON users.id = music.author").Where("playlist.user_id = $1", userId).Scan(&pl)
	if result.Error != nil {
		fmt.Printf("db: %w", result.Error)
		return nil, result.Error
	}
	if len(pl) == 0 {
		return nil, nil
	}
	return pl, nil
}

func (p *PlaylistRepo) GetPlaylistArtist(artistId int) ([]model.Musicforplaylist, error) {
	var pl []model.Musicforplaylist
	result := p.db.Table("music").Select("music.id, music.title, users.username, music.file, music.img").Joins("JOIN users ON users.id = music.author").Where("users.id = $1", artistId).Scan(&pl)
	if result.Error != nil {
		fmt.Printf("db: %w", result.Error)
		return nil, result.Error
	}
	if len(pl) == 0 {
		return nil, nil
	}
	return pl, nil
}

func (p *PlaylistRepo) AddMusicToPlaylist(musicID, playlistID int) (int, error) {
	currentTime := time.Now()
	mModel := &model.PlaylistMusic{
		MusicId:    musicID,
		PlaylistId: playlistID,
		Adedat:     currentTime.Format("01-02-2006"),
	}
	result := p.db.Table("playlist_music").Create(&mModel)
	if result.Error != nil {
		return -1, fmt.Errorf("db: %w", result.Error)
	}
	return 1, nil
}

func (p *PlaylistRepo) GetIdPlaylist(userId int) (*model.Playlist, error) {
	playlist := &model.Playlist{
		UserId: userId,
	}
	err := p.db.Table("playlist").First(playlist, "user_id = ?", playlist.UserId).Error
	if err != nil {
		return nil, err
	}
	return playlist, nil

}

func (p *PlaylistRepo) DeleteMusicFromPlaylist(musicID, userId int) (int, error) {
	var playlist []model.PlaylistMusic
	result := p.db.Table("playlist_music").Where("music_id = ?", musicID).Where("playlist_id = ?", userId).Delete(&playlist)
	if result.Error != nil {
		return -1, fmt.Errorf("db: %w", result.Error)
	}
	return 1, nil
}
