# Курсовой проект "Облачный музыкальный сервис"
Проект выполнялся в команде из трёх человек.
Задача: разработать распределенную систему доступа к облачному хранилищу музыкальных треков с возможностью прослушивания и удаления существующих композиций и добавления новых.

[Макет в Figma](https://www.figma.com/file/Xcmeyus8kB8rQEaBQdNM9J/KR-Maket?type=design&node-id=4662:14&t=MvdNZit3uVTMA6No-1)

Система предусматривает 4 типа пользователей:
 - **слушатель** (может прослушивать треки и добавлять их в плейлист "Избранные", а также просматривать информацию о своем аккаунте)
 - **автор** (может добавлять новые треки в хранилище средствами веб-приложения, в разделе "Плейлист" может видит список всех своих треков)
 - **модератор** (может прослушивать все треки из медиатеки, при необходимости удалять их из хранилища средствами веб-приложения; не имеет доступа к странице "Плейлист")
 - **администратор базы данных** (имеет прямой доступ к содержимому базы данных, не взаимодействует с веб-приложением)
 
 Взаимодействие фронтенда с бекендом происходит путем отправки HTTP-запросов, бекенд с S3 сервером взаимодействует по gRPC.

## Стек для каждой части проекта:

 1)  **Фронтенд**:
 - JavaScript
 - React
 - Redux, Redux Toolkit
 - Axios
 - MUI (Material UI)
 2)  **Бекенд**:
 - GoLang
 - PostgreSQL
 - Redis
 - JWT
 3)  **Интеграция**:
 - docker
 - docker-compose
 - Python
 - S3 Minio
 - Nginx

## Развертывание системы:
1) **Интеграция**:
- перейти в папку music_grpc
- выполнить `pip install -r requirements.txt`
- перейти в папку S3
- выполнить `docker compose up`
- перейти в папку music_grpc
- выполнить `python/python3 server.py`

  сервер запустится на порте 50051

2) **Бекенд**:
- перейти в MusicServiceBackend
- установить все необходимые пакеты, выполнив 
 `go get(install) <package_name>`
  Список пакетов:
  
	github.com/golang-jwt/jwt,
  
	github.com/gorilla/mux,
  
	github.com/redis/go-redis/v9,
  
	github.com/sirupsen/logrus,
  
	github.com/spf13/viper,
  
	github.com/vzglad-smerti/password_hash,
  
	(install) google.golang.org/protobuf/cmd/protoc-gen-go,
  
	(install) google.golang.org/grpc/cmd/protoc-gen-go-grpc,
  
	get gorm.io/driver/postgres,
  
	get gorm.io/gorm,
  
- обновить GOPATH, выполнив 
	`export PATH="<global_path_to_go>"`
- перейти в deployments
- выполнить `docker compose up --build`
- выполнить `docker compose up -d`
- выполнить `go run MusicServiceBackend/cmd/app/main.go`

	сервер запустится на порте 8080
3) **Фронтенд (веб-приложение)**:
- перейти в front
- установить все необходимые пакеты, выполнив  `npm install`
- выполнить `npm run start`

	сервер приложения запустится на порте 3000
