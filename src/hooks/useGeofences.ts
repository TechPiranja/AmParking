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

// this hook enables the geofencing methods
export default function useGeofences() {
  const geofences = useSelector((state: any) => state.geofences);
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const [permissionStatus, setPermissionStatus] = useState<boolean>(false);
  const [geofencingRegions, setGeofencingRegions] = useState<LocationRegion[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loadedPermissions, setLoadedPermissions] = useState<boolean>(false);
  const { notify } = useNotify();

  // initially, the location permission are beeing asked
  useEffect(() => {
    getPermission().then(() => {
      getUserLocation();
    })
  }, []);

  // if the permission was granted, the location functions are used
  useEffect(() => {
    if (permissionStatus) {
      // this gets the location of the user every 3 seconds
      const LocationInterval = setInterval(() => {
        getUserLocation();
      }, 3000);

      // in order to use geofences, we define a task in the expo taskmanager
      TaskManager.defineTask(GEOFENCING, ({ data: { eventType, region }, error }: any) => {
        if (error) {
          notify('Fehler', false);
          return;
        }
        if (eventType === Location.GeofencingEventType.Enter) { // it notices entering a geofence
          dispatch(addEnteredGeofence(region));
        } else if (eventType === Location.GeofencingEventType.Exit) { // and also exiting it
          dispatch(removeEnteredGeofence(region));
        }
      });

      // if the component is disposed, the userlocation is no longer fetched
      return () => clearInterval(LocationInterval);
    }
  }, [permissionStatus])

  // if the location permissions are set, we can start the geofencing task
  useEffect(() => {
    // since the regions can change due to the radius setting, we need to stop the old geofencing task before starting the new one
    Location.stopGeofencingAsync(GEOFENCING);
    Location.startGeofencingAsync(GEOFENCING, geofencingRegions);
  }, [geofencingRegions, loadedPermissions])

  // this function updates the closestparkingSpot in the internal redux store
  async function updateClosestRegion() {
    dispatch(changeClosestRegion(await getClosestRegion(geofences.enteredGeofences, settings.radius)));
  }

  // each time, the userlocation, radius or enteredgeofences changes, we need to check the closestRegion
  useEffect(() => {
    if (geofences.enteredGeofences.length == 0) // if we left every region, there is no parkingspot to be set
      dispatch(changeClosestRegion(undefined));
    else
      updateClosestRegion(); // if we are in some geofences, we can calculate the closest parkingspot and save it

  }, [geofences.enteredGeofences, userLocation, settings.radius])

  // this function gets the free parkingspots of the closest one
  async function getAmountOfFreeSpots(name: string) {
    const data = await getParkingSpots();
    const parkingSpot = data!.find((p) => p.name === name);
    return parkingSpot!.free;
  }

  // every time the closestRegion changes, we notify the user about the change with a notification and a speech
  useEffect(() => {
    if (geofences?.closestRegion?.identifier) {
      getAmountOfFreeSpots(geofences?.closestRegion?.identifier)
        .then(freeSpots => notify('Parkhaus ' + geofences?.closestRegion?.identifier + ' in der Nähe. ' + freeSpots + ' Parkplätze frei.'));
    }
  }, [geofences.closestRegion])

  // this functions gets the required permissions
  async function getPermission() {
    await Location.hasServicesEnabledAsync()
    const status = (await Location.requestForegroundPermissionsAsync());
    setPermissionStatus(status.granted);
    await Location.requestBackgroundPermissionsAsync();
    setLoadedPermissions(true);
  }

  // this function is getting the user location and setting it in the state
  async function getUserLocation() {
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
  }

  return { setGeofencingRegions, userLocation, permissionStatus };
}
