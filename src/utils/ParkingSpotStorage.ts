import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';


const storeParkingSpots = async (parkingSpots: ParkingSpotInfo[]) => {
    try {
        const jsonValue = JSON.stringify(parkingSpots)
        await AsyncStorage.setItem('@parkingSpots', jsonValue)
    } catch (e) {
        // saving error
    }
}

const getParkingSpots = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@parkingSpots')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}

export {
    storeParkingSpots,
    getParkingSpots
}