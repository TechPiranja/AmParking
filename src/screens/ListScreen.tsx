import { Flex, Switch, Text } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DetailedParkList from '../components/DetailedParkList';
import useParkingData from '../hooks/useParkingData';
import { changeSpeechVolume } from '../redux/reducers/settingsReducer';
import { ParkingSpot } from '../types/ParkingSpot';
import { SETTINGS } from '../types/Settings';
import { storeSetting } from '../utils/SettingsStorage';

export default function ListScreen() {
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const { parkingSpots, changeSpot, navigateToSpot } = useParkingData();

  return (
    <View style={styles.container}>
      <DetailedParkList
        parkingSpots={parkingSpots}
        changeSpot={changeSpot}
        navigateToSpot={navigateToSpot}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
