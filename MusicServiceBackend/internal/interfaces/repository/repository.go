package repository

import (
	"MusicServiceBackend/internal/model"
	"google.golang.org/grpc"
)

type IMusicRepo interface {
	GetMusic() ([]model.Music, error)
	GetOneMusic(search string) ([]model.Music, error)
	CreateMusic(title, img string, author int, file string, grpc *grpc.ClientConn) (int, error)
	DeleteMusic(ID int, grpc *grpc.ClientConn) (int, error)
}

type IUsersRepo interface {
	Register(username, password, email string) (int, error)
	GetUserLogin(username string) (*model.Users, error)
}

type IPlaylistRepo interface {
	GetPlaylist(userId int) ([]model.Musicforplaylist, error)
	GetPlaylistArtist(artistId int) ([]model.Musicforplaylist, error)
	AddMusicToPlaylist(musicID, playlistID int) (int, error)
	GetIdPlaylist(userId int) (*model.Playlist, error)
	DeleteMusicFromPlaylist(musicID, userId int) (int, error)
}
