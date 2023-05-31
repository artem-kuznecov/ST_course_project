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

var bytes = require('bytes');
// var reader = new FileReader();

const NewAdding = () => {
    const [song, setSong] = useState()
    const [url, setUrl] = useState()
    const [bin, setBin] = useState()
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        setUrl(fileReader.result)
        // setBin(fileReader.readAsBinaryString)
    }

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth)

    const [uploaded, setUploaded] = useState();

    const [songsTitles, setSongsTitles] = useState([]);
    const [songsFiles, setSongsFiles] = useState([]);
    const [songsFilesLength, setSongsFilesLength] = useState(0);
    const [songsCovers, setSongsCovers] = useState([]);

    const [newSongs, setNewSongs] = useState([])
    console.log('initial newSongs', newSongs);

    // добавляем файлы мп3 в массив файлов
    const handleChange = (event) => {
        console.log('event.target.files (mp3)', event.target.files)
        for (let i = 0; i < event.target.files.length; i++) {
            songsFiles.push(event.target.files[i])
            setUploaded(event.target.file)
        }
        console.log('songFiles', songsFiles);
        setSongsFilesLength(songsFiles.length)
        console.log('event length', event.target.files.length);
        console.log('songs length', songsFiles.length);
    }

    //добавляем один файл мп 3
    const getOneSong = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        setSong(file)
        // fileReader.readAsDataURL(file);
        fileReader.readAsBinaryString(file);
    }

    // добавляем обложки в массив обложек
    // const coversHandler = (event) => {
    //     console.log('event.target.files (images)', event.target.files);
    //     for (let i = 0; i < event.target.files.length; i++) {
    //         songsCovers.push(event.target.files[i])
    //     }
    //     console.log('songCovers', songsCovers);
    // }

    // добавляем названия в массив названий
    // const titlesHandler = (e, ident) => {
    //     // setSongsTitles({...songsTitles[ident], [e.target.name]: e.target.value})
    //     console.log(songsTitles[ident]);
    // }

    // создаем итоговый массив
    const combineData = async () => {
        for (let i = 0; i < songsFiles.length; i++ ) {
            let cover = document.getElementsByName(`cover${i}`)
            songsTitles.push(cover[0].value)
            let link = document.getElementsByName(`link${i}`)
            songsTitles.push(link[0].value)
            // console.log(i, '>>>', test[0].value);
        }
        for (let i = 0; i < songsFiles.length; i++ ) {
            newSongs.push({title: songsTitles[i], file: songsFiles[i], img: songsCovers[i], author: state.user_id})
        }
        console.log('итоговый массив: ', newSongs);
        for (let i = 0; i < newSongs.length; i++ ) {
            // const response = await axios.post('https://5b70-87-249-6-54.ngrok-free.app/signin', newSongs[i])

            // const formData = new FormData();
            // formData.append('file', newSongs[i].file)
            // // formData.append('title', 'uuu')

            // const res = await fetch('https://b5db-46-160-226-131.ngrok-free.app/music', {
            //     method: 'POST',
            //     // body: formData,
            //     body: {title: 'title', 'author': 1, file: 'huy', img: 'img'},
            //     // headers: {Authorization: 'Bearer '+ ''}

            // })
            const body = JSON.stringify({title: 'title', 'author': 1, file: 'huy', img: 'img'})

            const response = await axios.post('https://b5db-46-160-226-131.ngrok-free.app/music', body)

            console.log('formData', body);

            const data = await response.json()
            
            setUploaded(data)
        }
    }
    

    const testfunc = async () => {
        // const encodedmp3 = reader.readAsText(file.toBlob())
        // console.log('binary', encodedmp3);

        

        const body = JSON.stringify({title: 'title', author: 1, file: url, img: 'img'})

        const response = await axios.post('https://b5db-46-160-226-131.ngrok-free.app/music', body)

        console.log('formData', body);

        // const data = await response.json()
        
        // setUploaded(data)
    }

    return (
        <ThemeProvider theme={theme}>
                <div className='wrapper'>
                    <SideBar />
                    <div className='content' style={{ flexDirection: 'column' }}>
                        <div className='header'>
                            <Typography
                                fontSize={48}
                                fontWeight={'bolder'}
                                marginY={'auto'}
                            >Добавление трека</Typography>      
                        </div><br />
                        <audio src={url} controls/>
                        <button onClick={() => console.log('url', url)}>dataurl</button>
                        <button onClick={() => console.log('bin', bin)}>binary</button>
                        {/* Вводим файлы музыки */}
                        <input id="fusk" type="file" name="song" accept='.mp3' style={{ display: 'none' }} onChange={getOneSong}></input>
                        <label htmlFor="fusk" className='file-label' style={{ color: 'white', backgroundColor: '#757575', padding: '8px 8px', borderRadius: '6px', cursor: 'pointer' }}>{'Выберите файлы в формате MP3'}</label><br/>
    
                        {/* Для каждого файла открываем окно с с вводом данных */}
                        {songsFiles.map((file, index) => {
                            return (
                                <div key={index} style={{ marginTop: '20px', width: '90%' }}>
                                    {/* <input id="cover" type="file" name="cover" accept='jpg/png/jpeg' style={{ display: 'none' }} onChange={coversHandler}></input> */}
                                    <Typography color={'#757575'}>{file.name}</Typography>
                                    <InputField header_name='Название трека' elem_type='text' elem_name={`cover${index}`}/>
                                    <InputField header_name='Ссылка на файл обложки' elem_type='text' elem_name={`link${index}`}/>
                                    <p>{`${index}`}</p>
                                    {/* <button onClick={() => console.log(songsTitles)}>checl titles</button> */}
                                    {/* <InputField header_name='Название альбома' elem_type='text' elem_name='albumname'/> */}
                                    {/* <p style={{ color: 'white' }}>choose</p> */}
                                    {/* <label htmlFor="cover" className='file-label' style={{ color: 'white', backgroundColor: '#757575', padding: '8px 8px', borderRadius: '6px', cursor: 'pointer' }}>выбрать обложку</label> */}
                                </div>
                                // <div key={index} style={{ marginTop: '20px', width: '90%' }}>
                                //     <input id="cover" type="file" name="cover" accept='jpg/png/jpeg' style={{ display: 'none' }} onChange={coverChoose}></input>
                                //     <Typography color={'#757575'}>{file.name}</Typography>
                                //     <InputField header_name='Название трека' elem_type='text' elem_name='songname' onChange={setFormdata({...formData, [e.target.name]: e.target.value})}/>
                                //     <InputField header_name='Название альбома' elem_type='text' elem_name='albumname'/>
                                //     <p style={{ color: 'white' }}>{coversLength < index+1 ? 'not chosen': covers[index].name}</p>
                                //     <label htmlFor="cover" className='file-label' style={{ color: 'white', backgroundColor: '#757575', padding: '8px 8px', borderRadius: '6px', cursor: 'pointer' }}>выбрать обложку</label>
                                // </div>
                            )
                        })}
        
                        {/* {songsFiles.length > 0 ? <Button
                            id='test_button'
                            // type='submit'
                            color='newone'
                            variant="contained"
                            sx={{ textTransform: 'uppercase', fontSize: 12, color: '#232323', marginTop: '10px', fontWeight: 'bold' }}
                            onClick={testfunc}
                        >Загрузить</Button> : <></>} */}
                        <Button
                            id='test_button'
                            // type='submit'
                            color='newone'
                            variant="contained"
                            sx={{ textTransform: 'uppercase', fontSize: 12, color: '#232323', marginTop: '10px', fontWeight: 'bold' }}
                            onClick={testfunc}
                        >Загрузить</Button>
                    </div>
                </div>
        </ThemeProvider>
      )
}

export default NewAdding