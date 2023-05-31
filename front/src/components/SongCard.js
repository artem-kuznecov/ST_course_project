import { React, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Pause, PlayArrow, Favorite, HeartBroken, SkipPrevious, HighlightOff } from '@mui/icons-material'
import useSound from 'use-sound';
import { useSelector, useDispatch } from 'react-redux';
import { turnSongOn } from '../store/musicSlice';


export const SongCard = ({id, title, author, file, img, page}) => {
  // Проверка, с какой страницы вызван компонент
  let checker = null
  if (page === 'library')
    checker = false
  else checker = true

  const dispatch = useDispatch();
  const [play, { pause, stop, duration, sound }, ] = useSound(`${file}`);
  const state = useSelector(state => state.auth)
  const musicState = useSelector(state => state.music)
  const [isLiked, setIsLiked] = useState(checker)

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
      } catch (err) {
          console.log('error on catch');
      }
    } else {
      try {
        await fetch (`${state.hostUrl}/playlist`, {
            headers: {
                Authorization: `Bearer ${state.access_token}`
            },
            method: 'POST',
            body: JSON.stringify({music_id: id})
        })
      } catch (err) {
          console.log('error on catch');
      }
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
    } catch (err) {
        console.log('error on catch');
    }
  }
  
  return (
    <Card className='card' sx={{ display: 'inline-flex', width: '75vw', borderRadius: '6px', padding: '5px 5px', fontFamily: 'Ubuntu', backgroundColor: '#757575' }}>
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <CardMedia
        component="img"
        sx={{ width: 60, margin: 'auto', borderRadius: '6px' }}
        image={img}
        alt="album cover"
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'row', flex: '1 0 auto', marginY: 'auto', padding: 0 }}>
        <Typography component="span" variant="p" fontWeight={'bold'} sx={{ margin: '0px 60px' }}>
          {title}
        </Typography>
        <Typography variant="p" component="span" sx={{ margin: '0px 75px 0px 15px' }}>
        {author}
        </Typography>
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
  </Card>
  )
}
