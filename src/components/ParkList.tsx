import { FlatList } from 'native-base';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import { ParkingSpot } from '../types/ParkingSpot';
import ParkInfo from './ParkInfo';

interface ItemProp {
  x: ParkingSpotInfo;
  moveToCoordinate: any;
  navigateToSpot: any;
}

const Item = ({ x, moveToCoordinate, navigateToSpot }: ItemProp) => (
  <TouchableOpacity style={styles.item} onPress={() => moveToCoordinate(x)}>
    <ParkInfo parkingSpotInfo={x} navigateToSpot={navigateToSpot} />
  </TouchableOpacity>
);

interface ParkListProps {
  parkingSpots: ParkingSpotInfo[];
  moveToCoordinate(x: ParkingSpot): void;
  changeSpot: any;
  navigateToSpot: any;
}

// this list is rendered in the map screen
export default function ParkList({
  parkingSpots,
  moveToCoordinate,
  changeSpot,
  navigateToSpot
}: ParkListProps) {
  const renderItem = ({ item }: any) => (
    <Item x={item} moveToCoordinate={moveToCoordinate} navigateToSpot={navigateToSpot} />
  );

  return (
    <FlatList
      horizontal
      style={{ position: 'absolute', bottom: 0 }}
      data={parkingSpots?.sort(
        (a: ParkingSpotInfo, b: ParkingSpotInfo) => Number(b!.isFavorite) - Number(a!.isFavorite)
      )}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: '#ffffffe0',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 32
  }
});
