import { createSlice } from '@reduxjs/toolkit';

// the settings reduces is responsible for all setting related data
export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        radius: 300,
        speechVolume: 0,
        pseudoNavigation: false
    },
    reducers: {
        changeRadius: (state, action) => {
            state.radius = action.payload;
        },
        changeSpeechVolume: (state, action) => {
            state.speechVolume = action.payload;
        },
        togglePseudoNavigation: (state) => {
            state.pseudoNavigation = !state.pseudoNavigation;
        },
    },
})

export const { togglePseudoNavigation, changeRadius, changeSpeechVolume } = settingsSlice.actions

export default settingsSlice.reducer