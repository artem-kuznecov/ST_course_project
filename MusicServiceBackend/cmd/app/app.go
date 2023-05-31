package main

import (
	"MusicServiceBackend/internal/interfaces/controller"
	redisCL "MusicServiceBackend/internal/redis"
	postgres2 "MusicServiceBackend/internal/repository/postgres"
	"MusicServiceBackend/internal/role"
	"context"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
	easy "github.com/t-tomalak/logrus-easy-formatter"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"io"
	"net/http"
	"os"
)

type Application struct {
	musicController    controller.IMusicController
	userController     controller.IUsersController
	playlistController controller.IPlaylistController
	redis              *redisCL.Client
	grpc               *grpc.ClientConn
	logFile            *logrus.Logger
}

func NewApp(ctx context.Context) (*Application, error) {
	cfg, err := initConfig()
	if err != nil {
		return nil, err
	}

	f, err := os.OpenFile("log.txt", os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return nil, err
	}

	log := logrus.Logger{
		Out: io.Writer(f),
		Formatter: &easy.Formatter{
			TimestampFormat: "2006-01-02 15:04:05",
			LogFormat:       "[%lvl%]: %time% - %msg%\n",
		},
		Level: logrus.Level(cfg.Logger.Level),
	}
	// Запуск postgreSQL
	dsn := "host=%s user=%s password=%s dbname=%s sslmode=%s port=%d"
	dsn = fmt.Sprintf(dsn, cfg.DB.Host, cfg.DB.Username, cfg.DB.Password, cfg.DB.DBName, cfg.DB.SSLMode, cfg.DB.Port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("DB can't connect: %s", err)
		return nil, err
	}
	log.Printf("PostgreSQL запущена на localhost:5432 \n")

	//Запуск redis
	redisClient, err := redisCL.New(ctx)
	if err != nil {
		log.Fatalf("redis can't connect: %s", err)
		return nil, err
	}
	log.Printf("Redis запущен на localhost:6379 \n")

	//Запуск клиента gRPC
	cg, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
		return nil, err
	}
	defer cg.Close()
	log.Printf("Клиент gRPC подключен к серверу на %s \n", cg.Target())

	mRepo := postgres2.NewMusicRepo(db)
	uRepo := postgres2.NewUserRepo(db)
	pRepo := postgres2.NewPlaylistRepo(db)
	mc := controller.NewMusicController(mRepo, &log, cg)
	uc := controller.NewUserController(uRepo, "MusicService", &log, redisClient)
	pc := controller.NewPlaylistController(pRepo, &log)

	app := &Application{
		musicController:    mc,
		userController:     uc,
		playlistController: pc,
		redis:              redisClient,
		grpc:               cg,
		logFile:            &log,
	}

	router := mux.NewRouter()

	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{
			http.MethodPost,
			http.MethodGet,
			http.MethodDelete,
		},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})

	router.Use(mux.CORSMethodMiddleware(router))

	playlist := router.Methods("GET", "POST", "DELETE").Subrouter()
	playlist.Handle("/playlist", app.WithAuthCheck(http.HandlerFunc(app.playlistController.GetAll), role.Artist, role.User)).Methods("GET")
	playlist.Handle("/playlist", app.WithAuthCheck(http.HandlerFunc(app.playlistController.AddMusicToPlaylist), role.User)).Methods("POST")
	playlist.Handle("/playlist/{id:[0-9]+}", app.WithAuthCheck(http.HandlerFunc(app.playlistController.DeleteMusicFromPlaylist), role.User)).Methods("DELETE")
	music := router.Methods("POST", "DELETE").Subrouter()
	music.Handle("/music", app.WithAuthCheck(http.HandlerFunc(app.musicController.CreateMusic), role.Artist)).Methods("POST")
	music.Handle("/music/{id:[0-9]+}", app.WithAuthCheck(http.HandlerFunc(app.musicController.DeleteMusic), role.Moderator)).Methods("DELETE")
	router.HandleFunc("/music", app.musicController.GetAll).Methods("GET")
	//router.HandleFunc("/music", app.musicController.CreateMusic).Methods("POST")
	//router.HandleFunc("/music{search}", app.musicController.GetOne).Methods("GET")
	router.HandleFunc("/signup", app.userController.Register).Methods("POST")
	router.HandleFunc("/signin", app.userController.Login).Methods("POST")
	router.HandleFunc("/signout", app.userController.Logout).Methods("POST")

	log.Println("Запуск сервера на localhost:8080")
	handler := cors.Handler(router)
	errMux := http.ListenAndServe(":8080", handler)
	if errMux != nil {
		log.Fatalf("There's an error with the server, %s", errMux)
	}

	return app, nil
}
