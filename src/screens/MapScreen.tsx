import React, { useState, useEffect, useRef } from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Box, Text } from 'native-base';

import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import * as Location from 'expo-location';
import useParkingData from '../hooks/useParkingData';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import ParkList from '../components/ParkList';
import { ParkingSpot } from '../types/ParkingSpot';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const parkingSpots = useParkingData();
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

  function moveToCoordinate(x:ParkingSpot) {
    mapRef.current.animateCamera({
      center: {
        latitude: x.latitude,
        longitude: x.longitude
      },
      pitch: 2,
      altitude: 2000
    })
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
            onPress={() =>
              mapRef.current.animateCamera({
                center: {
                  latitude: x.latitude,
                  longitude: x.longitude
                },
                pitch: 2,
                altitude: 2000
              })
            }
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
            <Callout style={{ width: 150 }}>
              <Text fontSize="md" bold>
                {x.name}
              </Text>
              <Text>
                <Text bold>Belegt: </Text> {x?.current?.toString() ?? 'no data'} /{' '}
                {x?.total?.toString() ?? 'no data'}
              </Text>
              <Text>
                <Text bold>Frei: </Text> {x?.free?.toString() ?? 'no data'}
              </Text>
              <Text>
                <Text bold>Trend: </Text>{' '}
                <Icon as={Ionicons} name={x?.trend ? 'trending-down' : 'trending-up'} />
              </Text>
              {/* <Text>
                <Text bold>Status: </Text> {x?.state?.toString() ?? 'no data'}
              </Text> */}
              <Text bold style={{ color: x?.closed ? 'red' : 'green' }}>
                {x?.closed ? 'Geschlossen' : 'Offen'}
              </Text>
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
      <ParkList parkingSpots={parkingSpots} setMapLocation={setMapLocation} />
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
