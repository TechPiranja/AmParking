import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import { XMLParser } from 'fast-xml-parser';
import parkingSpotsData from '../data/parkingSpots.json'
import parseToParkingSpots from '../utils/parseToParkingSpots';
import { getParkingSpots, storeParkingSpots, changeIsFavorite } from '../utils/ParkingSpotStorage';
import { Linking, Platform } from 'react-native';

export default function useParkingData() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpotInfo[]>(parkingSpotsData);

  function getParkingData(initial?: ParkingSpotInfo[]) {
    axios
      .get('https://parken.amberg.de/wp-content/uploads/pls/pls.xml')
      .then((response) => {
        let data = new XMLParser().parse(response.data);
        let parsedData = parseToParkingSpots(data, initial ?? parkingSpots!);
        parsedData = parsedData.sort((a: ParkingSpotInfo, b: ParkingSpotInfo) => a.name < b.name ? -1 : 1)
        setParkingSpots([...parsedData]);
        storeParkingSpots(parsedData);
      });
  }

  // loads the data initially
  async function loadDataFromLocalStorage() {
    const data = await getParkingSpots();
    setParkingSpots(data!);
    getParkingData(data!);
  }

  async function changeSpot(id: number, isFavorite: boolean) {
    const data = await changeIsFavorite(id, isFavorite);
    setParkingSpots([...data!]);
  }

  async function navigateToSpot(coords: any, name: string) {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${coords.latitude},${coords.longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url!);
  }

  useEffect(() => {
    loadDataFromLocalStorage();

    // fetching new data every 2 minutes
    const fetchingInterval = setInterval(() => {
      getParkingData();
    }, 120000);

    return () => clearInterval(fetchingInterval);
  }, []);

  return { parkingSpots, changeSpot, navigateToSpot };
}
