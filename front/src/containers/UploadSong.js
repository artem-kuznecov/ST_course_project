import React, { useState, useRef } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../components/CustomTheme';
import { Typography, Button } from '@mui/material';
import { SideBar } from '../components/Navbars';
import { ErrorSnack } from '../components/NotificationsStandarts';
import { InputField } from '../components/InputFieldStandart';
import { useSelector } from 'react-redux';


const UploadSong = () => {
    const [isSnackOpen, setSnackopen] = useState(false)
    const [snackText, setSnackText] = useState(null)

    const state = useSelector(state => state.auth)
    const filePicker = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [name, setName] = useState(null)
    const [image, setImage] = useState(null)

    const nameHandler = (e) => {
        setName(e.target.value)
    }

    const imageHandler = (e) => {
        setImage(e.target.value)
        console.log(name);
    }

    const handlePick = () => {
        filePicker.current.click();
    }

    const handleChange = (event) => {
        console.log(event.target.files);
        setSelectedFile(event.target.files[0])
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setSnackText('Пожалуйста, выберите файл')
            setSnackopen(true)
            return
        }

        const formData = new FormData();
        formData.append('file', selectedFile)
        formData.append('title', name)
        formData.append('img', image)

        console.log('request body', formData);

        try {
            const res = await fetch (`${state.hostUrl}/music`, {
                headers: {
                    Authorization: `Bearer ${state.access_token}`
                },
                method: 'POST',
                body: formData
            })
    
            const data = await res.json()

            if (data) {
                console.log('data', data);
            } else {
                setSnackText('Не удалось загрузить трек. Проверьте соединение')
                setSnackopen(true)
            }
        } catch (err) {
            setSnackText('Не удалось загрузить трек. Проверьте соединение')
            setSnackopen(true)
        }
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
                    <Button
                        color='grey'
                        variant="contained"
                        sx={{
                            width: '250px',
                            textTransform: 'uppercase',
                            fontSize: 12, color: '#232323',
                            marginTop: '10px',
                            fontWeight: 'bold'
                        }}
                        onClick={handlePick}
                    >{ selectedFile ? `${selectedFile.name}` : 'Выбрать файл' }</Button>
                    <input
                        className='hidden'
                        type="file"
                        accept='.mp3'
                        ref={filePicker}
                        onChange={handleChange}
                    ></input>

                    <InputField header_name='Название трека' elem_type='text' elem_name='title' handler={nameHandler} mT='30px' />

                    <InputField header_name='Ссылка на изображение (обложку)' elem_type='text' elem_name='img' handler={imageHandler} mT='15px'/>
                    <p></p>
                    
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
                        onClick={handleUpload}
                    >Загрузить</Button>
                    <ErrorSnack alert_text={snackText} isOpen={isSnackOpen} handleClose={() => setSnackopen(false)}/>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default UploadSong
