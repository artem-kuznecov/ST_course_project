package role

type Role int

const (
	User      Role = iota // 0
	Moderator             // 1
	Artist                // 2
)
