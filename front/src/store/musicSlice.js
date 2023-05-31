import { createSlice } from "@reduxjs/toolkit";

const musicSlice = createSlice({
    name: 'music',
    initialState: {
        wumpusTexts: [
            'Кажется, я слишком плохо искал...',
            'Не получилось, пойду попробую еще раз...',
            'Наверное, мне стоит стараться лучше...',
            'Не хочу расстраивать, но тут что-то не то...'
        ],
        nowPlaying: null,
        library: [],
        playlist: [],
    },
    reducers: {
        turnSongOn(state, action) {
            state.nowPlaying = action.payload
        },
        setLibrary(state, action) {
            state.library = action.payload
        },
        setPlaylist(state, action) {
            state.playlist = action.payload
        }
    },
    extraReducers: {

    }
});

export const {turnSongOn, setLibrary, setPlaylist} = musicSlice.actions;

export default musicSlice.reducer;