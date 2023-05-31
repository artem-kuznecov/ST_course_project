import { React, useState } from 'react'
import { SideBar } from '../components/Navbars'
import { Typography, IconButton } from '@mui/material'
import {ThemeProvider} from '@mui/material'
import { theme } from '../components/CustomTheme';
import { ErrorSnack } from '../components/NotificationsStandarts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Navigate } from 'react-router-dom';
import { FaTelegram, FaGithub } from "react-icons/fa";
import { logout } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';


const Profile = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.auth)
    const [redirect, setRedirect] = useState(false);
    const [isErrorSnackOpen, setErrorSnackopen] = useState(false);

    const loggingout = async () => {
        try {
            const res = await axios.post(`${state.hostUrl}/signout`, {headers: {Authorization: `Bearer ${state.access_token}`}})

            if (res.data.ok === true){
                dispatch(logout())
                setRedirect(true)
            }
            else setErrorSnackopen(true)
        } catch (err) {
            setErrorSnackopen(true)
        }
    }

    return(
        <ThemeProvider theme={theme}>
        {redirect? <Navigate to='/login'></Navigate>: <></>}
        <div className='wrapper'>
            <SideBar page='profile' />
            <div className='content'>
                <div className='header'>
                    <Typography
                        fontSize={48}
                        fontWeight={'bolder'}
                        marginBottom={'20px'}
                    >Мой профиль</Typography>
                    <span onClick={logout}>
                        <IconButton aria-label="add an alarm" onClick={loggingout}>
                            <ExitToAppIcon
                                sx={{
                                    marginY: 'auto',
                                    fontSize: 32,
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                    color: 'whitesmoke',
                                    marginTop: '15px'
                                }}
                            />
                        </IconButton>
                    </span>
                </div>
                <div className='user-info'>
                    <div className='avatar-box'>
                        <img className='avatar' src={require('../media/images/discord-wumpus.gif')} alt='avatar' />
                    </div>
                    <div className='user-stats' style={{ marginTop: '30px', paddingRight: '500px' }}>
                        <Typography
                            sx={{ color: 'white', paddingRight: '50px' }}
                            fontSize={32} fontWeight={'bolder'}
                            marginBottom={'20px'}
                        >{state.username}😎</Typography>
                        <Typography
                            sx={{ color: 'white' }}
                            fontSize={32}
                            fontWeight={'bolder'}
                            marginBottom={'20px'}
                        >{state.email}</Typography>
                        <Typography
                            sx={{ color: 'white' }}
                            fontSize={32}
                            fontWeight={'bolder'}
                            marginBottom={'20px'}
                            >Статус: {state.is_auth ?
                                <span style={{ color: 'green' }}>авторизован</span>
                                :
                                <span style={{ color: 'red' }}>не в сети</span>}
                        </Typography>
                    </div>
                </div>
                <div className='developers' style={{ color: '#757575' }}>
                    <p>contact authors:</p>
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <a className='icons' href='https://t.me/vkova13' target='_blank' rel="noreferrer">
                            <FaTelegram style={{ marginY: 'auto', fontSize: 24 }}/>
                        </a>
                        <a className='icons' href='https://github.com/KovalenkoV13' target='_blank' rel="noreferrer">
                            <FaGithub style={{ marginY: 'auto', fontSize: 24 }}/>
                        </a>
                        <p style={{ marginLeft: '8px', margin: 'auto' }}>vlad</p>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <a className='icons' href='https://t.me/kuznetsov08' target='_blank'rel="noreferrer">
                            <FaTelegram style={{ marginY: 'auto', fontSize: 24 }}/>
                        </a>
                        <a className='icons' href='https://github.com/artem-kuznecov' target='_blank' rel="noreferrer">
                            <FaGithub style={{ marginY: 'auto', fontSize: 24 }}/>
                        </a>
                        <p style={{ marginLeft: '8px', margin: 'auto' }}>artem</p>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <a className='icons' href='https://t.me/vadgt' target='_blank' rel="noreferrer">
                            <FaTelegram style={{ marginY: 'auto', fontSize: 24 }}/>
                        </a>
                        <a className='icons' href='https://github.com/vadant1000' target='_blank' rel="noreferrer">
                            <FaGithub style={{ marginY: 'auto', fontSize: 24 }}/>
                        </a>
                        <p style={{ marginLeft: '8px', margin: 'auto' }}>vadim</p>
                    </span>
                </div>
            </div>
        </div>
        <ErrorSnack alert_text={'Не удалось выйти из аккаунта'} isOpen={isErrorSnackOpen} handleClose={() => setErrorSnackopen(false)}/>
    </ThemeProvider>      
    )
}
export default Profile;
