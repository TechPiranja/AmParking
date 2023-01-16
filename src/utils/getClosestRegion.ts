import * as Location from 'expo-location';
import { LocationRegion } from 'expo-location';
import { getDistance } from 'geolib';

// TODO: also get closest wich is OPEN and HAS FREE SPOTS!

export default async function getClosestRegion(geofences: LocationRegion[], radius: number) {
    let shortestDistance = Number.MAX_VALUE;
    let result = undefined;

    const currentLocation = await Location.getCurrentPositionAsync({});
    const lat = currentLocation.coords.latitude;
    const lon = currentLocation.coords.longitude;

    for (let region of geofences) {
        let distance = getDistance(
            { latitude: lat, longitude: lon },
            { latitude: region.latitude, longitude: region.longitude }
        );
        if (distance < shortestDistance && distance <= radius) {
            shortestDistance = distance;
            result = region;
        }
    }
    return result;
}