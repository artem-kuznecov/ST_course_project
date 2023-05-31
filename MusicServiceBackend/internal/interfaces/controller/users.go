package controller

import (
	"MusicServiceBackend/internal/interfaces/repository"
	"MusicServiceBackend/internal/model"
	redisCl "MusicServiceBackend/internal/redis"
	"MusicServiceBackend/internal/role"
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/sirupsen/logrus"
	password2 "github.com/vzglad-smerti/password_hash"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

type UserController struct {
	repo  repository.IUsersRepo
	token string
	log   *logrus.Logger
	redis *redisCl.Client
}

type registerResp struct {
	Ok bool `json:"ok"`
}

type JWTClaims struct {
	jwt.StandardClaims
	Id     int      `json:"id"`
	Scopes []string `json:"scopes" json:"scopes"`
	Role   role.Role
}

type loginResp struct {
	ExpiresIn   time.Duration `json:"expires_in"`
	AccessToken string        `json:"access_token"`
	TokenType   string        `json:"token_type"`
	Username    string        `json:"username"`
	Email       string        `json:"email"`
	Role        role.Role     `json:"role"`
}

const jwtPrefix = "Bearer"

func NewUserController(URepo repository.IUsersRepo, token string, log *logrus.Logger, redis *redisCl.Client) *UserController {
	return &UserController{
		repo:  URepo,
		token: token,
		log:   log,
		redis: redis,
	}
}

func (u UserController) Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Allow", http.MethodPost)

	fmt.Printf("register: %s /\n", r.Method)

	var user model.Users
	reqBody, _ := io.ReadAll(r.Body)
	json.Unmarshal(reqBody, &user)

	if user.Password == "" {
		u.log.Warnf("password does not exist")
		reg := &registerResp{
			Ok: false,
		}
		json.NewEncoder(w).Encode(reg)
		return
	}

	if user.Username == "" {
		u.log.Warnf("username does not exist")
		reg := &registerResp{
			Ok: false,
		}
		json.NewEncoder(w).Encode(reg)
		return
	}

	_, err := u.repo.Register(user.Username, user.Password, user.Email)
	if err != nil {
		u.log.Warnf("register user err %s", err)
		reg := &registerResp{
			Ok: false,
		}
		json.NewEncoder(w).Encode(reg)
		return
	}

	reg := &registerResp{
		Ok: true,
	}
	json.NewEncoder(w).Encode(reg)
}

func (u UserController) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Origin", "https://7969-46-160-226-131.ngrok-free.app")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Allow", http.MethodPost)

	fmt.Printf("login: %s /\n", r.Method)

	var user model.Users
	reqBody, _ := io.ReadAll(r.Body)
	json.Unmarshal(reqBody, &user)

	userLogin, err := u.repo.GetUserLogin(user.Username)
	if err != nil {
		u.log.Warnf("User does not exist")
		return
	}

	hash, err := password2.Verify(userLogin.Password, user.Password)
	if err != nil {
		log.Print(err)
	}
	h, _ := time.ParseDuration("12h30m")
	if user.Username == userLogin.Username && hash {
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTClaims{
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().Add(h).Unix(),
				IssuedAt:  time.Now().Unix(),
				Issuer:    "bitop-admin",
			},
			Id:     userLogin.Id,
			Scopes: []string{},
			Role:   userLogin.Role,
		})
		if token == nil {
			u.log.Warnf("token is nil")
			return
		}

		strToken, err := token.SignedString([]byte(u.token))
		if err != nil {
			u.log.Warnf("cant create str token")
			fmt.Printf("login: %s /\n", err)
			return
		}

		res := &loginResp{
			ExpiresIn:   h,
			AccessToken: strToken,
			TokenType:   "Bearer",
			Username:    userLogin.Username,
			Email:       userLogin.Email,
			Role:        userLogin.Role,
		}
		//w.Header().Set("Authorization", "Bearer "+strToken)
		json.NewEncoder(w).Encode(res)
	} else {
		http.Error(w, "", http.StatusUnauthorized)
		errLog := &registerResp{Ok: false}
		json.NewEncoder(w).Encode(errLog)
	}
}

func (u UserController) Logout(w http.ResponseWriter, r *http.Request) {
	jwtStr := r.Header.Get("Authorization")

	if !strings.HasPrefix(jwtStr, jwtPrefix) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	jwtStr = jwtStr[len(jwtPrefix)+1:]
	fmt.Printf("logout: %s /\n", jwtStr)

	_, err := jwt.ParseWithClaims(jwtStr, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("MusicService"), nil
	})
	if err != nil {
		fmt.Println(err)
		return
	}
	h, _ := time.ParseDuration("12h30m")
	err = u.redis.WriteJWTToBlacklist(r.Context(), jwtStr, h)
	if err != nil {
		return
	}
	resp := &registerResp{Ok: true}
	json.NewEncoder(w).Encode(resp)
}
