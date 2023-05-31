import React, { useState } from 'react'
import { ThemeProvider, styled } from '@mui/material/styles';
import { theme } from '../components/CustomTheme';
import { Typography, Box, Button, Grid, Paper, CardMedia, Card, TextField } from '@mui/material';
import { SideBar } from '../components/Navbars';
import { Link } from 'react-router-dom';

import { InputField } from '../components/InputFieldStandart';
import { CustomTextField } from '../components/CustomTheme';

import { useDispatch, useSelector } from 'react-redux';
import { PostMusicThunk } from '../store/musicSlice';

import axios from 'axios';

const UploadSong = () => {
    const state = useSelector(state => state.auth)
    const [file, setFile] = useState();

    const [requestData, setRequestData] = useState({
        title: '',
        img: '',
        author: state.user_id,
    })
    const {title, img, author} = requestData

    const titleHandler = e => setRequestData({...requestData, [e.target.name]: e.target.value})

    // отправялем запрос
    const request = async () => {
        const headers = {
            Authorization: `Bearer ${state.access_token}`
        }
        const body = {title, img, author, file}
        console.log('request data:', body);
        // отправляем файл
        // const fileResponse = await axios.post('https://b5db-46-160-226-131.ngrok-free.app/music', file, headers)
        // отправляем данные
        const attrResponse = await axios.post('https://b5db-46-160-226-131.ngrok-free.app/music', body, headers)

        // const fileData = fileResponse.json();
        const attrData = attrResponse.json();

        // console.log('fileData > ', fileData);
        console.log('attrData > ', attrData);
    }

    return (
    <ThemeProvider theme={theme}>
                <div className='wrapper'>
                    <SideBar />
                    <div className='content' style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className='header'>
                            <Typography
                                fontSize={48}
                                fontWeight={'bolder'}
                                marginY={'auto'}
                            >Добавление трека</Typography>      
                        </div>

                        {/* Вводим файлы музыки */}
                        <input id="fusk" type="file" name="song" accept='.mp3' style={{ display: 'none' }} onChange={(event) => {setFile(event.target.files[0]); console.log(event.target.files[0]);}}></input>
                        <label
                            className='file-label'
                            htmlFor="fusk" 
                            style={{
                                color: 'white',
                                width: '300px',
                                // display: '',
                                backgroundColor: '#757575',
                                padding: '8px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer' 
                            }}
                        >{file ? `${file.name}` : 'Выберите файлы в формате MP3'}</label><br/>

                        <InputField header_name='Название трека' elem_type='text' elem_name='title' handler={titleHandler}/>
                        <InputField header_name='Ссылка на изображение (обложку)' elem_type='text' elem_name='img' handler={titleHandler}/>
                        
                        
                        <Button
                            id='test_button'
                            // type='submit'
                            color='newone'
                            variant="contained"
                            sx={{
                                width: '250px',
                                textTransform: 'uppercase',
                                fontSize: 12, color: '#232323',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}
                            onClick={request}
                        >Загрузить</Button>
                    </div>
                </div>
        </ThemeProvider>
    )
}

export default UploadSong
