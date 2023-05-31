import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        hostUrl: 'http://127.0.0.1:8080',
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