import { FlatList } from 'native-base';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import { ParkingSpot } from '../types/ParkingSpot';
import ParkInfo from './ParkInfo';

interface ItemProp {
  x: ParkingSpotInfo;
  moveToCoordinate: any;
}

const Item = ({ x, moveToCoordinate }: ItemProp) => (
  <TouchableOpacity style={styles.item} onPress={() => moveToCoordinate(x)}>
    <ParkInfo parkingSpotInfo={x} />
  </TouchableOpacity>
);

interface ParkListProps {
  parkingSpots: ParkingSpotInfo[];
  moveToCoordinate(x: ParkingSpot): void;
}

export default function ParkList({ parkingSpots, moveToCoordinate }: ParkListProps) {
  const renderItem = ({ item }: any) => <Item x={item} moveToCoordinate={moveToCoordinate} />;
  return (
    <FlatList
      horizontal
      style={{ position: 'absolute', bottom: 0 }}
      data={parkingSpots}
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
