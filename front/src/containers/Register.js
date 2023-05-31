import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { Typography, Box, Button, FormControl } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { theme } from '../components/CustomTheme';
import { ErrorSnack } from '../components/NotificationsStandarts';
import { InputField } from '../components/InputFieldStandart';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Register = () => {
    const state = useSelector(state => state.auth)
    const [isAccountCreated, setAccountCreated] = useState(false);
    const [formData, setFormdata] = useState({
        username:'',
        password:'',
        re_password:'',
        email:''
    });
    const [isSnackOpen, setSnackopen] = useState(false);

    const {username, password, re_password, email, role} = formData;

    const onChange = e => setFormdata({...formData, [e.target.name]: e.target.value})

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password === re_password) {
            try {
                const response = await axios.post(`${state.hostUrl}/signup`, JSON.stringify(formData))
                if (response.data.ok === true) {
                    setAccountCreated(true)
                } else setSnackopen(true)
            } catch (err) {
                console.log('register fail on catch');
                setSnackopen(true)
            }
        } else {
            console.log('register fail on pass == repass');
            setSnackopen(true)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {isAccountCreated ? <Navigate to='/login' /> : <></>}
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
                    >Регистрация в Sonus</Typography>
                    <form onSubmit={handleSubmit} className='forma'>
                        <FormControl sx={{ width: '100%' }}>
                            <InputField header_name='Имя пользователя' elem_type='text' elem_name='username' handler={onChange} req={true} padBot={1} />
                            <InputField header_name='Пароль' elem_type='password' elem_name='password' handler={onChange} req={true} padBot={1}/>
                            <InputField header_name='Повторите пароль' elem_type='password' elem_name='re_password' handler={onChange} req={true} padBot={1}/>
                            <InputField header_name='Email' elem_type='text' elem_name='email' handler={onChange} req={true} padBot={1}/>
                            <Button endIcon={<SendIcon />} color='newone' sx={{ textTransform: 'uppercase', fontSize: 12, color: '#232323', width: '200px', margin: 'auto', fontWeight: 'bold' }} type="submit" variant="contained">
                                Создать аккаунт
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
                            >Уже есть аккаунт?
                                <Link className='clear' to='/login' style={{color: '#1976d2', textDecoration: 'none'}}>
                                    Войдите
                                </Link>
                            </Typography>
                        </span>
                    </div>
                    <ErrorSnack alert_text={'Ошибка регистрации: проверьте правильность введенных данных'} isOpen={isSnackOpen} handleClose={() => setSnackopen(false)}/>
            </Box>
        </ThemeProvider>
    )
}
export default Register;


