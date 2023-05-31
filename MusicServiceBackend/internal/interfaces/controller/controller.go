package controller

import (
	"net/http"
)

type IMusicController interface {
	GetAll(w http.ResponseWriter, r *http.Request)
	GetOne(w http.ResponseWriter, r *http.Request)
	CreateMusic(w http.ResponseWriter, r *http.Request)
	DeleteMusic(w http.ResponseWriter, r *http.Request)
}

type IUsersController interface {
	Register(w http.ResponseWriter, r *http.Request)
	Login(w http.ResponseWriter, r *http.Request)
	Logout(w http.ResponseWriter, r *http.Request)
}

type IPlaylistController interface {
	GetAll(w http.ResponseWriter, r *http.Request)
	AddMusicToPlaylist(w http.ResponseWriter, r *http.Request)
	DeleteMusicFromPlaylist(w http.ResponseWriter, r *http.Request)
}
