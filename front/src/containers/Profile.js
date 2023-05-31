import { React, useState } from 'react'
import { SideBar } from '../components/Navbars'
import { Typography, Button, IconButton } from '@mui/material'
import {ThemeProvider} from '@mui/material'
import { theme } from '../components/CustomTheme';
import { InputField } from '../components/InputFieldStandart';
import { ErrorSnack, SuccessSnack } from '../components/NotificationsStandarts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// import { logout } from '../redux/actions/auth';
// import {connect} from "react-redux";
import { Link, Navigate, redirect } from 'react-router-dom';
import { FaTelegram, FaGithub } from "react-icons/fa";
import { logout } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';


const Profile = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.auth)
    const [redirect, setRedirect] = useState(false);
    const [isSuccessSnackOpen, setSuccessSnackopen] = useState(false);
    const [isErrorSnackOpen, setErrorSnackopen] = useState(false);


    // const [formData, setFormdata] = useState({
    //     username:'',
    //     email:'',
    // });
    // const {username, email} = formData;

    // const onChange = e => setFormdata({...formData, [e.target.name]: e.target.value})
    // const changer = () => {
    //     if (username !== '' && email !== '') {
    //         setSuccessSnackopen(true)
    //         setTimeout( () => {
    //             console.log('данные изменены');
    //             window.location.reload()
    //         }, 2000 )
    //     } else {
    //         setErrorSnackopen(true)
    //     }
    // }

    const loggingout = async () => {
        const headers = {
            Authorization: `Bearer ${state.access_token}`,
        }
        try {
            const res = await axios.post(`${state.hostUrl}/signout`, {
                },
                {headers: {Authorization: `Bearer ${state.access_token}`}}
            )

            // const data = await res.json()

            if (res.data.ok === true){
                dispatch(logout())
                setRedirect(true)
                // setTimeout(() => {setRedirect(false)}, 1500)
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
                    {/*<button onClick={() => console.log(state)}>check</button>*/}
                    {/* <Link to='/login' onClick={() => {dispatch(LogoutThunk())}}> */}
                    <span onClick={logout}>
                        <IconButton aria-label="add an alarm" onClick={loggingout}>
                            <ExitToAppIcon
                                sx={{ marginY: 'auto', fontSize: 32, marginLeft: '10px', cursor: 'pointer', color: 'whitesmoke', marginTop: '15px' }}
                            />
                        </IconButton>
                    {/* </Link> */}
                    </span>
                </div>

                {/* <InputField header_name='Имя пользователя' elem_type='text' elem_name='username' handler={onChange} padBot={3}/>
                <InputField header_name='Email' elem_type='text' elem_name='email' handler={onChange} padBot={3}/> */}

                <div className='user-info'>
                    <div className='avatar-box'>
                        <img className='avatar' src={require('../media/images/discord-wumpus.gif')} alt='avatar' />
                    </div>
                    <div className='user-stats' style={{ marginTop: '30px', paddingRight: '500px' }}>
                        <Typography sx={{ color: 'white', paddingRight: '50px' }} fontSize={32} fontWeight={'bolder'} marginBottom={'20px'}>{state.username}😎</Typography>
                        <Typography sx={{ color: 'white' }} fontSize={32} fontWeight={'bolder'} marginBottom={'20px'}>{state.email}</Typography>
                        <Typography sx={{ color: 'white' }} fontSize={32} fontWeight={'bolder'} marginBottom={'20px'}>Статус: {state.is_auth ? <span style={{ color: 'green' }}>авторизован</span> : <span style={{ color: 'red' }}>не в сети</span>}</Typography>
                    </div>
                </div>

                {/* <div className='dev_needs clear'>
                    <span className='dev_needs_link' style={{paddingTop: '10px'}}>
                        <Button
                            margin='auto'
                            id='test_button'
                            type='submit'
                            color='newone'
                            variant="contained"
                            sx={{ textTransform: 'uppercase', fontSize: 12, color: '#232323', fontWeight: 'bold' }}
                            onClick={changer}
                        >Внести изменения</Button>
                    </span>
                </div> */}

                <div className='developers' style={{ color: '#757575' }}>
                    <p>contact authors:</p>
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <a className='icons' href='https://t.me/vkova13' target='_blank' rel="noreferrer"><FaTelegram style={{ marginY: 'auto', fontSize: 24 }}/></a>
                        <a className='icons' href='https://github.com/KovalenkoV13' target='_blank' rel="noreferrer"><FaGithub style={{ marginY: 'auto', fontSize: 24 }}/></a>
                        <p style={{ marginLeft: '8px', margin: 'auto' }}>vlad</p>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <a className='icons' href='https://t.me/kuznetsov08' target='_blank'rel="noreferrer"><FaTelegram style={{ marginY: 'auto', fontSize: 24 }}/></a>
                        <a className='icons' href='https://github.com/artem-kuznecov' target='_blank' rel="noreferrer"><FaGithub style={{ marginY: 'auto', fontSize: 24 }}/></a>
                        <p style={{ marginLeft: '8px', margin: 'auto' }}>artem</p>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'row' }}>
                        <a className='icons' href='https://t.me/vadgt' target='_blank' rel="noreferrer"><FaTelegram style={{ marginY: 'auto', fontSize: 24 }}/></a>
                        <a className='icons' href='https://github.com/vadant1000' target='_blank' rel="noreferrer"><FaGithub style={{ marginY: 'auto', fontSize: 24 }}/></a>
                        <p style={{ marginLeft: '8px', margin: 'auto' }}>vadim</p>
                    </span>
                </div>
            </div>
        </div>

    {/* <SuccessSnack alert_text={'Меняем ваши данные'} isOpen={isSuccessSnackOpen} handleClose={() => setSuccessSnackopen(false)}/> */}
    <ErrorSnack alert_text={'Не удалось выйти из аккаунта'} isOpen={isErrorSnackOpen} handleClose={() => setErrorSnackopen(false)}/>

    </ThemeProvider>      
    )
}
export default Profile;
