import { useEffect, useState } from 'react';
import useNotify from './useNotify';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { LocationRegion } from 'expo-location';
import getClosestRegion from '../utils/getClosestRegion';

const GEOFENCING = 'GEOFENCING';

export default function useGeofences() {
  const [enteredGeofences, setEnteredGeofences] = useState<LocationRegion[]>([]);
  const [geofencingRegions, setGeofencingRegions] = useState<LocationRegion[]>([]);
  const [closestRegion, setClosestRegion] = useState<LocationRegion | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<any>(null);
  const { notify } = useNotify();

  useEffect(() => {
    Location.startGeofencingAsync(GEOFENCING, geofencingRegions);
  }, [geofencingRegions])

  async function updateClosestRegion() {
    setClosestRegion(await getClosestRegion(enteredGeofences));
  }

  useEffect(() => {
    updateClosestRegion();
    console.warn("updating choosen one")
  }, [enteredGeofences])

  async function getUserLocation() {
    await Location.requestForegroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
  }

  useEffect(() => {
    getUserLocation();
    const LocationInterval = setInterval(() => {
      getUserLocation();
    }, 3000);
    return () => clearInterval(LocationInterval);
  }, []);

  function addToList(region: LocationRegion) {
    let findDuplicate = enteredGeofences.find(x => x.latitude == region.latitude && x.longitude == region.longitude);
    if (!findDuplicate) {
      setEnteredGeofences([...enteredGeofences, region]);
    }
  }

  function removeFromList(region: LocationRegion) {
    let filteredList = enteredGeofences.filter(x => x.latitude != region.latitude && x.longitude != region.longitude);
    setEnteredGeofences(filteredList);
  }

  useEffect(() => {
    TaskManager.defineTask(GEOFENCING, ({ data: { eventType, region }, error }: any) => {
      if (error) {
        notify('Fehler', false);
        return;
      }
      if (eventType === Location.GeofencingEventType.Enter) {
        console.log("You've entered region:", region);
        addToList(region);
        notify('Parkhaus ' + region.identifier + ' in der Nähe!');
      } else if (eventType === Location.GeofencingEventType.Exit) {
        removeFromList(region);
      }
    });
  }, []);

  return { setGeofencingRegions, closestRegion, userLocation };
}
