import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ErrorSnack } from "../components/NotificationsStandarts";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


// export const RegisterThunk = createAsyncThunk(
//     'auth/RegisterThunk',
//     async function({username, password, email}) {
//         const body = JSON.stringify({username, password, email})
//         console.log('body ', body);        
//         const response = await axios.get('https://my-json-server.typicode.com/typicode/demo/posts')
//         // const response = await axios.post('https://5b70-87-249-6-54.ngrok-free.app/signup', body)
//         const data = await response.json()

//         return data
//     }
// )

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // hostUrl: 'http://127.0.0.1:8080',
        hostUrl: 'https://64765ff89233e82dd539fbc1.mockapi.io',
        account_created: false,
        username: '',
        email: '',
        role: null,
        is_auth: false,
        access_token: ''
    },
    reducers: {
        login(state, action) {
            state.username = action.payload.username
            state.email = action.payload.email
            state.access_token = action.payload.access_token
            state.role = action.payload.role
            state.is_auth = true
        },
        logout(state) {
            state.username = ''
            state.email = ''
            state.access_token = ''
            state.role = null
            state.is_auth = false
        }
    },
    extraReducers: {
        
    }
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;