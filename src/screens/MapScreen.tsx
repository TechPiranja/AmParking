import React, { useState, useEffect, useRef } from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Box, Text } from 'native-base';

import * as Location from 'expo-location';
import useParkingData from '../hooks/useParkingData';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import ParkList from '../components/ParkList';
import { ParkingSpot } from '../types/ParkingSpot';
import ParkInfo from '../components/ParkInfo';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const { parkingSpots, changeSpot } = useParkingData();
  let mapRef = useRef<any>(null); // ref => { current: null }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setMapLocation(location);
    })();
  }, []);

  function moveToCoordinate(x: ParkingSpot) {
    mapRef.current.animateCamera({
      center: {
        latitude: x.latitude,
        longitude: x.longitude
      },
      pitch: 2,
      altitude: 4000
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={(map) => {
          mapRef.current = map;
        }}
        style={styles.map}
        region={{
          latitude: mapLocation?.coords.latitude,
          longitude: mapLocation?.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.02
        }}
        showsUserLocation
        showsCompass
        showsScale>
        {parkingSpots?.map((x: ParkingSpotInfo) => (
          <Marker
            key={x.id}
            onPress={() => moveToCoordinate(x)}
            coordinate={{ latitude: x.latitude, longitude: x.longitude }}
            description={x?.total?.toString() ?? 'no data'}>
            <Box
              style={{
                justifyContent: 'center',
                backgroundColor: '#113371',
                width: 30,
                height: 30,
                borderRadius: 20
              }}>
              <Text bold fontSize="lg" style={{ textAlign: 'center', color: '#fff' }}>
                P
              </Text>
            </Box>
            <Callout>
              <ParkInfo parkingSpotInfo={x} changeSpot={changeSpot} />
            </Callout>
          </Marker>
        ))}
        <Circle
          center={userLocation?.coords}
          radius={500}
          fillColor="rgba(6, 172, 244, 0.26)"
          strokeColor="rgba(0, 0, 0, 0)"
        />
      </MapView>
      <ParkList parkingSpots={parkingSpots} moveToCoordinate={moveToCoordinate} changeSpot={changeSpot}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    height: '100%',
    width: '100%'
  }
});
