import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Grid, Typography, ThemeProvider } from '@mui/material'
import { SongCard } from '../components/SongCard'
import { ErrorSnack } from '../components/NotificationsStandarts';
import { Search } from '../components/InputFieldStandart';


import { theme } from '../components/CustomTheme';


import { SideBar } from '../components/Navbars'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useDispatch, useSelector } from 'react-redux';
import { setLibrary } from '../store/musicSlice';

import axios from 'axios';

const Library = () => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');  // переменная поисковой строки
    const [snackOpener, setSnackOpener] = useState({
        isOpen: false,
        isRequestCompleted: true,
        text: ''
    })
    const [isFound, setFound] = useState(false)

    const authState = useSelector(state => state.auth)
    const musicState = useSelector(state => state.music)

    useEffect(() => {
        async function GetMusic() {
            try {
                const headers = {
                    Authorization: `Bearer ${authState.access_token}`,
                }
                const res = await axios.get(`${authState.hostUrl}/music`)
                console.log(res)

                if (res.data){
                    dispatch(setLibrary(res.data))
                    // setFound(true)
                }
                else {
                    // setFound(false)
                    setSnackOpener({isOpen: true, isRequestCompleted: false, text: 'Возникла непредвиденная ошибка'})
                }
        
            } catch (err) {
                // console.log(err);
                // setFound(false)
                setSnackOpener({isOpen: true, isRequestCompleted: false, text: `${err.message}`})

            }
        }
        GetMusic()
    }, [authState.hostUrl, authState.access_token])

    return (
        <ThemeProvider theme={theme}>
            <div>
                <SideBar page='library' />
                <div className='content'>
                    <div className='search-box'>
                        <Search className='test' header_name={`🔍 Поиск`} elem_type='text' elem_name='search' wd={'100%'} handler={event => {setSearchValue(event.target.value)}}/>   
                    </div>
                    <div className='header'>
                        <Typography
                            fontSize={48}
                            fontWeight={'bolder'}
                            marginY={'auto'}
                        >Все треки</Typography>
                        {authState.role === 2 ?
                            <Link to='/library/add' className='m-auto'>
                                <AddCircleOutlineIcon
                                    sx={{ marginY: 'auto', fontSize: 32, marginLeft: '10px', cursor: 'pointer', color: 'whitesmoke' }}
                                />
                            </Link>
                            : <></>
                        } 
                    </div>   
                    <Grid direction="column" container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                        {musicState.library.filter((obj) => {
                            if ( obj.title.replace(/ /g,'').toLowerCase().includes(searchValue.toLowerCase()) || obj.author.toLowerCase().includes(searchValue.toLowerCase()) ) {
                                return true
                            }
                            return false
                            }).map( (item, index) => {
                                return (
                                    <Grid item key={index} xs={2} sm={4} md={4}>
                                        <SongCard key={index} {...item} page='library' />
                                    </Grid>
                                )
                        })}
                    </Grid>
                    <img className={snackOpener.isRequestCompleted ? 'hidden' : 'NotFound'} src={require('../media/images/vamp-PhotoRoom.png-PhotoRoom.png')} alt='404'/>
                    <Typography className={snackOpener.isRequestCompleted ? 'hidden' : 'NotFound'} fontSize={28} fontWeight={'bolder'} marginY={'auto'} sx={{ marginLeft: '30%', color: '#757575' }}>{musicState.wumpusTexts[Math.floor(Math.random() * (3 - 0 + 0)) + 0]}</Typography>
                    <ErrorSnack alert_text={snackOpener.text} isOpen={snackOpener.isOpen} handleClose={() => setSnackOpener({isOpen: false, isRequestCompleted: false, text: snackOpener.text})}/>
                </div>
            </div>
    </ThemeProvider>
    )
}

export default Library
