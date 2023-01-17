import React, { useState, useEffect, useRef } from 'react';
import MapView, { Callout, Circle, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Box, Icon, IconButton, Text } from 'native-base';
import useParkingData from '../hooks/useParkingData';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import ParkList from '../components/ParkList';
import { ParkingSpot } from '../types/ParkingSpot';
import ParkInfo from '../components/ParkInfo';
import { LocationRegion } from 'expo-location';
import useGeofences from '../hooks/useGeofences';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getParkingSpots } from '../utils/ParkingSpotStorage';
import { useIsFocused } from '@react-navigation/native';

// the mapscreen shows map related data about the parkingspots
export default function MapScreen() {
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { parkingSpots, changeSpot, navigateToSpot } = useParkingData();
  const [spots, setSpots] = useState<ParkingSpotInfo[]>([]);
  const { setGeofencingRegions, userLocation, permissionStatus } = useGeofences();
  const geofences = useSelector((state: any) => state.geofences);
  const settings = useSelector((state: any) => state.settings);
  let mapRef = useRef<any>(null);
  const isFocused = useIsFocused();

  // everytime the hook updates data, the component data gets updated too
  useEffect(() => {
    setSpots(parkingSpots);
  }, [parkingSpots]);

  // gets data from storage and sets it in component
  async function getInitialData() {
    const data = await getParkingSpots();
    if (data) setSpots(data);
  }

  // when the screen gets the focus, data will be loaded from storage
  useEffect(() => {
    getInitialData();
  }, [isFocused]);

  // every time the user location changes, the map location changes also
  // this is needed in order to center the map on the user
  // if a callout is beeing pressed, the map centers on the position of the parkingspot
  useEffect(() => {
    setMapLocation(userLocation);
  }, [userLocation]);

  // if we have parkingdata we can define the parkingspot regions for the geofences
  // this is also updated if the radius is being changed
  useEffect(() => {
    if (loading === false) {
      const regions: LocationRegion[] = [];
      spots.map((x: ParkingSpotInfo) =>
        regions.push({
          identifier: x.name,
          latitude: x.latitude,
          longitude: x.longitude,
          radius: settings?.radius ?? 300,
          notifyOnEnter: true
        })
      );
      setGeofencingRegions(regions);
    }
  }, [loading, settings?.radius]);

  //if the parkingspots change, we now that we have loaded the data
  useEffect(() => {
    if (loading && parkingSpots.length > 0) setLoading(false);
  }, [parkingSpots]);

  // this function enables a smooth animation to the selected parkingspot on the map
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
      {permissionStatus && (
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
          {spots?.map((x: ParkingSpotInfo) => (
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
                  navigateToSpot={navigateToSpot}
                  changeSpot={changeSpot}
                />
              </Callout>
            </Marker>
          ))}
          <Circle
            center={userLocation?.coords}
            radius={settings?.radius ?? 300}
            fillColor="rgba(6, 172, 244, 0.26)"
            strokeColor="rgba(0, 0, 0, 0)"
          />
          {geofences?.closestRegion && userLocation?.coords && settings.pseudoNavigation && (
            <Polyline
              coordinates={[
                {
                  latitude: userLocation?.coords.latitude,
                  longitude: userLocation?.coords?.longitude
                },
                {
                  latitude: geofences?.closestRegion?.latitude,
                  longitude: geofences?.closestRegion?.longitude
                }
              ]}
              strokeWidth={4}
            />
          )}
        </MapView>
      )}
      {geofences?.closestRegion?.identifier && (
        <View
          style={{
            position: 'absolute',
            bottom: 160,
            width: '95%',
            backgroundColor: '#ddefffce',
            padding: 10,
            borderRadius: 10
          }}>
          <Text>{'Parkhaus in der Nähe: ' + geofences?.closestRegion?.identifier ?? ''}</Text>
          <IconButton
            style={{ position: 'absolute', bottom: -5, right: 5 }}
            size="lg"
            icon={<Icon as={Ionicons} name={'navigate'} />}
            borderRadius="full"
            onPress={() =>
              navigateToSpot(
                {
                  latitude: geofences?.closestRegion!.latitude,
                  longitude: geofences?.closestRegion!.longitude
                },
                geofences?.closestRegion!.identifier
              )
            }
          />
        </View>
      )}
      {!permissionStatus && (
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            backgroundColor: '#eee'
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18
            }}>
            Standortzugriff wurde nicht gewährt!
          </Text>
        </View>
      )}
      <ParkList
        parkingSpots={spots}
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
