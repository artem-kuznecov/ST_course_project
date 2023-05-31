package controller

import (
	"MusicServiceBackend/internal/interfaces/repository"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type respCr struct {
	Ok              bool   `json:"ok"`
	CreateComponent string `json:"create_component"`
}

type MusicController struct {
	repo repository.IMusicRepo
	log  *logrus.Logger
	grpc *grpc.ClientConn
}

func NewMusicController(MRepo repository.IMusicRepo, log *logrus.Logger, grpc *grpc.ClientConn) *MusicController {
	return &MusicController{
		repo: MRepo,
		log:  log,
		grpc: grpc,
	}
}

func (m *MusicController) GetAll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	fmt.Printf("music: %s /\n", r.Method)
	search := r.URL.Query().Get("search")
	if search != "" {
		s, err := m.repo.GetOneMusic(search)
		if err != nil {
			fmt.Fprintf(w, "Ошибка: данных для вывода нет")
			return
		}
		json.NewEncoder(w).Encode(s)
		return
	}
	res, err := m.repo.GetMusic()
	if err != nil {
		fmt.Fprintf(w, "Ошибка: данных для вывода нет")
		return
	}

	json.NewEncoder(w).Encode(res)

	//m.log.Infof("got music")
	return
}

func (m *MusicController) CreateMusic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Origin", "http://127.0.0.1:3000")
	w.Header().Set("Allow", http.MethodPost)
	fmt.Printf("music: %s /\n", r.Method)

	jwtStr := r.Header.Get("Authorization")
	if !strings.HasPrefix(jwtStr, jwtPrefix) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	jwtStr = jwtStr[len(jwtPrefix)+1:]
	token, errT := jwt.ParseWithClaims(jwtStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("MusicService"), nil
	})
	if errT != nil {
		log.Println(errT)
		return
	}

	myClaims := token.Claims.(*JWTClaims)

	errParse := r.ParseMultipartForm(32 << 20)
	if errParse != nil {
		http.Error(w, errParse.Error(), http.StatusBadRequest)
		return
	}

	file, handler, errFile := r.FormFile("file")
	if errFile != nil {
		http.Error(w, errFile.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	f, errOpen := os.OpenFile(handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if errOpen != nil {
		http.Error(w, errOpen.Error(), http.StatusInternalServerError)
	}
	fmt.Println(handler.Size)
	defer f.Close()

	_, errCopy := io.Copy(f, file)
	if errCopy != nil {
		http.Error(w, errCopy.Error(), http.StatusInternalServerError)
		return
	}

	_, err := m.repo.CreateMusic(r.FormValue("title"), r.FormValue("img"), myClaims.Id, handler.Filename, m.grpc)
	if err != nil {
		m.log.Warnf("create music err %s", err)
		return
	}

	e := os.Remove(handler.Filename)
	if e != nil {
		log.Fatal(e)
	}

	resp := &respCr{
		Ok:              true,
		CreateComponent: r.FormValue("title"),
	}
	json.NewEncoder(w).Encode(resp)
}

func (m *MusicController) DeleteMusic(w http.ResponseWriter, r *http.Request) {
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
	_, errRes := m.repo.DeleteMusic(ID, m.grpc)
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

func (m *MusicController) GetOne(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")

	search := r.URL.Query().Get("search")
	if search != "" {
		s, err := m.repo.GetOneMusic(search)
		if err != nil {
			fmt.Fprintf(w, "Ошибка: данных для вывода нет")
			return
		}
		json.NewEncoder(w).Encode(s)
	}
}
