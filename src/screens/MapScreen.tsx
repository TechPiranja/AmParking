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
import * as TaskManager from 'expo-task-manager';
import { LocationRegion } from 'expo-location';
import useNotify from '../hooks/useNotify';

const GEOFENCING = 'GEOFENCING';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { parkingSpots, changeSpot, navigateToSpot } = useParkingData();
  const { notify } = useNotify();
  let mapRef = useRef<any>(null); // ref => { current: null }

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setMapLocation(location);
      console.warn(location);

      //await Location.requestBackgroundPermissionsAsync();

      TaskManager.defineTask(GEOFENCING, ({ data: { eventType, region }, error }: any) => {
        if (error) {
          notify('Fehler', false);
          return;
        }
        if (eventType === Location.GeofencingEventType.Enter) {
          console.log("You've entered region:", region);
          notify('Parkhaus ' + region.identifier + ' in der Nähe!');
        } else if (eventType === Location.GeofencingEventType.Exit) {
          //console.log("You've left region:", region);
        }
      });

      notify('Parkhaus in Nähe!');
    })();
  }, []);

  useEffect(() => {
    if (loading === false) {
      const regions: LocationRegion[] = [];
      parkingSpots.map((x) =>
        regions.push({
          identifier: x.name,
          latitude: x.latitude,
          longitude: x.longitude,
          radius: 300,
          notifyOnEnter: true
        })
      );
      Location.startGeofencingAsync(GEOFENCING, regions);
    }
  }, [loading]);

  useEffect(() => {
    if (loading && parkingSpots.length > 0) setLoading(false);
  }, [parkingSpots]);

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
              <ParkInfo
                parkingSpotInfo={x}
                changeSpot={changeSpot}
                navigateToSpot={navigateToSpot}
              />
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
      <ParkList
        parkingSpots={parkingSpots}
        moveToCoordinate={moveToCoordinate}
        changeSpot={changeSpot}
        navigateToSpot={navigateToSpot}
      />
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
