import * as Location from 'expo-location';
import { LocationRegion } from 'expo-location';
import { getDistance } from 'geolib';

export default async function getClosestRegion(geofences: LocationRegion[]) {
    console.warn("Length" + geofences?.length ?? 0)
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
        console.warn("Distance" + distance)
        if (distance < shortestDistance) {
            shortestDistance = distance;
            result = region;
        }
    }

    console.warn(result?.identifier ?? 'Nothing');
    return result;
}