import { useEffect, useState } from 'react';
import useNotify from './useNotify';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LocationRegion } from 'expo-location';
import getClosestRegion from '../utils/getClosestRegion';
import { useDispatch, useSelector } from 'react-redux';
import { addEnteredGeofence, changeClosestRegion, removeEnteredGeofence } from '../redux/reducers/geofencesReducer';
import { getParkingSpots } from '../utils/ParkingSpotStorage';

const GEOFENCING = 'GEOFENCING';

export default function useGeofences() {
  const geofences = useSelector((state: any) => state.geofences);
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const [geofencingRegions, setGeofencingRegions] = useState<LocationRegion[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loadedPermissions, setLoadedPermissions] = useState<boolean>(false);
  const { notify } = useNotify();

  useEffect(() => {
    Location.stopGeofencingAsync(GEOFENCING);
    Location.startGeofencingAsync(GEOFENCING, geofencingRegions);
  }, [geofencingRegions, loadedPermissions])

  async function updateClosestRegion() {
    dispatch(changeClosestRegion(await getClosestRegion(geofences.enteredGeofences, settings.radius)));
  }

  useEffect(() => {
    if (geofences.enteredGeofences.length == 0)
      dispatch(changeClosestRegion(undefined));
    else
      updateClosestRegion();

  }, [geofences.enteredGeofences, userLocation, settings.radius])

  async function getAmountOfFreeSpots(name: string) {
    const data = await getParkingSpots();
    const parkingSpot = data!.find((p) => p.name === name);
    return parkingSpot!.free;
  }

  useEffect(() => {
    if (geofences?.closestRegion?.identifier) {
      getAmountOfFreeSpots(geofences?.closestRegion?.identifier)
        .then(freeSpots => notify('Parkhaus ' + geofences?.closestRegion?.identifier + ' in der Nähe. ' + freeSpots + ' Parkplätze frei.'));
    }
  }, [geofences.closestRegion])


  async function getUserLocation() {
    await Location.hasServicesEnabledAsync()
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
    setLoadedPermissions(true);
  }

  useEffect(() => {
    getUserLocation();
    const LocationInterval = setInterval(() => {
      getUserLocation();
    }, 3000);
    return () => clearInterval(LocationInterval);
  }, []);

  useEffect(() => {
    TaskManager.defineTask(GEOFENCING, ({ data: { eventType, region }, error }: any) => {
      if (error) {
        notify('Fehler', false);
        return;
      }
      if (eventType === Location.GeofencingEventType.Enter) {
        dispatch(addEnteredGeofence(region));
      } else if (eventType === Location.GeofencingEventType.Exit) {
        dispatch(removeEnteredGeofence(region));
      }
    });
  }, []);

  return { setGeofencingRegions, userLocation };
}
