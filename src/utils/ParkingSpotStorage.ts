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

const changeIsFavorite = async (id: number, isFavorite: boolean): Promise<ParkingSpotInfo[] | null | undefined> => {
    const parkingSpots = await getParkingSpots();
    const getItem = parkingSpots?.find((x: ParkingSpotInfo) => x.id == id);
    getItem!.isFavorite = isFavorite;

    try {
        const jsonValue = JSON.stringify(parkingSpots)
        await AsyncStorage.setItem('@parkingSpots', jsonValue)
    } catch (e) {
        // saving error
    }
    return parkingSpots;
}

const getParkingSpots = async (): Promise<ParkingSpotInfo[] | null | undefined> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@parkingSpots')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}

export {
    storeParkingSpots,
    getParkingSpots,
    changeIsFavorite
}