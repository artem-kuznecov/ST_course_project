import React from 'react'

import useSound from 'use-sound';
import { useSelector, useDispatch } from 'react-redux';

// import song from '../media/gods-plan-drake.mp3'
// import two from '../media/savage-creepin.mp3'
// const songs = [song, two]

// export const TurnPreviousOff = () => {
//     const nowPlaying = useSelector(state => state.music.nowPlaying);
//     const [stop_temporary] = useSound(songs.find(elem => String(elem) === nowPlaying));
//     return stop_temporary();
// }