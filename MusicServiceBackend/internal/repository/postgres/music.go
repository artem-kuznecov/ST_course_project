package postgres

import (
	"MusicServiceBackend/internal/model"
	pb "MusicServiceBackend/internal/protos"
	"context"
	"fmt"
	"google.golang.org/grpc"
	"gorm.io/gorm"
	"io"
	"log"
	"os"
	"time"
)

type MusicRepo struct {
	db *gorm.DB
}

type musicModel struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Author int    `json:"author"`
	File   string `json:"file"`
	Img    string `json:"img"`
	Adedat string `json:"adedat"`
}

func NewMusicRepo(db *gorm.DB) *MusicRepo {
	return &MusicRepo{db}
}

func (m *MusicRepo) GetMusic() ([]model.Music, error) {
	var res []model.Music
	result := m.db.Raw("SELECT music.id, music.title, users.username, music.file, music.img, music.adedat  FROM music JOIN users ON users.id = music.author").Scan(&res)
	if result.Error != nil {
		return nil, fmt.Errorf("db: %w", result.Error)
	}
	return res, nil
}

func (m *MusicRepo) CreateMusic(title, img string, author int, file string, grpc *grpc.ClientConn) (int, error) {

	c := pb.NewMusicClient(grpc)
	ctx2, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	ctx, cancel := context.WithDeadline(ctx2, time.Now().Add(40*time.Second))
	defer cancel()

	r, err := c.AddMusic(ctx)
	if err != nil {
		fmt.Printf("could not greet2: %v", err)
	}

	errM := r.Send(&pb.AddMusicRequest{Request: &pb.AddMusicRequest_Metadata{Metadata: &pb.MetaData{Extension: ".mp3", Filename: title}}})
	if errM != nil {
		fmt.Printf("could not greet: %v", errM)
	}
	fmt.Println(file)

	fileQ, errFile := os.Open(file)
	if errFile != nil {
		log.Fatal(errFile)
	}
	defer fileQ.Close()

	buf := make([]byte, 1024)
	for {
		num, errN := fileQ.Read(buf)
		if errN == io.EOF {
			break
		}
		if errN != nil {
			fmt.Println(errN)
		}

		errC := r.Send(&pb.AddMusicRequest{Request: &pb.AddMusicRequest_ChunkData{ChunkData: buf[:num]}})
		if errC != nil {
			fmt.Printf("could not greet3: %v", errC)
		}
	}

	resp, err := r.CloseAndRecv()
	if err != nil {
		fmt.Printf("85: %s", err)
	}

	fmt.Printf("Greeting: %s", resp.Status)

	currentTime := time.Now()
	mModel := &musicModel{
		Title:  title,
		Author: author,
		File:   resp.Url,
		Img:    img,
		Adedat: currentTime.Format("01-02-2006"),
	}

	result := m.db.Table("music").Create(&mModel)
	if result.Error != nil {
		return -1, fmt.Errorf("db: %w", result.Error)
	}
	return 1, nil
}

func (m *MusicRepo) DeleteMusic(ID int, grpc *grpc.ClientConn) (int, error) {
	var mus []model.Music

	music := &model.Music{
		Id: ID,
	}
	err := m.db.Table("music").First(music, "music.id = ?", music.Id).Error
	if err != nil {
		return -1, err
	}

	result := m.db.Table("music").Where("id = ?", ID).Delete(&mus)
	if result.Error != nil {
		return -1, fmt.Errorf("db: %w", result.Error)
	}
	c := pb.NewMusicClient(grpc)
	ctx2, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	ctx, cancel := context.WithDeadline(ctx2, time.Now().Add(10*time.Second))
	defer cancel()

	r, err := c.RemoveMusic(ctx, &pb.RemoveMusicRequest{Uuid: music.Title + ".mp3"})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	log.Printf("Greeting: %s", r)

	return ID, nil
}

func (m *MusicRepo) GetOneMusic(search string) ([]model.Music, error) {
	var res []model.Music
	s := search + "%"
	resultT := m.db.Raw("SELECT music.id, music.title, users.username, music.file, music.img, music.adedat  FROM music JOIN users ON users.id = music.author WHERE music.title ILIKE ?", s).Scan(&res)

	if resultT.Error != nil {
		return nil, fmt.Errorf("db: %w", resultT.Error)
	}

	if resultT.RowsAffected == 0 {
		resultA := m.db.Raw("SELECT music.id, music.title, users.username, music.file, music.img, music.adedat  FROM music JOIN users ON users.id = music.author WHERE users.username ILIKE ?", s).Scan(&res)
		if resultA.Error != nil {
			return nil, fmt.Errorf("db: %w", resultA.Error)
		}

		if resultA.RowsAffected == 0 {
			resultI := m.db.Raw("SELECT music.id, music.title, users.username, music.file, music.img, music.adedat  FROM music JOIN users ON users.id = music.author WHERE music.id = ?", search).Scan(&res)
			if resultI.Error != nil {
				return nil, fmt.Errorf("db: %w", resultI.Error)
			}
		}

	}
	return res, nil

}
