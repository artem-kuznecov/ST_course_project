import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import musicReducer from './musicSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        music: musicReducer
    }
});