package model

import (
	"MusicServiceBackend/internal/role"
)

type Users struct {
	Id        int       `json:"id" gorm:"primary_key;auto_increment"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
	Role      role.Role `sql:"type:string;"`
	Email     string    `json:"email"`
	CreatedAt string    `json:"created_at"`
}
