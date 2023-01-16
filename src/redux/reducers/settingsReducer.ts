import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        radius: 300,
        speechVolume: 0
    },
    reducers: {
        changeRadius: (state, action) => {
            state.radius = action.payload;
        },
        changeSpeechVolume: (state, action) => {
            state.speechVolume = action.payload
        },
    },
})

export const { changeRadius, changeSpeechVolume } = settingsSlice.actions

export default settingsSlice.reducer