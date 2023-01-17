import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';

// stores parkingSpots in internal storage
const storeParkingSpots = async (parkingSpots: ParkingSpotInfo[]) => {
    try {
        const jsonValue = JSON.stringify(parkingSpots)
        await AsyncStorage.setItem('@parkingSpots', jsonValue)
    } catch (e) {
        // saving error
    }
}

// changes favorite status of a parkingspot in the internal storage
const changeIsFavorite = async (id: number, isFavorite: boolean): Promise<ParkingSpotInfo[] | null | undefined> => {
    let parkingSpots = await getParkingSpots();
    const getItem = parkingSpots?.find((x: ParkingSpotInfo) => x.id == id);
    getItem!.isFavorite = isFavorite;

    parkingSpots = parkingSpots?.sort(
        (a: ParkingSpotInfo, b: ParkingSpotInfo) => Number(b!.isFavorite) - Number(a!.isFavorite)
    )

    try {
        const jsonValue = JSON.stringify(parkingSpots)
        await AsyncStorage.setItem('@parkingSpots', jsonValue)
    } catch (e) {
        // saving error
    }
    return parkingSpots;
}

// gets all parkingspots from internal storage
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