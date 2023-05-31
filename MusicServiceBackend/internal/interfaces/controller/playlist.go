package controller

import (
	"MusicServiceBackend/internal/interfaces/repository"
	"MusicServiceBackend/internal/model"
	"MusicServiceBackend/internal/role"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type respDel struct {
	Ok           bool `json:"ok"`
	Delcomponent int  `json:"del_component"`
	User         int  `json:"user"`
}

type respAdd struct {
	Ok           bool `json:"ok"`
	Addcomponent int  `json:"add_component"`
	User         int  `json:"user"`
}

type PlaylistController struct {
	repo repository.IPlaylistRepo
	log  *logrus.Logger
}

func NewPlaylistController(PRepo repository.IPlaylistRepo, log *logrus.Logger) *PlaylistController {
	return &PlaylistController{
		repo: PRepo,
		log:  log,
	}
}

func (p *PlaylistController) GetAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	fmt.Printf("playlist: %s /\n", r.Method)
	jwtStr := r.Header.Get("Authorization")
	if !strings.HasPrefix(jwtStr, jwtPrefix) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	jwtStr = jwtStr[len(jwtPrefix)+1:]
	token, err := jwt.ParseWithClaims(jwtStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("MusicService"), nil
	})
	if err != nil {
		log.Println(err)
		return
	}

	myClaims := token.Claims.(*JWTClaims)
	if myClaims.Role != role.Artist {
		res, err := p.repo.GetPlaylist(myClaims.Id)
		if err != nil {
			fmt.Fprintf(w, "Ошибка: данных для вывода нет")
			return
		}
		json.NewEncoder(w).Encode(res)
	} else {
		res, err := p.repo.GetPlaylistArtist(myClaims.Id)
		if err != nil {
			fmt.Fprintf(w, "Ошибка: данных для вывода нет")
			return
		}
		json.NewEncoder(w).Encode(res)
	}
	p.log.Infof("got playlist")
	return
}

func (p *PlaylistController) AddMusicToPlaylist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Allow", http.MethodPost)
	fmt.Printf("playlist: %s /\n", r.Method)
	jwtStr := r.Header.Get("Authorization")
	if !strings.HasPrefix(jwtStr, jwtPrefix) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	jwtStr = jwtStr[len(jwtPrefix)+1:]
	token, err := jwt.ParseWithClaims(jwtStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("MusicService"), nil
	})
	if err != nil {
		log.Println(err)
		return
	}

	myClaims := token.Claims.(*JWTClaims)

	var pm model.PlaylistMusic

	reqBody, _ := io.ReadAll(r.Body)
	json.Unmarshal(reqBody, &pm)

	res, err := p.repo.GetIdPlaylist(myClaims.Id)
	if err != nil {
		p.log.Warnf("User does not exist")
		return
	}

	_, errCr := p.repo.AddMusicToPlaylist(pm.MusicId, res.Id)
	if errCr != nil {
		p.log.Warnf("create music err %s", errCr)
		return
	}
	resp := &respAdd{
		Ok:           true,
		Addcomponent: pm.MusicId,
		User:         myClaims.Id,
	}
	json.NewEncoder(w).Encode(resp)
}

func (p *PlaylistController) DeleteMusicFromPlaylist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	vars := mux.Vars(r)
	id := vars["id"]
	jwtStr := r.Header.Get("Authorization")
	if !strings.HasPrefix(jwtStr, jwtPrefix) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	jwtStr = jwtStr[len(jwtPrefix)+1:]
	token, err := jwt.ParseWithClaims(jwtStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("MusicService"), nil
	})
	if err != nil {
		log.Println(err)
		return
	}

	myClaims := token.Claims.(*JWTClaims)
	ID, err := strconv.Atoi(id)
	if err != nil {
		panic(err)
	}
	res, err := p.repo.GetIdPlaylist(myClaims.Id)
	if err != nil {
		p.log.Warnf("User does not exist")
		return
	}
	_, errRes := p.repo.DeleteMusicFromPlaylist(ID, res.Id)
	if errRes != nil {
		log.Println(errRes)
	}
	resp := &respDel{
		Ok:           true,
		Delcomponent: ID,
		User:         myClaims.Id,
	}
	json.NewEncoder(w).Encode(resp)
}
