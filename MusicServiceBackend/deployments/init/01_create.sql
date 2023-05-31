--DROP DATABASE IF EXISTS "MusicService";

CREATE TABLE users
(
    Id serial primary key,
    Username varchar(40) not null,
    Password varchar(255) not null,
    Role int not null,
    Email varchar(60) not null,
    Created_At date
);

CREATE TABLE music
(
    Id serial primary key,
    Title varchar(40),
    Author integer,
    AdedAt date,
    file varchar(10485760),
    img varchar(100),
    FOREIGN KEY (Author) REFERENCES users (Id)
);

CREATE TABLE playlist
(
    Id serial primary key,
    user_id integer not null unique,
    FOREIGN KEY (user_id)  REFERENCES users (Id)
);

CREATE TABLE playlist_music
(
    music_id integer not null references music  ON DELETE CASCADE,
    playlist_id integer not null references playlist,
    AdedAt date,
    primary key(music_id, playlist_id)
);

