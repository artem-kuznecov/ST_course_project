import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { Typography, Box, Button, FormControl } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { theme } from '../components/CustomTheme';
import { ErrorSnack } from '../components/NotificationsStandarts';
import { InputField } from '../components/InputFieldStandart';

// adding Redux
import { useDispatch, useSelector } from 'react-redux';
import { LoginThunk, login, setToken } from '../store/authSlice';

import axios from 'axios';

const Login = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.auth)
    
    const [redirect, setRedirect] = useState(false)
    const [formData, setFormdata] = useState({
        username:'',
        password:'',
        // role: 100
    });
    const [isErrorSnackOpen, setErrorSnackopen] = useState(false);

    const {username, password} = formData;

    const onChange = e => setFormdata({...formData, [e.target.name]: e.target.value})


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${state.hostUrl}/signin`, JSON.stringify(formData))

            // const data = await JSON.stringify(response);

            console.log('type', response.data.token_type);

            if (response.data.token_type == 'Bearer') {
                console.log(response.data)
                dispatch(login(response.data))
                setRedirect(true)
            }
        } catch (err) {
            setErrorSnackopen(true)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {redirect || state.is_auth? <Navigate to='/playlist' />: <></>}
            <Box borderRadius={4}
                 margin={'auto'}
                 sx={{ flexGrow: 1,
                     marginTop: 0,
                     maxWidth: 1/2,
                     mx: 'auto',
                    }}>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{ ml: 4 }}
                        color='white'
                        fontSize={34}
                        fontWeight={'normal'}
                        paddingBottom={1}
                        paddingTop={6}
                    >Вход в аккаунт Sonus</Typography>
                    {/*<button onClick={() => console.log(state)}>check state</button>*/}
                    <form onSubmit={handleSubmit} className='forma'>
                        <FormControl sx={{ width: '100%' }}>
                            <InputField header_name='Имя пользователя' elem_type='text' elem_name='username' handler={onChange} req={true} padBot={1} />
                            <InputField header_name='Пароль' elem_type='password' elem_name='password' handler={onChange} req={true} padBot={1}/>
                            <Button endIcon={<SendIcon />} color='newone' sx={{ textTransform: 'uppercase', fontSize: 12, color: '#232323', width: '200px', margin: 'auto', fontWeight: 'bold' }} type="submit" variant="contained">
                                Войти
                            </Button>
                        </FormControl>
                    </form>
                    <div style={{ display: 'flex' }}>
                        <span style={{ margin: 'auto' }}>
                            <Typography
                                variant="h6"
                                component="p"
                                color='white'
                                fontSize={10}
                                fontWeight={'normal'}
                            >Еще нет аккаунта?
                                <Link  to='/register' style={{color: '#1976d2', textDecoration: 'none'}}>
                                    Зарегистрируйтесь
                                </Link>
                            </Typography>
                        </span>
                    </div>
                <ErrorSnack alert_text={'Не удалось войти в аккаунт. Проверьте подключение'} isOpen={isErrorSnackOpen} handleClose={() => setErrorSnackopen(false)}/>
            </Box>
        </ThemeProvider>
    )
}
export default Login;


