import { FlatList, Icon, Text, View } from 'native-base';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import { Ionicons } from '@expo/vector-icons';

interface ItemProp {
  x: ParkingSpotInfo;
}

const Item = ({ x }: ItemProp) => (
  <View style={styles.item}>
    <Text fontSize="md" bold>
      {x?.name}
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
    <Text>
      <Text bold>Status: </Text> {x?.state?.toString() ?? 'no data'}
    </Text>
    <Text bold style={{ color: x?.closed ? 'red' : 'green' }}>
      {x?.closed ? 'Geschlossen' : 'Offen'}
    </Text>
  </View>
);

interface ParkListProps {
  parkingSpots: ParkingSpotInfo[];
}

export default function ParkList({ parkingSpots }: ParkListProps) {
  const renderItem = ({ item }: any) => <Item x={item} />;
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
