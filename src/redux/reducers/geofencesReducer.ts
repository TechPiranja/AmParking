import { createSlice } from '@reduxjs/toolkit';
import { LocationRegion } from 'expo-location';

export const settingsSlice = createSlice({
    name: 'geofences',
    initialState: {

        enteredGeofences: [] as any,
        geofencingRegions: [] as any,
        closestRegion: undefined
    },
    reducers: {
        addEnteredGeofence: (state, action) => {
            let findDuplicate = state.enteredGeofences.find((x: LocationRegion) => x.identifier == action.payload.identifier);
            if (!findDuplicate)
                state.enteredGeofences = [...state.enteredGeofences, action.payload];
        },
        removeEnteredGeofence: (state, action) => {
            let filteredList = state.enteredGeofences.filter((x: LocationRegion) => x.identifier != action.payload.identifier);
            if (filteredList.length != state.enteredGeofences.length)
                state.enteredGeofences = filteredList;
        },
        changeEnteredGeofences: (state, action) => {
            state.enteredGeofences = action.payload
        },
        changeGeofencingRegions: (state, action) => {
            state.geofencingRegions = action.payload
        },
        changeClosestRegion: (state, action) => {
            state.closestRegion = action.payload
        },
    },
})

export const { addEnteredGeofence, removeEnteredGeofence, changeEnteredGeofences, changeGeofencingRegions, changeClosestRegion } = settingsSlice.actions

export default settingsSlice.reducer