import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        speechVolume: 0
    },
    reducers: {
        changeSpeechVolume: (state, action) => {
            state.speechVolume = action.payload
        },
    },
})

export const { changeSpeechVolume } = settingsSlice.actions

export default settingsSlice.reducer