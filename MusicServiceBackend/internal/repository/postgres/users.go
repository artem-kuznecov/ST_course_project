package postgres

import (
	"MusicServiceBackend/internal/model"
	"MusicServiceBackend/internal/role"
	"fmt"
	password2 "github.com/vzglad-smerti/password_hash"
	"gorm.io/gorm"
	"time"
)

type UserRepo struct {
	db *gorm.DB
}

type userModel struct {
	Id        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
	Role      role.Role `sql:"type:string;"`
	Email     string    `json:"email"`
	CreatedAt string    `json:"created_at"`
}

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db}
}

func (u *UserRepo) Register(username, password, email string) (int, error) {
	hash, err := password2.Hash(password)
	if err != nil {
		fmt.Println(err)
	}
	currentTime := time.Now()
	uModel := &userModel{
		Username:  username,
		Password:  hash,
		Role:      role.User,
		Email:     email,
		CreatedAt: currentTime.Format("01-02-2006"),
	}
	resultUser := u.db.Table("users").Create(&uModel)
	if resultUser.Error != nil {
		return -1, fmt.Errorf("db: %w", resultUser.Error)
	}
	pModel := &model.Playlist{
		UserId: uModel.Id,
	}
	resultPlaylist := u.db.Table("playlist").Create(&pModel)
	if resultPlaylist.Error != nil {
		return -1, fmt.Errorf("db: %w", resultPlaylist.Error)
	}

	return 1, nil
}

func (u *UserRepo) GetUserLogin(username string) (*model.Users, error) {
	user := &model.Users{
		Username: username,
	}
	err := u.db.First(user, "username = ?", user.Username).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}
