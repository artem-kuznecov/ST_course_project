import React, { useEffect, useState } from 'react'
import { Grid, ThemeProvider, Typography } from '@mui/material'
import { SongCard } from '../components/SongCard'
import { ErrorSnack } from '../components/NotificationsStandarts'

import { InputField, Search } from '../components/InputFieldStandart';
import { theme } from '../components/CustomTheme';



import { SideBar } from '../components/Navbars'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux';
import { setPlaylist } from '../store/musicSlice';

const array = [
    {
        id: 1,
        title: 'one',
        author: 'Drake',
        file: 'http://127.0.0.1:9000/music/savage-creepin.mp3',
        img: 'https://upload.wikimedia.org/wikipedia/en/7/70/Drake_-_More_Life_cover.jpg'
    },
    {
        id: 2,
        title: 'two',
        author: 'asap ferg',
        file: 'http://127.0.0.1:9000/music/savage-creepin.mp3',
        img: 'https://www.levelman.com/content/images/2022/11/scorpion.jpg'
    },
]

const Playlist = () => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const wumpus = useSelector(state => state.music.wumpusTexts)
    const [isFound, setFound] = useState(false)
    // const [rand, setRand] = useState()

    const authState = useSelector(state => state.auth)
    const musicState = useSelector(state => state.music)
    // const [playlist, setPlaylist] = useState([])
    // const [isSnackOpen, setSnackopen] = useState(false)
    const [snackOpener, setSnackOpener] = useState({
        isOpen: false,
        isRequestCompleted: false,
        text: ''
    })
    // const playlist = useSelector(state => state.music.playlist)

    useEffect(() => {
        // fetch (`${state.hostUrl}/music`, {
                //     headers: {
                //         Authorization: `Bearer ${state.access_token}`
                //     }
                // })
                // .then (res => {
                //     setLibrary(res)
                // })
        // setRand(Math.floor(Math.random() * (3 - 0 + 0)) + 0)
        async function GetPlaylist() {
            try {
                const headers = {
                    Authorization: `Bearer ${authState.access_token}`
                };

                // await fetch(`${state.hostUrl}/playlist`, {
                //     method: 'GET',
                //     headers: {
                //         Authorization: `Bearer ${state.access_token}`
                //         // Authorization: 'Bearer' + state.access_token
                //     }
                // })
                //     .then(res => {
                //         setPlaylist(res.data)
                //     })

                const res = await axios.get(`${authState.hostUrl}/playlist`, {headers: {Authorization: `Bearer ${authState.access_token}`}})
                // const res = await axios.get(`${authState.hostUrl}/music`)
                // const data = await res.json()
                console.log('dataaa', res.data);

                if (res.data){
                    // console.log('headers', headers)
                    // setFound(true)

                    // if(res.status === 200) {
                    //     console.log(res.status);
                    //     // setFound(false)
                    //     setSnackOpener({isRequestCompleted: true})
                    // }
                    // else
                        setPlaylist(res.data)
                        setSnackOpener({isRequestCompleted: true})               
                } else
                    setSnackOpener({isOpen: true, isRequestCompleted: false, text: 'Возникла непредвиденная ошибка'})
            } catch (err) {
                // setFound(false)
                setSnackOpener({isOpen: true, isRequestCompleted: false, text: `${err.message}`})
            }
        }
        GetPlaylist()
    }, [authState.hostUrl, authState.access_token])
    
    return (
    <ThemeProvider theme={theme}>
        <SideBar page='playlist' />
        <div className='content'>
            <div className='search-box'>
                <Search className='test' header_name='🔍 Поиск' elem_type='text' elem_name='search' wd={'100%'} handler={event => {setSearchValue(event.target.value)}}/>
            </div>
            <div className='header'>
                <Typography
                    fontSize={48}
                    fontWeight={'bolder'}
                    marginY={'auto'}
                >Мои треки</Typography>
            </div>   
            <Grid container direction={'column'} spacing={{ xs: 1, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                {musicState.playlist.filter((obj) => {
                    if ( obj.title.replace(/ /g,'').toLowerCase().includes(searchValue.toLowerCase()) || obj.author.toLowerCase().includes(searchValue.toLowerCase()) ) {
                        return true
                    }
                    return false
                    }).map( (item, index) => {
                        return (
                            <Grid item key={index} xs={2} sm={4} md={4}>
                                <SongCard key={index} {...item} page='playlist' />
                            </Grid>
                        )
                })}
            </Grid>
            <button onClick={() => console.log(snackOpener)}>ldbvibfe</button>
            <img className={snackOpener.isRequestCompleted && musicState.playlist.length != 0 ? 'hidden' : 'NotFound'} src={require('../media/images/vamp-PhotoRoom.png-PhotoRoom.png')} alt='404'/>
            <Typography className={snackOpener.isRequestCompleted ? 'hidden' : 'NotFound'} fontSize={28} fontWeight={'bolder'} marginY={'auto'} sx={{ marginLeft: '550px', color: '#757575' }}>{wumpus[Math.floor(Math.random() * (3 - 0 + 0)) + 0]}</Typography>
            <ErrorSnack alert_text={snackOpener.text} isOpen={snackOpener.isOpen} handleClose={() => setSnackOpener({isOpen: false, isRequestCompleted: false, text: snackOpener.text})}/>
        </div>
    </ThemeProvider>
    )
}

export default Playlist