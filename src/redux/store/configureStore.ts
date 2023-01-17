import { configureStore } from '@reduxjs/toolkit'
import geofencesReducer from '../reducers/geofencesReducer';
import settingsReducer from '../reducers/settingsReducer';

// the redux store holds all reducers in oder for the components to get the data
export default configureStore({
    reducer: { settings: settingsReducer, geofences: geofencesReducer },
});