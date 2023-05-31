import { React, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import Pause from '@mui/icons-material/Pause';

import { Pause, PlayArrow, Favorite, HeartBroken, SkipPrevious, HighlightOff } from '@mui/icons-material'


// import FavoriteIcon from '@mui/icons-material/Favorite';
// import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';



// import { Howl } from 'howler';

// import song from '../media/gods-plan-drake.mp3'
// import two from '../media/savage-creepin.mp3'

import useSound from 'use-sound';

import { useSelector, useDispatch } from 'react-redux';
import { turnSongOn } from '../store/musicSlice';

// import { TurnPreviousOff } from './TurnPreviousOff';

// const song = require('D:/МГТУ/6 семестр/СТ/Курсовая работа/MusicService/front/src/media/gods-plan-drake.mp3')
// const two = require('../media/savage-creepin.mp3')
// const testep = require('http://www.audiodile.com/mp3s/Yes,%20Orbital%20-%20Halcyon%20It.mp3 ')

// const songs = [song, two]

// const audioclips = [
//   {sound: "http://127.0.0.1:9000/music/savage-creepin.mp3", label: 'test' }
// ]


export const SongCard = ({id, title, author, file, img, page}) => {
  // Проверка, с какой страницы вызван компонент
  let checker = null
  if (page === 'library')
    checker = false
  else checker = true

  const songFile = require('../media/nonstop.mp3')

  // const [play, { pause, stop, duration, sound }, ] = useSound(`${file});
  const [play, { pause, stop, duration, sound }, ] = useSound(songFile);


  // const nowPlaying = useSelector(state => state.music.nowPlaying);

  const state = useSelector(state => state.auth)
  const musicState = useSelector(state => state.music)
  const dispatch = useDispatch();

  const seconds = Math.round(duration/1000);
  const minutes = Math.trunc(seconds/60)

  const timeDuration = {
    mins: minutes,
    secs: seconds - minutes*60
  }

  const [currTime, setCurrTime] = useState({
    min: 'х',
    sec: 'хх',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        // setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        let sec = Math.floor(sound.seek([]) % 60);
        if (sec < 10) sec = '0'+sec
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const [isLiked, setIsLiked] = useState(checker)

  // const blockName = String(id)

  // Плей/Пауза
  const playingButton = () => {
    if (musicState.nowPlaying === id) {
      pause();
      dispatch(turnSongOn(null))
    } else {
      dispatch(turnSongOn(id))
      play();
    }
  };

  // Если включили другую музыку, предыдущая возвращается в начало
  const toStart = () => {
    if (musicState.nowPlaying === id) {
      stop();
      setTimeout(() => {
        play();
      }, 1000)
    } else {
      stop();
      dispatch(turnSongOn(null))
    }
  }

  // Лайк/Дизлайк
  const LikeDislike = async () => {
    if (isLiked) {
      try {
        await fetch (`${state.hostUrl}/playlist/${id}`, {
            headers: {
                Authorization: `Bearer ${state.access_token}`
            },
            method: 'DELETE',
        })
  
        // const data = await res.json()
  
      } catch (err) {
          console.log('error on catch');
      }
      // dispatch(DeletePlaylistThunk(id, access_token))
    } else {
      try {
        await fetch (`${state.hostUrl}/playlist`, {
            headers: {
                Authorization: `Bearer ${state.access_token}`
            },
            method: 'POST',
            body: JSON.stringify({music_id: id})
        })
  
        // const data = await res.json()
  
      } catch (err) {
          console.log('error on catch');
      }
      // dispatch(PostPlaylistThunk(id, access_token))
    }
    setIsLiked(!isLiked)
  }

  // Удалить музыку
  const DeleteMusic = async () => {
    try {
      await fetch (`${state.hostUrl}/music/${id}`, {
          headers: {
              Authorization: `Bearer ${state.access_token}`
          },
          method: 'DELETE',
      })

      // const data = await res.json()

    } catch (err) {
        console.log('error on catch');
    }

    // dispatch(DeleteMusicThunk(id, access_token))
  }
  
  return (
    <Card className='card' sx={{ display: 'inline-flex', width: '75vw', borderRadius: '6px', padding: '5px 5px', fontFamily: 'Ubuntu', backgroundColor: '#757575' }}>
    {/* <p>{`${page}`}</p> */}
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <CardMedia
        component="img"
        sx={{ width: 60, margin: 'auto', borderRadius: '6px' }}
        // image="https://www.levelman.com/content/images/2022/11/scorpion.jpg"
        image={img}
        alt="album cover"
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'row', flex: '1 0 auto', marginY: 'auto', padding: 0 }}>
        <Typography component="span" variant="p" fontWeight={'bold'} sx={{ margin: '0px 60px' }}>
          {title}
        </Typography>
        <p>{id}</p>
        <button onClick={() => console.log('playing', musicState.nowPlaying)}>check pesnya</button>
        {/* <button onClick={() => console.log('epta', epta)}>check epta</button> */}
        {/* <button onClick={() => console.log('file', file)}>check file</button> */}
        <Typography variant="p" component="span" sx={{ margin: '0px 75px 0px 15px' }}>
        {author}
        </Typography>
        {/* <Typography component="span" variant="p">
          Scorpion
        </Typography> */}
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: 'auto', width: '300px' }}>
        <IconButton aria-label="to-start" sx={{ marginLeft: '60px' }} onClick={toStart}>
          <SkipPrevious sx={{ height: 38, width: 38, color: '#232323' }} />
        </IconButton>
        <IconButton aria-label="play/pause" onClick={playingButton} >
          {musicState.nowPlaying === id? <Pause sx={{ height: 38, width: 38, color: '#232323' }} /> :<PlayArrow sx={{ height: 38, width: 38, color: '#232323' }} />}
        </IconButton>
        <p>{currTime.min}:{currTime.sec}/{timeDuration.mins || 'х'}:{timeDuration.secs || 'хх'}</p>
        <div className='temporary-items' style={{ marginLeft: '20px', display: 'flex', flexDirection: 'row' }}>
          {state.role < 1 ? 
            <IconButton aria-label="like/dislike" onClick={LikeDislike} sx={{ }}>
              {isLiked? <HeartBroken sx={{ height: 32, width: 32, color: '#232323' }} />: <Favorite sx={{ height: 32, width: 32, color: '#232323' }} />}
            </IconButton>
          : <></>}
          <IconButton aria-label="like/dislike" onClick={DeleteMusic} sx={{ marginLeft: '10px' }}>
            {state.role ===1 && page === 'library' ? <HighlightOff sx={{ height: 32, width: 32, color: '#232323' }} />: <></>}
          </IconButton>
        </div>
      </Box>
    </Box>
    {/* <audio id={blockName}controls src='http://127.0.0.1:9000/music/savage-creepin.mp3' /> */}
    {/* <audio id={blockName} src={require(file)} /> */}
  </Card>
  );
}
