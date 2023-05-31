// import React, { useState } from 'react'
// import { ThemeProvider, styled } from '@mui/material/styles';
// import { theme } from '../components/CustomTheme';
// import { Typography, Box, Button, Grid, Paper, CardMedia, Card, TextField } from '@mui/material';
// import { SideBar } from '../components/Navbars';
// import { Link } from 'react-router-dom';

// import { InputField } from '../components/InputFieldStandart';
// import { CustomTextField } from '../components/CustomTheme';

// import { useDispatch, useSelector } from 'react-redux';
// import { PostMusicThunk } from '../store/musicSlice';


// const AddSong = () => {
//     const dispatch = useDispatch();
//     let k = -1
//     const [newSong, setNewSong] = useState({
//         title: '',
//         file: '',
//         img: '',
//         author: null
//     })
//     // const [songName, setSongName] = useState([])
//     const array = []
//     const [requestData, setRequestData] = useState([])  //массив загруженных файлов
//     const [requestLength, setRequestLength] = useState(0)
//     const [coversLength, setCoversLength] = useState(0)

//     const [covers, setCovers] = useState([])  //массив обложек
//     const [names, setNames] = useState(); // массив названий

//     const [final, setFinal] = useState([]); // массив в запросе

//     const handleChange = (event) => {
//         console.log('uploaded files:', event.target.files);
//         for (let i = 0; i < event.target.files.length; i++) {
//             requestData.push(event.target.files[i])
//             setRequestLength(i+1)
//         }
//         // k++
//         // requestData.push(event.target.files[k])
//         // setRequestLength(i+1)
//         console.log('requestData', requestData);
//     }
//     const coverChoose = (event) => {
//         covers.push(event.target.files[0])
//         console.log('обложки', event.target.files[0].name);
//         console.log('covers', covers);
//         setCoversLength(coversLength+1)
//     }

//     const handleSubmit = () => {
//         console.log('can do POST with:', requestData);
//         // dispatch(PostMusicThunk(requestData))
//         console.log('request Body: ', requestData);
//     }

//     const postMusic = () => {
//         // for (let i = 0; i < requestData.length; i++) {
//         //     setNewSong({title})
//         // }
//         console.log('can do POST with:', requestData)}
//     }

//     return (
//         <ThemeProvider theme={theme}>
//             <div className='wrapper'>
//                 <SideBar />
//                 <div className='content' style={{ flexDirection: 'column' }}>
//                     <div className='header'>
//                         <Typography
//                             fontSize={48}
//                             fontWeight={'bolder'}
//                             marginY={'auto'}
//                         >Добавление трека</Typography>      
//                     </div><br />
//                     {/* Вводим файлы музыки */}
//                     <input id="fusk" type="file" multiple name="song" accept='.mp3' style={{ display: 'none' }} onChange={handleChange}></input>
//                     <label htmlFor="fusk" className='file-label' style={{ color: 'white', backgroundColor: '#757575', padding: '8px 8px', borderRadius: '6px', cursor: 'pointer' }}>{requestLength > 0 ? `Файлов выбрано: ${requestLength}`: 'Выберите файлы в формате MP3'}</label><br/>

//                     {/* Для каждого файла открываем окно с с вводом данных */}
//                     {requestData.map((file, index) => {
//                         return (
//                             // <form>
//                             //     <div key={index} style={{ marginTop: '20px', width: '90%' }}>
//                             //     <input id="cover" type="file" name="cover" accept='jpg/png/jpeg' style={{ display: 'none' }} onChange={coverChoose}></input>
//                             //     <Typography color={'#757575'}>{file.name}</Typography>
//                             //     <InputField header_name='Название трека' elem_type='text' elem_name='songname' onChange={setFormdata({...formData, [e.target.name]: e.target.value})}/>
//                             //     <InputField header_name='Название альбома' elem_type='text' elem_name='albumname'/>
//                             //     <p style={{ color: 'white' }}>{coversLength < index+1 ? 'not chosen': covers[index].name}</p>
//                             //     <label htmlFor="cover" className='file-label' style={{ color: 'white', backgroundColor: '#757575', padding: '8px 8px', borderRadius: '6px', cursor: 'pointer' }}>выбрать обложку</label>
//                             // </div>
//                             // </form>
//                             <div key={index} style={{ marginTop: '20px', width: '90%' }}>
//                                 <input id="cover" type="file" name="cover" accept='jpg/png/jpeg' style={{ display: 'none' }} onChange={coverChoose}></input>
//                                 <Typography color={'#757575'}>{file.name}</Typography>
//                                 <InputField header_name='Название трека' elem_type='text' elem_name='songname' onChange={setFormdata({...formData, [e.target.name]: e.target.value})}/>
//                                 <InputField header_name='Название альбома' elem_type='text' elem_name='albumname'/>
//                                 <p style={{ color: 'white' }}>{coversLength < index+1 ? 'not chosen': covers[index].name}</p>
//                                 <label htmlFor="cover" className='file-label' style={{ color: 'white', backgroundColor: '#757575', padding: '8px 8px', borderRadius: '6px', cursor: 'pointer' }}>выбрать обложку</label>
//                             </div>
//                         )
//                     })}
//                     {/* <InputField header_name='Название трека' elem_type='text' elem_name='songname'/>
//                     <InputField header_name='Название альбома' elem_type='text' elem_name='albumname'/>
//                     <InputField header_name='Ссылка на изображение (для обложки)' elem_type='text' elem_name='imagelink' padBot={2}/> */}

//                     {requestLength > 0 ? <Button
//                         id='test_button'
//                         type='submit'
//                         color='newone'
//                         variant="contained"
//                         sx={{ textTransform: 'uppercase', fontSize: 12, color: '#232323', marginTop: '10px', fontWeight: 'bold' }}
//                         onClick={postMusic}
//                     >Загрузить</Button> : <></>}
//                 </div>
//             </div>
//     </ThemeProvider>
//   )
// }
// export default AddSong;
