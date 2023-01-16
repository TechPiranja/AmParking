import { useNavigation } from '@react-navigation/native';
import { FlatList, Icon, IconButton, ScrollView } from 'native-base';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useParkingData from '../hooks/useParkingData';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import ParkInfo from './ParkInfo';

interface ItemProp {
  x: ParkingSpotInfo;
  navigation: any;
  changeSpot: any;
}

const Item = ({ x, navigation, changeSpot }: ItemProp) => (
  <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Parkdetails', { x })}>
    <Text>{x.name}</Text>
    <IconButton
      style={{ margin: -15 }}
      size="lg"
      icon={<Icon as={Ionicons} name={x?.isFavorite ? 'star' : 'star-outline'} />}
      borderRadius="full"
      onPress={() => changeSpot(x?.id, !x.isFavorite ?? true)}
    />
  </TouchableOpacity>
);

interface ParkListProps {
  parkingSpots: ParkingSpotInfo[];
  changeSpot: any;
  navigateToSpot: any;
}

const ItemDivider = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#939393'
      }}
    />
  );
};

export default function DetailedParkList() {
  const navigation = useNavigation();
  const { parkingSpots, changeSpot } = useParkingData();

  const renderItem = ({ item }: any) => (
    <Item x={item} navigation={navigation} changeSpot={changeSpot} />
  );
  return (
    <ScrollView style={{ flex: 1 }}>
      <FlatList
        data={parkingSpots?.sort(
          (a: ParkingSpotInfo, b: ParkingSpotInfo) => Number(b!.isFavorite) - Number(a!.isFavorite)
        )}
        ItemSeparatorComponent={ItemDivider}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    margin: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 32
  }
});
