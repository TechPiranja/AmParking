import { configureStore } from '@reduxjs/toolkit'
import geofencesReducer from '../reducers/geofencesReducer';
import settingsReducer from '../reducers/settingsReducer';

export default configureStore({
    reducer: { settings: settingsReducer, geofences: geofencesReducer },
});